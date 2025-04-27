```JavaScript
import { segmentation } from '@cornerstonejs/tools

// 在对照表的某个位置tian
segmentation.config.color.addColorLUT(colorLUT, colorLUTIndex)

// sets the colorLUT index to use for the segmentation representation
segmentation.config.color.setColorLUT(toolGroupId, representationUID, colorLUTIndex)

// get the color for the segment index
segmentation.config.color.getColorForSegmentIndex(toolGroupId, representationUID, segmentIndex)
```

## 介绍

在介绍Cornerstone3D中的分割器之前，我们先简单介绍一下在医学成像领域的 `Segmentations` 。

在医学成像领域，Segmentations一般指的是图像处理技术，用于标识和隔离成像数据中的特定区域或结构。这项技术被广泛应用于分析和解释放射学图像，如CT、MRI和X光等。它可以帮助医生识别、度量并可视化解剖结构、病理改变或任何特定区域，从而支持诊断、治疗规划和疾病监测。这种技术可以是手动的，由放射科医生或技术人员操作，也可以是半自动或完全自动的，依赖于先进的计算机算法。在Cornerstone3D中提供的分割器就是既可以支持手动操作，也支持半自动化或自动化处理。

**手动标记**

用户根据特定的场景和需求，使用分割器工具进行编辑或标记影像中的特定部分（即分割器作为产品中的一个工具使用，类似于放大器、平移器等等）

**半自动化或自动化**

利用算法对影像进行分析，辅助进行标记和分割（即如果想要自动化标记，单纯依靠Cornerstone无法实现，需要算法支持）



## 特性

在Cornerstone3D中的Segmentations功能具有灵活性和高性能渲染性；

**灵活性**

在Cornerstone3D中，分割器（Segmentation）和可视化表示（Segmentation Representation）被分开处理，提高了灵活性。这种分离允许从同一数据源创建多种可视化展示形式（例如可以在一个分割器中既可以展示圆形分割、也可以展示椭球形分割）

**高性能渲染**

与旧版Cornerstone对元素进行绘制分割和标记而导致重复分割不同，新版本中的Segmentation Representation不再仅限于单个元素，而是应用于整个ToolGroup，使得Segmentation在多个视口（例如MPR视图）中共享和应用。



## 状态管理

在Cornerstone3D中，Segmentation的状态管理涉及多个关键部分。

SegmentationState存储了库中所有关于Segmentation和SegmentationRepresentations的当前状态信息。主要包括以下信息

- `GlobalConfig`：全局配置项，控制所有Segmentation Representation的配置

- `ColorLUT`：存储用于渲染Segmentation Representation的颜色查找表

- `Segmentation`：在状态管理中的分割器对象，主要包含唯一标识符、分割类型及创建分割表示所需的信息等等



### Segmentation

由于分割器（Segmentation）和分割可视化表示（Segmentation Representation）是被分开处理的，所以在状态管理中的 `Segmentation` 是一个包含【分割器信息】+ 【创建该分割器下的可视化表示所需信息】的对象

```JavaScript
{
  segmentationId: 'segmentation1', // 分割器唯一ID，由用户创建时添加
  mainType: 'Labelmap', // 分割类型，内部执行
  activeSegmentIndex: 0, // 当前激活的分割索引，供分割工具使用
  segmentsLocked: new Set(), // 当前被锁定的分割
  label: 'segmentation1', // 分割上显示的标签
  cachedStats: {},
  representationData: { // 当前分割器下的分割可视化信息
    LABELMAP: {
      volumeId: 'segmentation1',
    },
    CONTOUR: {
      geometryIds: ['contourSet1', 'contourSet2'],
    },
  },
}
```



### 向状态管理中新增一个Segmentation

我们可以通过调用@cornerstonejs/tools中的顶层API（addSegmentations）向state中新增一个分割器（Segmentation），📣 **特别注意：当我们在state中新增一个Segmentation时，是不会渲染分割及标记的，只有同时在toolGroup中新增分割可视化表示（Segmentation Representation）才会支持渲染分割。**

```JavaScript
import { segmentation, Enums } from '@cornerstonejs/tools';

segmentation.addSegmentations([
  {
    segmentationId,
    representation: {
      type: Enums.SegmentationRepresentations.Labelmap,
      data: {
        volumeId: segmentationId,
      },
    },
  },
]);
```



### 向ToolGroup中新增一个分割表示

正如上面所说，如果想要渲染一个分割效果，需要同时在state中新增`Segmentation` 和 ToolGroup中新增 `Segmentation Representation`，接下来我们看如何在toolGroup中新增一个 `Segmentation Representation`

```JavaScript
import {
  segmentation,
  SegmentationDisplayTool,
  Enums,
} from '@cornerstonejs/tools';

// 01 - 创建一个工具组
const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

// 02 - 向工具组中新增分割器工具并设置工具可用
toolGroup.addTool(SegmentationDisplayTool.toolName);
toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

// 03 - 使用segmentation模块的addSegmentationRepresentations方法，向对应的Segmentation对象中新增一条表示
await segmentation.addSegmentationRepresentations(toolGroupId, [
  {
    segmentationId,
    type: Enums.SegmentationRepresentations.Labelmap,
  },
]);
```

addSegmentationRepresentations 方法支持三个参数，当某个工具组需要配置特殊的分割表示配置项时，可以传入第三个参数

- toolGroupId：绑定的工具组的ID

- segmentationRepresentation：分割表示数组

- specialConfig：【可选项】仅作用于当前工具组的配置项

