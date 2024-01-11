import { StyleConfig, ToolStyleConfig, StyleSpecifier, AnnotationStyle } from '../../../types/AnnotationStyle';
declare class ToolStyle {
    config: StyleConfig;
    constructor();
    getAnnotationToolStyles(annotationUID: string): AnnotationStyle;
    getViewportToolStyles(viewportId: string): ToolStyleConfig;
    getToolGroupToolStyles(toolGroupId: string): ToolStyleConfig;
    getDefaultToolStyles(): ToolStyleConfig;
    setAnnotationStyles(annotationUID: string, styles: AnnotationStyle): void;
    setViewportToolStyles(viewportId: string, styles: ToolStyleConfig): void;
    setToolGroupToolStyles(toolGroupId: string, styles: ToolStyleConfig): void;
    setDefaultToolStyles(styles: ToolStyleConfig): void;
    getStyleProperty(toolStyle: string, specifications: StyleSpecifier): any;
    private _getToolStyle;
    private _initializeConfig;
}
declare const toolStyle: ToolStyle;
export default toolStyle;
