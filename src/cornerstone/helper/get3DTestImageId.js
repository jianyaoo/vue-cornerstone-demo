import createImageIdsAndCacheMetaData from "@/cornerstone/dicomwebClient/createImageIdsAndCacheMetaData";

export default async function () {
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409',
    wadoRsRoot: 'https://domvja9iplmyu.cloudfront.net/dicomweb',
  });

  return imageIds;
}
