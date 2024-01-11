import calculateSUVScalingFactors from './calculateSUVScalingFactors';
import { InstanceMetadata, PhilipsPETPrivateGroup } from './types';

export { calculateSUVScalingFactors };

// TODO: import type and export type are not working right with tsdx
// we should stop using it.
export { InstanceMetadata, PhilipsPETPrivateGroup };

/*

RadiopharmaceuticalInformationSequence :
Item #0 xfffee000
  Radiopharmaceutical : "Fluorodeoxyglucose"
  RadiopharmaceuticalStartTime : "083045.000000"
  RadionuclideTotalDose : "374000000"
  RadionuclideHalfLife : "6586.2"
  RadionuclidePositronFraction : "0.97"
  RadiopharmaceuticalStartDateTime : "20140618083045.000000"
  RadionuclideCodeSequence :
    Item #0 xfffee000
    CodeValue : "C-111A1"
    CodingSchemeDesignator : "SRT"
    CodeMeaning : "^18^Fluorine"
    MappingResource : "DCMR"
    ContextGroupVersion : "20070625000000.000000"
    ContextIdentifier : "4020"
    RadiopharmaceuticalCodeSequence :
  Item #0 xfffee000
    CodeValue : "C-B1031"
    CodingSchemeDesignator : "SRT"
    CodeMeaning : "Fluorodeoxyglucose F^18^"
    MappingResource : "DCMR"
    ContextGroupVersion : "20070625000000.000000"
    ContextIdentifier : "4021"

*/
