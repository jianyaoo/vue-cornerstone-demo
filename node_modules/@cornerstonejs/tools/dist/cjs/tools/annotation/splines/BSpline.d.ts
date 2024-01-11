import { CubicSpline } from './CubicSpline';
declare class BSpline extends CubicSpline {
    protected getTransformMatrix(): number[];
}
export { BSpline as default, BSpline };
