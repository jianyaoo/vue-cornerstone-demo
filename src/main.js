import { createApp } from "vue";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from "./App.vue";


window.SharedArrayBuffer = ArrayBuffer;

const app = createApp(App);
app.mount("#app");
