//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    runtimeCompiler: true,
    devServer: {
        allowedHosts: ['.productlist.local']
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
