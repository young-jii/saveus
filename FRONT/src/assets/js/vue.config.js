const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/saveus/' : '/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
    ],
  },
  devServer: {
    allowedHosts: [
      "young-jii.github.io",
      "3.35.141.132",
      'localhost',
    ],
    host: '0.0.0.0', // 외부 접속을 허용
    port: 8080,
    https: false, // HTTPS 사용
    client: {
      webSocketURL: {
        protocol: 'wss',
        hostname: 'https://jiyoung.pythonanywhere.com',
        port: 443,
        pathname: '/ws',
      },
    },
    proxy: {
      '/api': {
        target: 'https://3.35.141.132',
        changeOrigin: true,
        secure: false,
      },
      '/calculate': {
        target: 'https://3.35.141.132',
        changeOrigin: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://young-jii.github.io', // 특정 도메인만 허용
      'Access-Control-Allow-Credentials': 'true', // 자격 증명 허용
    },
  },
});