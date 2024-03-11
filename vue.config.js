const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ["all"],
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
      },
    },
    experiments: {
      // 基于异步模块的 WebAssembly 实验性特性
      asyncWebAssembly: true,
    },
    // 如果需要对 .wasm 文件进行特殊处理，可以添加 module.rules 配置
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: "webassembly/async", // 异步 WebAssembly 类型
          // 对于同步的 WebAssembly，使用 'webassembly/sync'
        },
      ],
    },
  },
});
