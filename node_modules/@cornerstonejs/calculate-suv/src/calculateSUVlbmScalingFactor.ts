/**
 * Javascript object with patient properties size, sez, weight
 *
 * @export
 * @interface SUVlbmScalingFactorInput
 */
interface SUVlbmScalingFactorInput {
  PatientSize: number; // m
  PatientSex: string; //'M' | 'F' | 'O';
  PatientWeight: number; // Kg
}

function calculateSUVlbmScalingFactor(
  inputs: SUVlbmScalingFactorInput
): number {
  const { PatientSex, PatientWeight, PatientSize } = inputs;

  let LBM;
  const weightSizeFactor = Math.pow(PatientWeight / (PatientSize * 100), 2);
  // reference: https://www.medicalconnections.co.uk/kb/calculating-suv-from-pet-images/
  if (PatientSex === 'F') {
    LBM = 1.07 * PatientWeight - 148 * weightSizeFactor;
  } else if (PatientSex === 'M') {
    LBM = 1.1 * PatientWeight - 120 * weightSizeFactor;
  } else {
    throw new Error(`PatientSex is an invalid value: ${PatientSex}`);
  }

  return LBM * 1000; // convert in gr
}

/**
 * From https://link.springer.com/article/10.1007/s00259-014-2961-x
 * and https://link.springer.com/article/10.2165/00003088-200544100-00004
 * and
 * @param inputs
 * @returns
 */
function calculateSUVlbmJanmahasatianScalingFactor(
  inputs: SUVlbmScalingFactorInput
): number {
  const { PatientSex, PatientWeight, PatientSize } = inputs;

  let LBM;
  const bodyMassIndex = PatientWeight / Math.pow(PatientSize, 2);

  if (PatientSex === 'F') {
    LBM = (9270 * PatientWeight) / (8780 + 244 * bodyMassIndex);
  } else if (PatientSex === 'M') {
    LBM = (9270 * PatientWeight) / (6680 + 216 * bodyMassIndex);
  } else {
    throw new Error(`PatientSex is an invalid value: ${PatientSex}`);
  }
  return LBM * 1000; // convert in gr
}

export {
  calculateSUVlbmScalingFactor,
  calculateSUVlbmJanmahasatianScalingFactor,
  SUVlbmScalingFactorInput,
};
