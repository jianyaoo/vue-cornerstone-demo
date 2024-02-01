"Annotations"（注释）指的是在医学图像上添加的额外信息，例如测量、标记或其他重要信息。这些注释通常用于帮助医生或医学专业人员更好地理解和解释图像，以及进行诊断。

主要从以下几个问题介绍Annotations：

1. 绘制的注释信息如何存储

2. 如何管理注释信息

3. 如何操作或多次操作注释信息

4. 如何更改注释信息的样式

5. 是否可以将相同类型的注释信息进行分组管理

## Annotation State

用于管理和维护注释的一种机制。FrameOfReference注释状态管理器，其中注释使用世界坐标系标注。

- state 是一个普通的JavaScript对象，用于存储annotation实例的状态。例如注释的统计信息、注释数据和相机位置等信息都存储在该对象中。

- 创建新的注释时(注释工具中的addNewAnnotation方法)，将基于元数据和工具的当前状态创建新的**注释数据**，并将其添加到全局注释状态（state）中。

```JavaScript
// 注释数据对象包含的属性
const annotation = {
  // a. 注释状态
  invalidated: boolean, // 注释是否因为某些操作而导致无效
  highlighted: boolean, // 鼠标悬停时是否突出显示注释
  annotationUID: string, // 注释的UID
  // b. 元数据信息
  metadata: {
    viewPlaneNormal: Types.Point3, // （摄像机的视图平面法线）The view plane normal of the camera
    viewUp: Types.Point3, // （相机的视图向上矢量）The view up vector of the camera
    FrameOfReferenceUID: string, // （已绘制注释的viewport的FrameOfReferenceUID）viewport's FrameOfReferenceUID the annotation has been drawn on
    referencedImageId?: string, // （已绘制注释的图像ID）The image ID the annotation has been drawn on (if applicable)
    toolName: string, // The tool name
  },
  // c. 注释数据
  data: {
    handles: {
      points: [Types.Point3], // （手柄点的世界坐标）The handles points in world coordinates (probe tool = 1 handle = 1 x,y,z point)
    },
    cachedStats: {}, // （为注释存储的统计信息）Stored Statistics for the annotation
  },
}
```



### 新增/获取注释

```JavaScript
// Adds annotation
cornerstone3DTools.annotations.state.addAnnotation(element, annotation);

// Remove the annotations given the annotation reference.
cornerstone3DTools.annotations.state.removeAnnotation(element, annotationUID);

// Returns the full annotations for a given Tool
cornerstone3DTools.annotations.state.getAnnotations(element, toolName);

// A helper which returns the single annotation entry matching the UID.
cornerstone3DTools.annotations.state.getAnnotation(annotationUID);
```



## Annotation Manager

Annotation Manager是一个单例类，用于管理CornerstoneTools中的注释，包括：**存储**注释、**检索**注释、**保存**和**恢复**注释。

### 内置

默认的注释管理器FrameOfReferenceSpecificAnnotationManager基于FrameOfReferenceUID存储注释。这意味着注释是被每个FrameOfReferenceUID单独存储的。

目前在渲染管道中，如果两个volumeviewport共享相同的FrameOfReferenceUID，它们将共享相同的注释。然而，StackViewports工作在每个imageId的基础上，所以注释不能在StackViewports之间共享。

### GroupKey

groupKey是一个字符串，用于标识注释组。如上所述，默认Annotation Manager基于FrameOfReferenceUID存储注释，因此groupKey是FrameOfReferenceUID。

### 自定义Manager

你可以通过实现IAnnotationManager接口来创建你自己的自定义注解管理器

