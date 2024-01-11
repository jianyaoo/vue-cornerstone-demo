import { FullDateInterface } from './combineDateTime';
import { calculateScanTimes } from './calculateScanTimes';
import {
  calculateSUVlbmJanmahasatianScalingFactor,
  calculateSUVlbmScalingFactor,
  SUVlbmScalingFactorInput,
} from './calculateSUVlbmScalingFactor';
import {
  calculateSUVbsaScalingFactor,
  SUVbsaScalingFactorInput,
} from './calculateSUVbsaScalingFactor';
import { calculateStartTime } from './calculateStartTime';
import { InstanceMetadata } from './types';

/**
 * Javascript object containing the SUV and SUL factors.
 * TODO, the result property names may changes
 *
 * @interface ScalingFactorResult
 */
interface ScalingFactorResult {
  suvbw: number;
  suvlbm?: number;
  suvlbmJanma?: number;
  suvbsa?: number;
}

/**
 * The injected dose used to calculate SUV is corrected for the
 * decay that occurs between the time of injection and the start of the scan
 *
 * @param {InstanceMetadata[]} instances
 * @returns {number[]}
 */
function calculateDecayCorrection(instances: InstanceMetadata[]): number[] {
  const {
    RadionuclideTotalDose,
    RadionuclideHalfLife,
    RadiopharmaceuticalStartDateTime,
    RadiopharmaceuticalStartTime,
    SeriesDate,
  } = instances[0];

  if (RadionuclideTotalDose === undefined || RadionuclideTotalDose === null) {
    throw new Error(
      'calculateDecayCorrection : RadionuclideTotalDose value not found.'
    );
  }

  if (RadionuclideHalfLife === undefined || RadionuclideHalfLife === null) {
    throw new Error(
      'calculateDecayCorrection : RadionuclideHalfLife value not found.'
    );
  }

  const scanTimes: FullDateInterface[] = calculateScanTimes(instances);
  const startTime: FullDateInterface = calculateStartTime({
    RadiopharmaceuticalStartDateTime,
    RadiopharmaceuticalStartTime,
    SeriesDate,
  });

  return instances.map((_, index) => {
    const scanTime = scanTimes[index];
    const decayTimeInSec: number =
      scanTime.getTimeInSec() - startTime.getTimeInSec();
    if (decayTimeInSec < 0) {
      throw new Error('Decay time cannot be less than zero');
    }

    const decayedDose: number =
      RadionuclideTotalDose *
      Math.pow(2, -decayTimeInSec / RadionuclideHalfLife);

    return 1 / decayedDose;
  });
}

/**
 *
 * @param a Simple value or array of simple values
 * @param b Simple value or array of simple values
 * @returns boolean true if the values are equal.
 */
const deepEquals = (
  a: string | number | any[],
  b: string | number | any[]
): boolean => {
  return (
    a === b ||
    (Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]))
  );
};

/**
 * Calculate the SUV factor
 *
 * Note: Rescale Slope / Intercept must still be applied. These must be applied
 *       on a per-Frame basis, since some scanners may have different values per Frame.
 *
 * @export
 * @param {InstanceMetadata[]} instances
 * @returns {ScalingFactorResult[]}
 */
