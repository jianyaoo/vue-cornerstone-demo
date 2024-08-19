<script>

</script>

<template>
  <div className="base">
    <h2>高级工具使用示例</h2>
    
    <el-alert
      title="📣 📣 📣 演示Demo为单页面系统，如果切换页面后有报错信息，主要与销毁后重新加载Cornerstone有关，刷新页面即可"
    />
    
    <el-alert
      title="🌟 🌟 🌟 从cornerstone服务器加载演示数据源，加载较慢请稍等"
    />
    
    <el-alert
      title="⛳️ ⛳ ⛳️ 高级工具使用部分不再在文件中单独重复Cornerstone初始化相关流程代码，而是使用自定义hooks封装相关逻辑，可在hooks文件中查看"
    />
    
    <el-divider content-position="center">
      ⏰ ⏰ ⏰ 影像加载需要时间，请勿频繁切换页面导致请求回数据后找不到DOM
    </el-divider>
    
    <div className="cs-image">
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

.cs-image {
  margin: 20px 0;
}
</style>
