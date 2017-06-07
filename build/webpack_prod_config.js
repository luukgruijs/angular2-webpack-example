const path = require("path")
const config = require("./config")
const base_webpack_config = require("./webpack_base_config")

const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")
const CompressionWebpackPlugin = require("compression-webpack-plugin")

// dev config
module.exports = merge(base_webpack_config, {
    "plugins": [
        
        // set env
        new webpack.DefinePlugin({
            "process.env": config.build.env
        }),
        
        // remove all unused code
        new webpack.optimize.UglifyJsPlugin({
            "compress": { "warnings": false },
            "sourceMap": false,
            "comments": false,
            "mangle": true,
            "minimize": true
        }),
    
        // set correct context for angular
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "..", "src")
        ),

        // notify on succesfull build
        new WebpackBuildNotifierPlugin({ "title": "build complete" }),
        
        // skip the emitting phase whenever there are errors while compiling
        new webpack.NoEmitOnErrorsPlugin(),
        
        // Generate HTML on the fly.
        // All chunks created by webpack will be automatically injected
        // If you already have a template file and want to use your own, specify the path on the template property.
        new HtmlWebpackPlugin({
            "filename": "index.html",
            "template": "../index.html",
            "inject": true
        }),
        
        // GZIP the files
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") +")$"
            ),
            threshold: 10240,
            minRatio: 0.8
        }),
    ]
})
