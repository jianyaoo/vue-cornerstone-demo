import vtkArraySerializer from './Serializer/ArraySerializer.js';
import vtkFieldDataSerializer from './Serializer/FieldDataSerializer.js';
import vtkImageDataSerializer from './Serializer/ImageDataSerializer.js';
import vtkPolyDataSerializer from './Serializer/PolyDataSerializer.js';

const LIST = [vtkFieldDataSerializer, vtkImageDataSerializer, vtkPolyDataSerializer];
function getSerializer(obj) {
  return LIST.find(s => s.canSerialize(obj));
}
function getDeserializer(obj) {
  return LIST.find(s => s.canDeserialize(obj));
}
var vtkSerializer = {
  vtkArraySerializer,
  getSerializer,
  getDeserializer
};

export { vtkSerializer as default };
