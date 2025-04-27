import { createApp } from "vue";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from "./router";

import App from "./App.vue";


window.SharedArrayBuffer = ArrayBuffer;

const app = createApp(App).use(router);
app.mount("#app");
