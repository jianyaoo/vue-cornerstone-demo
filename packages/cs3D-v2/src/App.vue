<script setup>
	import routes from "./router/routes";
	import { House } from "@element-plus/icons-vue";
	
	const displayRoutes = ref(routes.filter((item) => item.name));
	const isCollapse = ref(false);
</script>

<template>
  <el-container class="page-container">
    <el-header class="page-header">
      <h1>cornerstone3D在线演示（Vue3版本 + Cornerstone2.x版本）</h1>
    </el-header>
		
    <el-container>
      <el-aside width="300px">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <el-sub-menu
            v-for="(route, routeIndex) in displayRoutes"
            :key="`router${routeIndex}`"
            :index="routeIndex.toString()"
          >
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span>{{ route.name }}</span>
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
          </el-sub-menu>
        </el-menu>
      </el-aside>
			
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">;
@import "~@/style/index";
@import "~@/style/cs";

.page-container {
	min-height: 1000px;
	
	.page-header {
		background: #061C49;
		color: #fff;
		min-height: 80px;
		line-height: 80px;
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

.el-menu-item.is-active {
	background: #061C49;
}

i {
	color: #000;
	margin-right: 3px;
}
</style>
