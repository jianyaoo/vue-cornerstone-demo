<script>

</script>

<template>
  <div class="base">
    <h2 class="title">
      基础渲染功能演示
    </h2>
    
    <el-alert
      title="📣 📣 📣 演示Demo为单页面系统，如果切换页面后有报错信息，主要与销毁后重新加载Cornerstone有关，刷新页面即可"
    />
    
    <el-alert
      title="🌟 🌟 🌟 从cornerstone服务器加载演示数据源，加载较慢请稍等"
    />
    
    <el-divider content-position="center">
      ⏰ ⏰ ⏰ 影像加载需要时间，请勿频繁切换页面导致请求回数据后找不到DOM
    </el-divider>
    
    <div class="cs-image">
      <router-view />
    </div>
  </div>
</template>


<style lang="scss">
.title {
  color: #fff;
}

.el-alert--info.is-light {
  background: #061C49;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #96CDF2;
}

.cs-image{
  margin: 20px 0;
}
</style>
