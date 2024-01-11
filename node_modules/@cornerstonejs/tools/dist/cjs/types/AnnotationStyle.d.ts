declare type Modes = '' | 'Active' | 'Passive' | 'Enabled';
declare type States = '' | 'Highlighted' | 'Selected' | 'Locked';
declare type Properties = 'color' | 'lineWidth' | 'lineDash' | 'textBoxFontFamily' | 'textBoxFontSize' | 'textBoxColor' | 'textBoxBackground' | 'textBoxLinkLineWidth' | 'textBoxLinkLineDash';
export declare type AnnotationStyle = {
    [key in `${Properties}${States}${Modes}`]?: string;
};
export declare type ToolStyleConfig = {
    [toolName: string]: AnnotationStyle;
} & {
    global?: AnnotationStyle;
};
export declare type StyleConfig = {
    annotations?: {
        [annotationUID: string]: AnnotationStyle;
    };
    viewports?: {
        [viewportId: string]: ToolStyleConfig;
    };
    toolGroups?: {
        [toolGroupId: string]: ToolStyleConfig;
    };
    default: ToolStyleConfig;
};
export declare type StyleSpecifier = {
    viewportId?: string;
    toolGroupId?: string;
    toolName?: string;
    annotationUID?: string;
};
export {};
