import { Calculator } from '../utilities/math/basic';
declare type SharedToolProp = {
    supportedInteractionTypes?: Array<string>;
    configuration?: ToolConfiguration;
};
export declare type ToolConfiguration = Record<string, any> & {
    statsCalculator?: Calculator;
};
export declare type ToolProps = SharedToolProp;
export declare type PublicToolProps = SharedToolProp & {
    name?: string;
};
export {};
