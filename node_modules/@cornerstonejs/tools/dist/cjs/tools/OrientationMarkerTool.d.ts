import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor';
import { BaseTool } from './base';
declare class OrientationMarkerTool extends BaseTool {
    static toolName: any;
    static CUBE: number;
    static AXIS: number;
    static VTPFILE: number;
    orientationMarkers: any;
    polyDataURL: any;
    _resizeObservers: Map<any, any>;
    static OVERLAY_MARKER_TYPES: {
        ANNOTATED_CUBE: number;
        AXES: number;
        CUSTOM: number;
    };
    constructor(toolProps?: {}, defaultToolProps?: {
        configuration: {
            orientationWidget: {
                enabled: boolean;
                viewportCorner: import("@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget/Constants").Corners;
                viewportSize: number;
                minPixelSize: number;
                maxPixelSize: number;
            };
            overlayMarkerType: number;
            overlayConfiguration: {
                [x: number]: {
                    faceProperties: {
                        xPlus: {
                            text: string;
                            faceColor: string;
                            faceRotation: number;
                        };
                        xMinus: {
                            text: string;
                            faceColor: string;
                            faceRotation: number;
                        };
                        yPlus: {
                            text: string;
                            faceColor: string;
                            fontColor: string;
                            faceRotation: number;
                        };
                        yMinus: {
                            text: string;
                            faceColor: string;
                            fontColor: string;
                        };
                        zPlus: {
                            text: string;
                        };
                        zMinus: {
                            text: string;
                        };
                    };
                    defaultStyle: {
                        fontStyle: string;
                        fontFamily: string;
                        fontColor: string;
                        fontSizeScale: (res: any) => number;
                        faceColor: string;
                        edgeThickness: number;
                        edgeColor: string;
                        resolution: number;
                    };
                    polyDataURL?: undefined;
                } | {
                    faceProperties?: undefined;
                    defaultStyle?: undefined;
                    polyDataURL?: undefined;
                } | {
                    polyDataURL: string;
                    faceProperties?: undefined;
                    defaultStyle?: undefined;
                };
            };
        };
    });
    onSetToolEnabled: () => void;
    onSetToolActive: () => void;
    onSetToolDisabled: () => void;
    _getViewportsInfo: () => any[];
    resize: (viewportId: any) => void;
    _unsubscribeToViewportNewVolumeSet(): void;
    _subscribeToViewportEvents(): void;
    private cleanUpData;
    private initViewports;
    addAxisActorInViewport(viewport: any): Promise<void>;
    private createCustomActor;
    private createAnnotationCube;
    createAnnotatedCubeActor(): Promise<vtkAnnotatedCubeActor>;
}
export default OrientationMarkerTool;
