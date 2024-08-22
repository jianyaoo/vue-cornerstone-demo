const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const  ElementPlus  =  require("unplugin-element-plus/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

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
      "Cross-Origin-Resource-Policy":'cross-origin'
    },
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        "@cornerstonejs/tools": "@cornerstonejs/tools/dist/umd/index.js",
        "@cornerstonejs/core": "@cornerstonejs/core/dist/umd/index.js",
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
        {
          test: /\.m?js$/,
          //exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
    plugins: [
      AutoImport.default({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true, // 1、改为true用于生成eslint配置。2、生成后改回false，避免重复生成消耗
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
      }),
      Components.default({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      ElementPlus()
    ],
  },
});
