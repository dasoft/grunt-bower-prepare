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

    // Configuration to be run (and then tested).
    bower_prepare: {
      example1: {
        dest: 'tmp/example1'
      },
      example2: {
        js_dest: 'tmp/example2/javascripts/libs',
        clean_before: true,
        include: ['./backbone/index.j*']
      },
      example3: {
        dest: 'tmp/example3',
        css_dest: 'tmp/example3/stylesheets',
        exclude: ['social-likes/social-likes_*l*']
      }
      // example2: {
      //   dest: 'example1/',
      //   css_dest: 'build2/css/libs',
      //   clean_before: true,
      //   additionals: {
      //     iCheck: ['skins/flat/blue*']
      //   }
      // },
      // example3: {
      //   js_dest: 'example1/javascripts/',
      //   less_dest: 'less/libs'
      // }
    },

    clean: {
      tests: ['tmp']
    },

    copy: {
      test: {
        files: [
          {cwd: 'test/trash/', src: ['trash.js'], expand: true, dest: 'tmp/example1/js/', flatten: true, filter: 'isFile'},
          {cwd: 'test/trash/', src: ['trash.js'], expand: true, dest: 'tmp/example2/javascripts/libs/', flatten: true, filter: 'isFile'}
        ]
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'bower_prepare', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
