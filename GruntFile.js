const webpackConfig = require('./webpack.config');

module.exports = grunt => {

    grunt.initConfig({

      webpack: {
        prod: webpackConfig,
        dev: Object.assign({watch: true}, webpackConfig)
      }
    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['webpack'])
};
