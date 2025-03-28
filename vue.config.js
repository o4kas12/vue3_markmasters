const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.10.3.116:6200", // адрес вашего сервера
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // удаляет /api из начала пути
      },
      "/markirovka": {
        target: "https://markirovka.crpt.ru", // другой целевой сервер
        changeOrigin: true,
        pathRewrite: { "^/markirovka": "" },
      },
    },
  },
});
