/*
 * grunt-bower-prepare
 * https://github.com/makingoff/grunt-bower-prepare
 *
 * Copyright (c) 2014 Aleksei Chikin <mail@makingoff.name>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
      def: ['packets_dest', 'types_dest']
    },

    // Configuration to be run (and then tested).
    bower_prepare: {
      dev: {
        sort: 'packets',
        dest: 'build',
        clean_before: true
      },
      build: {
        dest: 'build2/',
        css_dest: 'build2/css/libs',
        clean_before: true,
        additionals: {
          iCheck: ['skins/flat/blue*']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bower_prepare', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
