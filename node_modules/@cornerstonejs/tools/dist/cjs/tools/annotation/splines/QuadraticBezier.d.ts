import { QuadraticSpline } from './QuadraticSpline';
declare class QuadraticBezier extends QuadraticSpline {
    hasTangentPoints(): boolean;
    protected getTransformMatrix(): number[];
}
export { QuadraticBezier as default, QuadraticBezier };
