import { NamedStatistics } from '../../../types';
import Calculator from './Calculator';
export default class BasicStatsCalculator extends Calculator {
    private static max;
    private static min;
    private static sum;
    private static count;
    private static runMean;
    private static m2;
    private static pointsInShape;
    static statsInit(options: {
        noPointsCollection: boolean;
    }): void;
    static statsCallback: ({ value: newValue, pointLPS }: {
        value: any;
        pointLPS?: any;
    }) => void;
    static getStatistics: (options?: {
        unit: string;
    }) => NamedStatistics;
}
