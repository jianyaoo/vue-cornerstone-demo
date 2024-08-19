import basicUsageRoute from "./basicUsageRoute";
import basicToolRoute from "./basicToolRoute";
import advancedUsageRoute from "./advancedUsageRoute";

const routes = [
  { path: "/", redirect: "/basicUsage/stack" },
  basicUsageRoute,
  basicToolRoute,
  advancedUsageRoute
];

export default routes;
