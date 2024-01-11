import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import { VOIRange } from '../types';
export default function createLinearRGBTransferFunction(voiRange: VOIRange): vtkColorTransferFunction;