```JavaScript
const toolGroupSpecificRepresentationConfig = {
  renderInactiveSegmentations: true,
  representations: {
    [Enums.SegmentationRepresentations.Labelmap]: {
      renderOutline: true,
    },
  },
};

await segmentation.addSegmentationRepresentations(
  toolGroupId,
  [
    {
      segmentationId,
      type: Enums.SegmentationRepresentations.Labelmap,
    },
  ],
  toolGroupSpecificRepresentationConfig
);
```

- 工具使用演示DEMO：[https://github.com/jianyaoo/vue-cornerstone-demo/blob/main/src/views/basicTools/BasicSegmentation.vue](https://github.com/jianyaoo/vue-cornerstone-demo/blob/main/src/views/basicTools/BasicSegmentation.vue)

## 操作API

上面主要介绍了如何使用Segmentation绘制一个分割，对于已经绘制的分割标记，官方提供了一些API支持去操作这些分割标记，包括激活、锁定等等

### 激活API

每一个工具组可以同时展示多个分割标记，但是同一时间有且仅有一个分割标记被激活，而被激活的这个就是可以被工具操作的这个

```JavaScript
import { segmentation } from '@cornerstonejs/tools';

// 获取一个工具组内被激活的分割标记
segmentation.getActiveSegmentationRepresentation(toolGroupId);

// 设置一个工具组内的一个分割标记为激活状态
segmentation.setActiveSegmentationRepresentation(
  toolGroupId,
  representationUID
);
```



### 锁定API

我们可以在分割器内选择一个分割可视化标记进行锁定，被锁定的标记不可以被任何工具修改

```JavaScript
import { segmentation } from '@cornerstonejs/tools';

// 设置锁定
segmentation.locking.setSegmentIndexLocked(
  segmentationId,
  segmentIndex,
  locked
);

//获取被锁定的标记
segmentation.locking.getLockedSegments(segmentationId);

// 检查某个标记是否被锁定
segmentation.locking.isSegmentIndexLocked(
  segmentationId,
  segmentIndex
);
```





## 配置API

在了解了如何操作分割器之后，我们接着来看一下如何配置一个分割器达到自己想要的效果。

在Cornerstone3D的分割器配置中，主要支持两种配置：

- 全局配置：该配置将作用于所有工具组的所有的分割

- 工具组配置：只对配置的工具组起作用，并且优先级高于全局配置（即如果同时在全局配置和工具组配置中设置了同一个配置项，工具组中的配置将总是覆盖全局配置）

### 

## 配置API

在了解了如何操作分割器之后，我们接着来看一下如何配置一个分割器达到自己想要的效果。

在Cornerstone3D的分割器配置中，主要支持两种配置：

- 全局配置：该配置将作用于所有工具组的所有的分割

- 工具组配置：只对配置的工具组起作用，并且优先级高于全局配置（即如果同时在全局配置和工具组配置中设置了同一个配置项，工具组中的配置将总是覆盖全局配置）

### 状态配置API

```JavaScript
import {segmentation, Enums} from '@cornerstonejs/tools

// 获取全局配置项
segmentation.config.getGlobalConfig()

// 设置全局配置项
segmentation.config.setGlobalConfig(config)

// 获取某个工具组特定的配置项
segmentation.config.getToolGroupSpecificConfig(toolGroupId)

// 为某个工具组设置特定的配置项
segmentation.config.setToolGroupSpecificConfig(toolGroupId, config)

// Get global representation configuration for a specific representation (e.g., labelmap)
const representationType = Enums.SegmentationRepresentations.Labelmap
segmentation.config.getGlobalRepresentationConfig(representationType)

// Set global representation configuration for a specific representation (e.g., labelmap)
segmentation.config.setGlobalRepresentationConfig(representationType, config)
```

无论是全局配置还是工具组配置，都支持下面的配置项内容，即上面代码中的参数 `config`

```JavaScript
{
  renderInactiveSegmentations: false,
  representations: {
    LABELMAP: {
      activeSegmentOutlineWidthDelta?: number
      fillAlpha?: number
      fillAlphaInactive?: number
      outlineOpacity?: number
      outlineOpacityInactive?: number
      outlineWidthActive?: number
      outlineWidthInactive?: number
      renderFill?: boolean
      renderFillInactive?: boolean
      renderOutline?: boolean
    },
  },
},

```



### 显示/隐藏API

`Segmentation` 模块提供了对应的API去获取或者设置某个分割标志是否可见

```JavaScript
import { segmentation } from '@cornerstonejs/tools

// 设置工具组下的分割标志是否可见
segmentation.config.visibility.setSegmentationVisibility(toolGroupId, representationUID, visibility)

// 获取工具组下的分割标志是否可见
segmentation.config.visibility.getSegmentationVisibility(toolGroupId, representationUID)
```



### 配置颜色

在 `Segmentation`模块中提供了一组颜色对照表（colorLUT）用来渲染不同索引的分割标记。例如索引为1的分割器将应用colorLUT中索引为1的颜色。

所以如果我们想要改变分割表示的颜色，不能直接在分割标志上配置，而是先在颜色对照表中新增一个我们需要的颜色，然后再设置分期标志的颜色为对照表中对应颜色的索引。

```JavaScript
import { segmentation } from '@cornerstonejs/tools

// 在颜色对照表中新增一个颜色
segmentation.config.color.addColorLUT(colorLUT, colorLUTIndex)

// 设置某个分割标记为添加的颜色
segmentation.config.color.setColorLUT(toolGroupId, representationUID, colorLUTIndex)

// 获取某个分割标记的颜色
segmentation.config.color.getColorForSegmentIndex(toolGroupId, representationUID, segmentIndex)
```



## 总结回顾

/t

