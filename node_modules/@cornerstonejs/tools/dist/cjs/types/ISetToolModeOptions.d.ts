import { ToolModes, MouseBindings, KeyboardBindings } from '../enums';
declare type ToolBindingMouseType = (typeof MouseBindings)[keyof typeof MouseBindings];
declare type ToolBindingKeyboardType = (typeof KeyboardBindings)[keyof typeof KeyboardBindings];
declare type IToolBinding = {
    mouseButton?: ToolBindingMouseType;
    modifierKey?: ToolBindingKeyboardType;
    numTouchPoints?: number;
};
declare type SetToolBindingsType = {
    bindings: IToolBinding[];
};
declare type ToolOptionsType = {
    bindings: IToolBinding[];
    mode: ToolModes;
};
export { IToolBinding, SetToolBindingsType, ToolOptionsType };
