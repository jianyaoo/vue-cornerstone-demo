<template>
  <el-container class="page-container">
    <el-header class="page-header">
      <h1>cornerstone3D在线演示（基于Vue运行）</h1>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <el-submenu
            v-for="(route, routeIndex) in displayRoutes"
            :key="`router${routeIndex}`"
            :index="routeIndex.toString()"
          >
            <template v-slot:title>
              <i :class="route.icon"></i>
              <span slot="title">{{ route.name }}</span>
            </template>
            <el-menu-item
              v-for="(routeChildren, index) in route.children"
              :key="index"
              :index="`${routeIndex}-${index}`"
            >
              <router-link :to="`${route.path}/${routeChildren.path}`">
                {{ routeChildren.name }}
              </router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import routes from "@/router/routes";

export default {
  name: "APP",
  data() {
    return {
      displayRoutes: routes.filter((item) => item.name),
      isCollapse: false,
    };
  },
};
</script>

<style scoped lang="scss">
.page-container {
  min-height: 1000px;

  .page-header {
    background: #409eff;
    color: #fff;
    min-height: 80px;
    vertical-align: middle;
  }
}

a {
  font-weight: bold;
  color: #2c3e50;

  &.router-link-exact-active {
    color: #409eff;
  }
}
</style>
