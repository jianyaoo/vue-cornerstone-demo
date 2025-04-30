import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";

export default function initCornerstoneDICOMImageLoader() {
  cornerstoneDICOMImageLoader.init({
    maxWebWorkers : Math.min(navigator.hardwareConcurrency, 4)
  });
}
