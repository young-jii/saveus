const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/saveus/' : '/', // 배포 환경에 따라 publicPath 설정
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
      "3a145eca76f9.ngrok.app",
      "3.35.141.132",
      'localhost',
    ],
    host: '0.0.0.0', // 외부 접속을 허용
    port: 8080,
    https: false, // HTTPS 사용 안함
    client: {
      webSocketURL: 'ws://localhost:8080/ws', // 단순화된 WebSocket URL 설정
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Django 서버
        changeOrigin: true,
        secure: false,
      },
      '/calculate': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8000', // 특정 도메인만 허용
      'Access-Control-Allow-Credentials': 'true', // 자격 증명 허용
    },
  },
});
