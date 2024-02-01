<template>
  <div class="base">
    <h2>基础工具显示</h2>
    <el-divider content-position="center"
      >影像加载需要时间，请勿频繁切换页面导致请求回数据后找不到DOM，如果产生报错信息，刷新当前页面即可</el-divider
    >
    <router-view />
  </div>
</template>

<script>
export default {
  name: "BaseApp",
};
</script>

<style scoped lang="scss"></style>
