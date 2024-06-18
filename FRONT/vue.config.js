const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
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
      "3a145eca76f9.ngrok.app",
      "d5bf569728f0.ngrok.app",
      'localhost',
    ],
    host: '0.0.0.0', // 외부 접속을 허용
    port: 8080,
    https: false, // HTTPS 사용
    client: {
      webSocketURL: {
        protocol: 'wss',
        hostname: '3a145eca76f9.ngrok.app', // WebSocket URL 설정
        port: 443,
        pathname: '/ws',
      },
    },
    proxy: {
      '/api': {
        target: 'https://d5bf569728f0.ngrok.app', // Django ngrok 도메인으로 대체
        changeOrigin: true,
        secure: false,
      },
      '/calculate': {
        target: 'https://d5bf569728f0.ngrok.app',
        changeOrigin: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://3a145eca76f9.ngrok.app', // 특정 도메인만 허용
      'Access-Control-Allow-Credentials': 'true', // 자격 증명 허용
    },
  },
});
