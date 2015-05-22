module.exports = function(config){
    config.set({
        basePath: __dirname,
        files: [
            'node_modules/jssubstitute/index.js',
            'src/*.js',
            'specs/*.js'
        ],
        preprocessors: {
            'src/*.js': 'coverage'
        },
        reporters: ['story', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: __dirname + '/Karma/Coverage'
        },
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        logLevel: config.LOG_INFO
    });
};