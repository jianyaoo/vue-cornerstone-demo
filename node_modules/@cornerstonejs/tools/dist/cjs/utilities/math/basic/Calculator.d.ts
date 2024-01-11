import { Statistics } from '../../../types';
declare abstract class Calculator {
    static run: ({ value }: {
        value: any;
    }) => void;
    static getStatistics: () => Statistics[];
}
export default Calculator;
