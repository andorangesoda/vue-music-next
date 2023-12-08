const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')

// Vue CLI 3.x 及更高版本中，使用 defineConfig 够提供更好的类型提示和类型检查，更容易地查看配置选项和避免一些潜在的错误。
module.exports = defineConfig({
  // 关闭设置：所有的依赖模块都会被 Babel 转译
  transpileDependencies: false,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    // before方法已过时，参考https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
    onBeforeSetupMiddleware(devServer) {
      if (typeof registerRouter === 'function') {
        registerRouter(devServer.app)
      } else {
        console.error('registerRouter is not a function')
      }
    }
  }
})
