import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import { VOIRange } from '../types';
export default function createSigmoidRGBTransferFunction(voiRange: VOIRange, approximationNodes?: number): vtkColorTransferFunction;
