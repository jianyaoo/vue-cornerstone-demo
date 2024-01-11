import IPoints from './IPoints';
declare type ITouchPoints = IPoints & {
    touch: {
        identifier: string;
        radiusX: number;
        radiusY: number;
        force: number;
        rotationAngle: number;
    };
};
export default ITouchPoints;
