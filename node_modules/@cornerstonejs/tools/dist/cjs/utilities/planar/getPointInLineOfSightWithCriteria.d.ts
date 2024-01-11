import type { Types } from '@cornerstonejs/core';
export default function getPointInLineOfSightWithCriteria(viewport: Types.IVolumeViewport, worldPos: Types.Point3, targetVolumeId: string, criteriaFunction: (intensity: number, point: Types.Point3) => Types.Point3, stepSize?: number): Types.Point3;
