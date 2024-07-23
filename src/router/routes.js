import basicUsageRoute from "./basicUsageRoute";
import basicToolRoute from "./basicToolRoute";

const routes = [
  { path: "/", redirect: "/basicUsage/stack" },
  basicUsageRoute,
  // basicToolRoute,
];

export default routes;