```JavaScript
interface IAnnotationManager {
  getGroupKey: (annotationGroupSelector: any) => string; // 获取groupKey标识，
  getAnnotations: ( // 获取给定 groupKey和工具名 的所有注释
    groupKey: string,
    toolName?: string
  ) => Annotations | GroupSpecificAnnotations | undefined;
  addAnnotation: (annotation: Annotation, groupKey?: string) => void; // 向管理器中新增注释
  removeAnnotation: (annotationUID: string) => void; // 移除指定UID的注释
  removeAnnotations: (groupKey: string, toolName?: string) => void; // 移除给定 groupKey和工具名 的所有注释
  saveAnnotations: ( // 保存注释
    groupKey?: string,
    toolName?: string
  ) => AnnotationState | GroupSpecificAnnotations | Annotations;
  restoreAnnotations: ( // 恢复注释
    state: AnnotationState | GroupSpecificAnnotations | Annotations,
    groupKey?: string,
    toolName?: string
  ) => void;
  getNumberOfAllAnnotations: () => number; // 获取注释的个数
  removeAllAnnotations: () => void; // 移除全部的注释
}
```

使用自定义注释管理器

```JavaScript
import { annotation } from '@cornerstonejs/tools';
import myCustomAnnotationManager from './myCustomAnnotationManager';

annotation.state.setAnnotationManager(myCustomAnnotationManager);
```

场景：

- 使用自定注释管理：例如在具有相同的FrameOfReferenceUID的两个VolumeViewport中不共享注释



## 注释操作

### 选中与取消

可以通过按下shift键并且点击注释来选中注释

```JavaScript
import { annotations } from '@cornerstonejs/tools';

// selection of an annotation
annotations.selection.setAnnotationSelected(
  annotationUID,
  (selected = true),
  (preserveSelected = false)
);

// get all the selected annotations
annotations.selection.getAnnotationsSelected();

// get all selected annotations from a specific tool
annotations.selection.getAnnotationsSelectedByToolName(toolName);
```

### 锁定

```JavaScript
import { annotations } from '@cornerstonejs/tools';

// selection of an annotation
annotations.selection.setAnnotationSelected(
  annotationUID,
  (selected = true),
  (preserveSelected = false)
);

// get all the selected annotations
annotations.selection.getAnnotationsSelected();

// get all selected annotations from a specific tool
annotations.selection.getAnnotationsSelectedByToolName(toolName);
```



## 样式配置

### 配置等级

- 注释级别

```JavaScript
annotations.config.styles.setAnnotationToolStyle(annotationUID, style);
```

- 视口级别

```JavaScript
annotations.config.styles.setViewportToolStyle(viewportId, styles);
```

- 工具组级别

```JavaScript
annotations.config.styles.setToolGroupToolStyle(toolGroupId, styles);
```

- 全局

```JavaScript
annotations.config.styles.setDefaultToolStyle(deepMerge(styles, newStyles));
```

### 支持的配置项

```JavaScript
{
  color: 'rgb(255, 255, 0)',
  colorHighlighted: 'rgb(0, 255, 0)',
  colorSelected: 'rgb(0, 220, 0)',
  colorLocked: 'rgb(255, 255, 0)',
  lineWidth: '1',
  lineDash: '',
  textBoxVisibility: true,
  textBoxFontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  textBoxFontSize: '14px',
  textBoxColor: 'rgb(255, 255, 0)',
  textBoxColorHighlighted: 'rgb(0, 255, 0)',
  textBoxColorSelected: 'rgb(0, 255, 0)',
  textBoxColorLocked: 'rgb(255, 255, 0)',
  textBoxBackground: '',
  textBoxLinkLineWidth: '1',
  textBoxLinkLineDash: '2,3',
};
```

## Annotation Groups

为了表明注释是相互关联的，AnnotationGroup类可用于对注释进行分组。

- 创建一个注释组

```JavaScript
const group = new cornerstoneTools.annotation.AnnotationGroup();
```

- 向组中新增注释

如果组处于活动状态，并且对其调用了addListeners方法，则可以自动将注释添加到组中。或者可以通过调用注释组上的add方法手动添加它们。

```JavaScript
group.add(annotation.annotationUID);
```

- 设置注释可见性

可以通过调用注释组上的setVisibility方法来显示/隐藏注释

```JavaScript
group.setVisibility(!group.isVisible, { viewportId, renderingEngineId });
```



## 总结回顾

![02. Tools-注释.png](Annotations+9a601446-6f0e-43b6-9e6e-ecff4f758499/02.+Tools-注释.png)

