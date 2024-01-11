import vtkXMLImageDataReader from './XML/XMLImageDataReader.js';
import vtkXMLImageDataWriter from './XML/XMLImageDataWriter.js';
import vtkXMLPolyDataReader from './XML/XMLPolyDataReader.js';
import vtkXMLPolyDataWriter from './XML/XMLPolyDataWriter.js';
import vtkXMLReader from './XML/XMLReader.js';
import vtkXMLWriter from './XML/XMLWriter.js';

var XML = {
  vtkXMLImageDataReader,
  vtkXMLImageDataWriter,
  vtkXMLPolyDataReader,
  vtkXMLPolyDataWriter,
  vtkXMLReader,
  vtkXMLWriter
};

export { XML as default };
