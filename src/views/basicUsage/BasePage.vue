<template>
  <div class="base">
    <h2>基础渲染功能演示</h2>
    <el-divider content-position="center"
      >影像加载需要时间，请勿频繁切换页面导致请求回数据后找不到DOM</el-divider
    >
    <el-alert
      title="演示Demo为单页面系统，如果切换页面后有报错信息，主要与销毁后重新加载Cornerstone有关，刷新页面即可"
      type="danger"
    ></el-alert>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "BaseApp",
};
</script>

<style scoped lang="scss"></style>
