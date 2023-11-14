//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    runtimeCompiler: true,
    devServer: {
    //    proxy: 'http://api.producelist.dev:8989',
    //    disableHostCheck: true,
    //    host: 'localhost',
        public: 'demo.producelist.dev:8082',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    pages:{
        index: 'src/main.js',
    },
    /*
    configureWebpack: {
        plugins: [
            //new BundleAnalyzerPlugin()
        ]
    }
    */
}
