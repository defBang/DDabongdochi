const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  //publicPath: "./",
  devServer: {
    proxy: {
      "/back": {
        target: "http://ddabongdochi.com", // http://localhost8080
        changeOrigin: true,
        pathRewrite: {
          "^/back": "",
        },
      },
    },
    /*historyApiFallback: {
      index: "index.html",
    },
    //allowedHosts: "all",*/
  },
  outputDir: "../back/public",
});
