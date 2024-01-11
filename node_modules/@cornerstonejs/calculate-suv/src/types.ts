/**
 * Philips specific dicom header metadata
 *
 * @export
 * @interface PhilipsPETPrivateGroup
 */
export interface PhilipsPETPrivateGroup {
  SUVScaleFactor: number | undefined; // 0x7053,0x1000
  ActivityConcentrationScaleFactor: number | undefined; // 0x7053,0x1009
}

/**
 * Dicom header metadata
 *
 * @export
 * @interface InstanceMetadata
 */
export interface InstanceMetadata {
  CorrectedImage: string[] | string; // The dcmjs naturalize produces a string value for single item arrays :-(
  Units: string; // 'BQML' | 'CNTS' | 'GML'; // Units (0x0054,0x1001)
  RadionuclideHalfLife: number; // 	RadionuclideHalfLife(0x0018,0x1075)	in	Radiopharmaceutical	Information	Sequence(0x0054,0x0016)
  RadionuclideTotalDose: number;
  DecayCorrection: string; //'ADMIN' | 'START';
  PatientWeight: number;
  SeriesDate: string;
  SeriesTime: string;
  AcquisitionDate: string;
  AcquisitionTime: string;

  // Marked as optional but at least either RadiopharmaceuticalStartDateTime
  // or both RadiopharmaceuticalStartTime and SeriesDate are required.
  RadiopharmaceuticalStartTime?: string; // From the old version of the DICOM standard
  RadiopharmaceuticalStartDateTime?: string;

  PhilipsPETPrivateGroup?: PhilipsPETPrivateGroup;
  GEPrivatePostInjectionDateTime?: string; // (0x0009,0x100d,“GEMS_PETD_01”

  // Only used in Siemens case
  FrameReferenceTime?: number;
  ActualFrameDuration?: number;

  // Only used for SUL
  PatientSize?: number;
  PatientSex?: string; //'M' | 'F';
}
