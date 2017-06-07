const path = require("path")
const config = require("./config")
const base_webpack_config = require("./webpack_base_config")

const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const WebpackBuildNotifierPlugin = require("webpack-build-notifier")

// add hot-reload related code to entry chunks
Object.keys(base_webpack_config.entry).forEach(function (name) {
    base_webpack_config.entry[name] = [path.join(__dirname, "dev_client")].concat(base_webpack_config.entry[name])
})

// dev config
module.exports = merge(base_webpack_config, {
    "plugins": [
        // set NODE_ENV
        new webpack.DefinePlugin({
            "process.env": config.dev.env
        }),
        
        // needed for setting correct contect
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "..", "src")
        ),

        // notify on succesfull build
        new WebpackBuildNotifierPlugin({ "title": "build complete" }),
        
        // Enable Hot module reloading
        new webpack.HotModuleReplacementPlugin(),
        
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
        
        // recognizes certain classes of webpack errors and cleans, aggregates and prioritizes them to
        // provide a better Developer Experience
        new FriendlyErrorsPlugin()
    ]
})
