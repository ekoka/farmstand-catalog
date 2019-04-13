//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    runtimeCompiler: true,
    devServer: {
        allowedHosts: ['.productlist.local']
    },
    /*
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js",
            vuex$: "vuex/dist/vuex.esm.js",
        }
    },
    configureWebpack: {
        plugins: [
            //new BundleAnalyzerPlugin()
        ]
    }
    */
}
