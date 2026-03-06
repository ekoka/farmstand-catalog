module.exports = {
    runtimeCompiler: true,
    devServer: {
        public: process.env.VUE_APP_DEV_SERVER_CATALOG_HOST,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    pages:{
        index: 'src/main.js',
    },
}
