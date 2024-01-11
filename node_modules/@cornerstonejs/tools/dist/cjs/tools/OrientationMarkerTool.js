"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrientationMarkerWidget_1 = __importDefault(require("@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget"));
const AnnotatedCubeActor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor"));
const AxesActor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/AxesActor"));
const Actor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Actor"));
const Mapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Mapper"));
const XMLPolyDataReader_1 = __importDefault(require("@kitware/vtk.js/IO/XML/XMLPolyDataReader"));
const PolyData_1 = __importDefault(require("@kitware/vtk.js/Common/DataModel/PolyData"));
const base_1 = require("./base");
const core_1 = require("@cornerstonejs/core");
const viewportFilters_1 = require("../utilities/viewportFilters");
const OverlayMarkerType = {
    ANNOTATED_CUBE: 1,
    AXES: 2,
    CUSTOM: 3,
};
class OrientationMarkerTool extends base_1.BaseTool {
    constructor(toolProps = {}, defaultToolProps = {
        configuration: {
            orientationWidget: {
                enabled: true,
                viewportCorner: OrientationMarkerWidget_1.default.Corners.BOTTOM_RIGHT,
                viewportSize: 0.15,
                minPixelSize: 100,
                maxPixelSize: 300,
            },
            overlayMarkerType: OrientationMarkerTool.OVERLAY_MARKER_TYPES.ANNOTATED_CUBE,
            overlayConfiguration: {
                [OrientationMarkerTool.OVERLAY_MARKER_TYPES.ANNOTATED_CUBE]: {
                    faceProperties: {
                        xPlus: { text: 'R', faceColor: '#ffff00', faceRotation: 90 },
                        xMinus: { text: 'L', faceColor: '#ffff00', faceRotation: 270 },
                        yPlus: {
                            text: 'P',
                            faceColor: '#00ffff',
                            fontColor: 'white',
                            faceRotation: 180,
                        },
                        yMinus: { text: 'A', faceColor: '#00ffff', fontColor: 'white' },
                        zPlus: { text: 'S' },
                        zMinus: { text: 'I' },
                    },
                    defaultStyle: {
                        fontStyle: 'bold',
                        fontFamily: 'Arial',
                        fontColor: 'black',
                        fontSizeScale: (res) => res / 2,
                        faceColor: '#0000ff',
                        edgeThickness: 0.1,
                        edgeColor: 'black',
                        resolution: 400,
                    },
                },
                [OrientationMarkerTool.OVERLAY_MARKER_TYPES.AXES]: {},
                [OrientationMarkerTool.OVERLAY_MARKER_TYPES.CUSTOM]: {
                    polyDataURL: 'https://raw.githubusercontent.com/Slicer/Slicer/80ad0a04dacf134754459557bf2638c63f3d1d1b/Base/Logic/Resources/OrientationMarkers/Human.vtp',
                },
            },
        },
    }) {
        super(toolProps, defaultToolProps);
        this.configuration_invalidated = true;
        this.onSetToolEnabled = () => {
            this.initViewports();
            this.configuration_invalidated = true;
        };
        this.onSetToolActive = () => {
            this.initViewports();
        };
        this.onSetToolDisabled = () => {
            this.cleanUpData();
        };
        this.orientationMarkers = {};
        this.configuration_invalidated = true;
    }
    cleanUpData() {
        const renderingEngines = (0, core_1.getRenderingEngines)();
        const renderingEngine = renderingEngines[0];
        const viewports = renderingEngine.getViewports();
        viewports.forEach((viewport) => {
            const orientationMarker = this.orientationMarkers[viewport.id];
            if (!orientationMarker) {
                return;
            }
            const { actor, orientationWidget } = orientationMarker;
            orientationWidget === null || orientationWidget === void 0 ? void 0 : orientationWidget.setEnabled(false);
            orientationWidget === null || orientationWidget === void 0 ? void 0 : orientationWidget.delete();
            actor === null || actor === void 0 ? void 0 : actor.delete();
            const renderWindow = viewport
                .getRenderingEngine()
                .offscreenMultiRenderWindow.getRenderWindow();
            renderWindow.render();
            viewport.getRenderingEngine().render();
            delete this.orientationMarkers[viewport.id];
        });
    }
    initViewports() {
        const renderingEngines = (0, core_1.getRenderingEngines)();
        const renderingEngine = renderingEngines[0];
        if (!renderingEngine) {
            return;
        }
        let viewports = renderingEngine.getViewports();
        viewports = (0, viewportFilters_1.filterViewportsWithToolEnabled)(viewports, this.getToolName());
        viewports.forEach((viewport) => this.addAxisActorInViewport(viewport));
    }
    addAxisActorInViewport(viewport) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewportId = viewport.id;
            const type = this.configuration.overlayMarkerType;
            const overlayConfiguration = this.configuration.overlayConfiguration[type];
            if (this.orientationMarkers[viewportId]) {
                const { actor, orientationWidget } = this.orientationMarkers[viewportId];
                viewport.getRenderer().removeActor(actor);
                orientationWidget.setEnabled(false);
            }
            let actor;
            if (type === 1) {
                actor = this.createAnnotationCube(overlayConfiguration);
            }
            else if (type === 2) {
                actor = AxesActor_1.default.newInstance();
            }
            else if (type === 3) {
                actor = yield this.createCustomActor();
            }
            const renderer = viewport.getRenderer();
            const renderWindow = viewport
                .getRenderingEngine()
                .offscreenMultiRenderWindow.getRenderWindow();
            const { enabled, viewportCorner, viewportSize, minPixelSize, maxPixelSize, } = this.configuration.orientationWidget;
            const orientationWidget = OrientationMarkerWidget_1.default.newInstance({
                actor,
                interactor: renderWindow.getInteractor(),
                parentRenderer: renderer,
            });
            orientationWidget.setEnabled(enabled);
            orientationWidget.setViewportCorner(viewportCorner);
            orientationWidget.setViewportSize(viewportSize);
            orientationWidget.setMinPixelSize(minPixelSize);
            orientationWidget.setMaxPixelSize(maxPixelSize);
            orientationWidget.updateMarkerOrientation();
            this.orientationMarkers[viewportId] = {
                orientationWidget,
                actor,
            };
            renderWindow.render();
            viewport.getRenderingEngine().render();
            this.configuration_invalidated = false;
        });
    }
    createCustomActor() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.configuration.overlayConfiguration[OverlayMarkerType.CUSTOM]
                .polyDataURL;
            const response = yield fetch(url);
            const arrayBuffer = yield response.arrayBuffer();
            const vtpReader = XMLPolyDataReader_1.default.newInstance();
            vtpReader.parseAsArrayBuffer(arrayBuffer);
            vtpReader.update();
            const polyData = PolyData_1.default.newInstance();
            polyData.shallowCopy(vtpReader.getOutputData());
            polyData.getPointData().setActiveScalars('Color');
            const mapper = Mapper_1.default.newInstance();
            mapper.setInputData(polyData);
            mapper.setColorModeToDirectScalars();
            const actor = Actor_1.default.newInstance();
            actor.setMapper(mapper);
            actor.rotateZ(180);
            return actor;
        });
    }
    createAnnotationCube(overlayConfiguration) {
        const actor = AnnotatedCubeActor_1.default.newInstance();
        actor.setDefaultStyle(Object.assign({}, overlayConfiguration.defaultStyle));
        actor.setXPlusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.xPlus));
        actor.setXMinusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.xMinus));
        actor.setYPlusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.yPlus));
        actor.setYMinusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.yMinus));
        actor.setZPlusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.zPlus));
        actor.setZMinusFaceProperty(Object.assign({}, overlayConfiguration.faceProperties.zMinus));
        return actor;
    }
    createAnnotatedCubeActor() {
        return __awaiter(this, void 0, void 0, function* () {
            const axes = AnnotatedCubeActor_1.default.newInstance();
            const { faceProperties, defaultStyle } = this.configuration.annotatedCube;
            axes.setDefaultStyle(defaultStyle);
            Object.keys(faceProperties).forEach((key) => {
                const methodName = `set${key.charAt(0).toUpperCase() + key.slice(1)}FaceProperty`;
                axes[methodName](faceProperties[key]);
            });
            return axes;
        });
    }
}
OrientationMarkerTool.CUBE = 1;
OrientationMarkerTool.AXIS = 2;
OrientationMarkerTool.VTPFILE = 3;
OrientationMarkerTool.OVERLAY_MARKER_TYPES = OverlayMarkerType;
OrientationMarkerTool.toolName = 'OrientationMarker';
exports.default = OrientationMarkerTool;
//# sourceMappingURL=OrientationMarkerTool.js.map