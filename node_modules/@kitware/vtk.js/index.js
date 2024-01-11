import Common from './Common/index.js';
import Filters from './Filters/index.js';
import Imaging from './Imaging/index.js';
import Interaction from './Interaction/index.js';
import IO from './IO/index.js';
import Rendering from './Rendering/index.js';
import VTKProxy from './Proxy/index.js';
import Widgets from './Widgets/index.js';
import { m as macro } from './macros2.js';
import vtk from './vtk.js';

vtk.Common = Common;
vtk.Filters = Filters;
vtk.Imaging = Imaging;
vtk.Interaction = Interaction;
vtk.IO = IO;
vtk.Proxy = VTKProxy;
vtk.Rendering = Rendering;
vtk.Widgets = Widgets;
vtk.mtime = macro.getCurrentGlobalMTime;
vtk.macro = macro;

// Expose vtk to global scope without exporting it so nested namespace
// do not pollute the global one.
window.vtk = vtk;
