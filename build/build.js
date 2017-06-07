const ora = require("ora")
const rm = require("rimraf")
const path = require("path")
const webpack = require("webpack")
const config = require("./config")
const webpack_config = require("./webpack_prod_config")

// start spinner
const spinner = ora("building for production...")
spinner.start()

// first clean the dist folder
// then build a new version
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpack_config, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + "\n\n")

    console.log("Build complete.\n")
    })
})