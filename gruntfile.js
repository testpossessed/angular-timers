module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                compress: false,
                mangle: false,
                beautify: true
            },
            module: {
                src: [
                    'src/angular-timers.js'
                ],
                dest: 'dist/angular-timers.min.js'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['src/angular-timers.js'],
                        dest: 'dist',
                        filter: 'isFile',
                        flatten: true
                    }
                ]
            }
        },
        karma: {
            unitbg: {
                configFile: 'karma.conf.js',
                background: true,
                autoWatch: false,
                singleRun: false
            },
            unit: {
                configFile: 'karma.conf.js',
                background: false,
                autoWatch: false,
                singleRun: true
            }
        },
        watch: {
            js: {
                files: [
                    'src/*.js',
                    'specs/*.js'
                ],
                tasks: ['karma:unitbg:run', 'uglify', 'copy']
            },
            grunt: {
                files: ['gruntfile.js']
            }
        }
    });
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['karma:unitbg', 'uglify', 'copy', 'watch']);
    grunt.registerTask('test', ['karma:unit']);
};
