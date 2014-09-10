// Generated on 2014-06-26 using generator-angular 0.9.1
'use strict';


module.exports = function (grunt) {

    // Configurable paths for the application
    var config = {
        projects: {
            'dr-mo': {
                source: '../../../../Dr-Mo/dist/',
                theme: 'mobile',
                subtheme: 'experimental',
                pot: 'dr-mo.pot',
                po: 'dr-mo.po',
                translations: 'dr-mo-translations.js'
            }
        },
        staticsBase: '../../static/themes/',
        templatesBase: '../../templates/',
        translateBase: '../../locale/',
        tmp: "tmp/"
    };


    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        travelbird: config,

        // Empties folders to start fresh
        clean: {
            options: {
                force: true // will delete files at target (outside cwd)
            },
            statics: {
                cwd: '<%= staticsTarget %>',
                expand: true,
                src: '{,*/}*'
            },
            templates: {
                cwd: '<%= templatesTarget %>',
                expand: true,
                src: '{,*/}*'
            },
            tmp: {
                cwd: '<%= travelbird.tmp %>',
                expand: true,
                src: '*'
            }
        },

        // Copies files from project dist to correct theme/subtheme
        copy: {
            statics: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/scripts',
                    dest: '<%= staticsTarget %>/js',
                    src: ['*']
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/styles',
                    dest: '<%= staticsTarget %>/css',
                    src: ['*']
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/images',
                    dest: '<%= staticsTarget %>/img',
                    src: ['*']
                }]
            },
            templates: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>',
                    dest: '<%= templatesTarget %>',
                    src: ['{,*/}{,*/}*.html']
                }]
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= templatesDir %>',
                    dest: '<%= travelbird.tmp %>',
                    src: ['{,*/}{,*/}*.html']
                }]
            }
        },

        'string-replace': {
            import: {
                dest: '<%= templatesTarget %>',
                src: ['<%= templatesTarget %>{,*/}{,*/}*.html'],
                options: {
                    replacements: [
                        {
                            pattern: /<!doctype html>/ig,
                            replacement: '{% load static %}\n' +
                                '<!doctype html>'
                        },
                        {
                            pattern: /src="scripts\/(.*)\.js"/ig,
                            replacement: 'src="{% static \'themes/<%= theme %>/<%= subtheme %>/js/$1.js\' %}"'
                        },
                        {
                            pattern: /href="styles\/(.*)\.css"/ig,
                            replacement: 'href="{% static \'themes/<%= theme %>/<%= subtheme %>/css/$1.css\' %}"'
                        },
                        {
                            pattern: /{{ ?(.*?) ?}}/ig,
                            replacement: '{% verbatim %}{{ $1 }}{% endverbatim %}'
                        },

                        {
                            pattern: /<!-- tb:replace -->[\s\S]*<!-- endtb -->/ig,
                            replacement: // When we really go live we'll need line below
                                '{% include JAVASCRIPT_SETTINGS_TEMPLATE %}\n' +
                                '{% include INITIAL_DATA_TEMPLATE %}\n' +
                                '<script type="text/javascript" src="{{ STATIC_URL }}{{ jsi18n_path }}?v={{global_settings.PROJ_VERSION}}"></script>'
                        }
                    ]
                }
            },
            translation: {
                dest: '<%= travelbird.tmp %>',
                src: ['<%= travelbird.tmp %>{,*/}{,*/}*.html'],
                options: {
                    replacements: [
                        {
                            pattern: /{% verbatim %}|{% endverbatim %}/ig,
                            replacement: ''
                        }
                    ]
                }
            }
        },

        nggettext_extract: {
            pot: {
                files: {
                    '<%= potFile %>': ['<%= travelbird.tmp %>{,*/}{,*/}*.html']
                }
            }
        },
        nggettext_compile: {
            all: {
                files: {
                    '<%= translationsFile %>': ['<%= translationsDir %>{nl_NL,en_GB}/LC_MESSAGES/<%= translationsSourceFile %>']
                }
            }
        }

    });



    // TODO: refactor the tasks

    grunt.registerTask('import-dist', 'Import the dist files of an Angular project.', function (project) {


        if(typeof project === 'undefined') {
            grunt.fatal('Project not specified');
        }
        var config = grunt.config.get('travelbird');
        var projectConfig = config.projects[project];

        grunt.log.writeln('Importing: ' + project);
        grunt.log.writeln('Will import to theme ' + projectConfig.theme + ' and subtheme ' + projectConfig.subtheme);

        grunt.config.set('theme', projectConfig.theme);
        grunt.config.set('subtheme', projectConfig.subtheme);

        grunt.config.set('templatesTarget', config.templatesBase + projectConfig.theme + '/' + projectConfig.subtheme + '/');
        grunt.config.set('staticsTarget', config.staticsBase + projectConfig.theme + '/' + projectConfig.subtheme + '/');
        grunt.config.set('source', projectConfig.source);

        grunt.log.debug(grunt.config.get('templatesTarget'));
        grunt.log.debug(grunt.config.get('staticsTarget'));

        grunt.task.run([
            'clean:statics',
            'clean:templates',
            'copy:statics',
            'copy:templates',
            'string-replace:import'
        ]);

    });

    grunt.registerTask('make-messages', 'Extract texts to be translated and put them into a .pot in root of translations directory.', function(project) {

        if(typeof project === 'undefined') {
            grunt.fatal('Project not specified');
        }
        var config = grunt.config.get('travelbird');
        var projectConfig = config.projects[project];

        grunt.log.writeln('Making messages for: ' + project);

        grunt.config.set('potFile', config.translateBase + projectConfig.pot);
        grunt.config.set('templatesDir', config.templatesBase + projectConfig.theme + '/' + projectConfig.subtheme + '/');
        grunt.log.writeln(grunt.config.get('travelbird.tmp'));

        grunt.task.run([
            'clean:tmp',
            'copy:tmp',
            'string-replace:translation',
            'nggettext_extract'
        ]);

    });

    grunt.registerTask('compile-messages', 'Compiles translations into the translations repo.', function(project) {

        if(typeof project === 'undefined') {
            grunt.fatal('Project not specified');
        }
        var config = grunt.config.get('travelbird');
        var projectConfig = config.projects[project];

        grunt.log.writeln('Compiling messages for: ' + project);

        grunt.config.set('translationsDir', config.translateBase);
        grunt.config.set('translationsFile', config.translateBase + projectConfig.translations);
        grunt.config.set('translationsSourceFile', projectConfig.po);

        grunt.log.writeln(config.templatesBase);
        grunt.log.writeln(config.translateBase + projectConfig.translations);
        grunt.log.writeln(projectConfig.po);

        grunt.task.run([
            'nggettext_compile'
        ]);

    });

};