export default function calculateSUVScalingFactors(
  instances: InstanceMetadata[]
): ScalingFactorResult[] {
  const {
    CorrectedImage,
    Units,
    PhilipsPETPrivateGroup,
    PatientWeight,
    PatientSex,
    PatientSize,
  } = instances[0];

  if (!CorrectedImage.includes('ATTN') || !CorrectedImage.includes('DECY')) {
    throw new Error(
      `CorrectedImage must contain "ATTN" and "DECY": ${CorrectedImage}`
    );
  }

  // Sanity check that every instance provided has identical
  // values for series-level metadata. If not, the provided
  // data is invalid.
  const isSingleSeries = instances.every(instance => {
    return (
      instance.Units === Units &&
      deepEquals(instance.CorrectedImage, CorrectedImage) &&
      instance.PatientWeight === PatientWeight &&
      instance.PatientSex === PatientSex &&
      instance.PatientSize === PatientSize &&
      instance.RadionuclideHalfLife === instances[0].RadionuclideHalfLife &&
      instance.RadionuclideTotalDose === instances[0].RadionuclideTotalDose &&
      instance.DecayCorrection === instances[0].DecayCorrection &&
      instance.SeriesDate === instances[0].SeriesDate &&
      instance.SeriesTime === instances[0].SeriesTime
    );
  });

  if (!isSingleSeries) {
    throw new Error(
      'The set of instances does not appear to come from one Series. Every instance must have identical values for series-level metadata properties'
    );
  }

  // Treat null, undefined and zero as a missing PatientWeight.
  if (!PatientWeight) {
    throw new Error(
      'PatientWeight value is missing. It is not possible to calculate the SUV factors'
    );
  }

  let decayCorrectionArray: number[] = new Array(instances.length);
  decayCorrectionArray = calculateDecayCorrection(instances);

  let results: number[] = new Array(instances.length);
  const weightInGrams: number = PatientWeight * 1000;

  if (Units === 'BQML') {
    results = decayCorrectionArray.map(function(value) {
      return value * weightInGrams;
    });
  } else if (Units === 'CNTS') {
    const hasValidSUVScaleFactor: boolean = instances.every(instance => {
      return (
        instance.PhilipsPETPrivateGroup &&
        instance.PhilipsPETPrivateGroup?.SUVScaleFactor !== null &&
        instance.PhilipsPETPrivateGroup?.SUVScaleFactor !== undefined &&
        instance.PhilipsPETPrivateGroup?.SUVScaleFactor !== 0
      );
    });

    const hasValidActivityConcentrationScaleFactor: boolean = instances.every(
      instance => {
        return (
          instance.PhilipsPETPrivateGroup &&
          !instance.PhilipsPETPrivateGroup?.SUVScaleFactor &&
          instance.PhilipsPETPrivateGroup?.ActivityConcentrationScaleFactor !==
            undefined &&
          instance.PhilipsPETPrivateGroup?.ActivityConcentrationScaleFactor !==
            0
        );
      }
    );

    //console.log(`hasValidSUVScaleFactor: ${hasValidSUVScaleFactor}`);
    //console.log(`hasValidActivityConcentrationScaleFactor: ${hasValidActivityConcentrationScaleFactor}`);

    if (hasValidSUVScaleFactor) {
      results = instances.map(
        // Added ! to tell Typescript that this can't be undefined, since we are testing it
        // in the .every loop above.
        instance => instance.PhilipsPETPrivateGroup!.SUVScaleFactor!
      );
    } else if (hasValidActivityConcentrationScaleFactor) {
      // if (0x7053,0x1000) not present, but (0x7053,0x1009) is present, then (0x7053,0x1009) * Rescale Slope,
      // scales pixels to Bq/ml, and proceed as if Units are BQML
      results = instances.map((instance, index) => {
        // Added ! to tell Typescript that this can't be undefined, since we are testing it
        // in the .every loop above.
        return (
          instance.PhilipsPETPrivateGroup!.ActivityConcentrationScaleFactor! *
          decayCorrectionArray[index] *
          weightInGrams
        );
      });
    } else {
      throw new Error(
        `Units are in CNTS, but PhilipsPETPrivateGroup has invalid values: ${JSON.stringify(
          PhilipsPETPrivateGroup
        )}`
      );
    }
  } else if (Units === 'GML') {
    // assumes that GML indicates SUVbw instead of SUVlbm
    results.fill(1);
  } else {
    throw new Error(`Units has an invalid value: ${Units}`);
  }

  // get BSA
  let suvbsaFactor: number | undefined;
  if (PatientSize === null || PatientSize === undefined) {
    console.warn(
      'PatientSize value is missing. It is not possible to calculate the SUV bsa factors'
    );
  } else {
    const sulInputs: SUVbsaScalingFactorInput = {
      PatientWeight,
      PatientSize,
    };

    suvbsaFactor = calculateSUVbsaScalingFactor(sulInputs);
  }

  // get LBM
  let suvlbmFactor: number | undefined;
  let suvlbmJenmaFactor: number | undefined;
  if (PatientSize === null || PatientSize === undefined) {
    console.warn(
      'PatientSize value is missing. It is not possible to calculate the SUV lbm factors'
    );
  } else if (PatientSex === null || PatientSex === undefined) {
    console.warn(
      'PatientSex value is missing. It is not possible to calculate the SUV lbm factors'
    );
  } else {
    const suvlbmInputs: SUVlbmScalingFactorInput = {
      PatientWeight,
      PatientSex,
      PatientSize,
    };

    suvlbmFactor = calculateSUVlbmScalingFactor(suvlbmInputs);
    suvlbmJenmaFactor = calculateSUVlbmJanmahasatianScalingFactor(suvlbmInputs);
  }

  return results.map(function(result, index) {
    const factors: ScalingFactorResult = {
      suvbw: result,
    };

    if (suvbsaFactor) {
      // multiply for BSA
      factors.suvbsa = decayCorrectionArray[index] * suvbsaFactor;
    }

    if (suvlbmFactor) {
      // multiply for LBM
      factors.suvlbm = decayCorrectionArray[index] * suvlbmFactor;
    }

    if (suvlbmJenmaFactor) {
      factors.suvlbmJanma = decayCorrectionArray[index] * suvlbmJenmaFactor;
    }

    // factor formulaes taken from:
    // https://www.medicalconnections.co.uk/kb/calculating-suv-from-pet-images/

    return factors;
  });
}

export { calculateSUVScalingFactors };
