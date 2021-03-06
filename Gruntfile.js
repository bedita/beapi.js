var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist'],
        docs: ['docs'],
        tmp: ['.tmp']
    },
    concat: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/beapi.js': [
                    'src/index.next.js',
                    'src/models.next.js',
                    'src/collection.next.js',
                    'src/object.next.js',
                    'src/helpers/xhr.next.js',
                    'src/registry.next.js',
                    'src/beapi.next.js',
                    'src/beapi.queue.next.js',
                    'src/methods/**/*.next.js'
                ]
            }
        },
        test: {
            files: {
                '.tmp/beapi.js': [
                    'src/index.next.js',
                    'src/models.next.js',
                    'src/collection.next.js',
                    'src/object.next.js',
                    'src/helpers/xhr.next.js',
                    'src/registry.next.js',
                    'src/beapi.next.js',
                    'src/beapi.queue.next.js',
                    'src/methods/**/*.next.js'
                ]
            }
        }
    },
    replace: {
        options: {
            patterns: [{
                match: /import[^;|\n]+[;|\n]?/g,
                replacement: ''
            }]
        },
        dist: {
            files: {
                'dist/beapi.js': 'dist/beapi.js'
            }
        },
        test: {
            files: {
                '.tmp/beapi.js': '.tmp/beapi.js'
            }
        }
    },
    babel: {
        options: {
            sourceMap: true,
            modules: 'ignore'
        },
        dist: {
            files: {
                'dist/beapi.js': 'dist/beapi.js'
            }
        },
        test: {
            files: {
                '.tmp/beapi.js': '.tmp/beapi.js'
            }
        }
    },
    uglify: {
        options: {
            sourceMap: false
        },
        dist: {
            files: {
                'dist/beapi.min.js': ['dist/beapi.js']
            }
        },
        test: {
            files: {
                '.tmp/beapi.min.js': ['.tmp/bedita.js']
            }
        }
    },
    jsdoc2md: {
        docs: {
            files: [{
                options: {
                    'property-list-format': 'table'
                },
                expand: true,
                src: ['src/**/*.next.js', '!src/index.next.js', '!src/methods/all.next.js'],
                dest: 'docs',
                rename: function (dest, src) {
                    return src.replace('src', dest).replace('.next.js', '.md');
                }
            }]
        }
    },
    karma: {
        options: {
            frameworks: ['jasmine'],
            runnerPort: 9999,
            singleRun: true,
            files: ['.tmp/beapi.js'],
            browsers: ['Chrome']
        },
        unit: {
            files: [
                { src: ['tests/conf.js', 'tests/beapi.js', 'tests/models.js', 'tests/object.js', 'tests/collection.js'] }
            ]
        }
    }
});

grunt.registerTask('build', ['clean:dist', 'clean:tmp', 'concat:dist', 'replace:dist', 'babel:dist', 'uglify:dist']);

grunt.registerTask('doc', ['clean:docs', 'jsdoc2md:docs']);

grunt.registerTask('tests', ['clean:tmp', 'concat:test', 'replace:test', 'babel:test', 'karma', 'clean:tmp'])
