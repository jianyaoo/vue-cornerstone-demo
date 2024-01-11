function getUniversalTime() {
  return +new Date();
}
var vtkTimerLog = {
  getUniversalTime
};

export { vtkTimerLog as default, getUniversalTime };
