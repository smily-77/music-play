module.exports = {
    // outputdir: 'dist',  //build输出目录
    // assetsdir: 'assets', //静态资源目录（js, css, img）
    // lintonsave: false, //是否开启eslint
    devServer: {
        open: true,
        host: 'localhost',  
        port: 8080,
        proxy: {
            '/api': {
              target: 'http://localhost:3000', //api服务器的地址
              ws: true, //代理websockets
              changeOrigin: true, // 虚拟的站点需要更管origin
              pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                '^/api': ''
              }
            }
          }
    }
}