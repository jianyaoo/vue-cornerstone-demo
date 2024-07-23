import { createMemoryHistory, createRouter } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
