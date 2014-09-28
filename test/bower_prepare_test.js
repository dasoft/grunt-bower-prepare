'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.bower_prepare = {
  setUp: function(done) {
    done();
  },
  example1: function(test) {

    var equalFiles = [
      {actual: 'tmp/example1/css/fotorama/fotorama.css', expected: 'test/example1/css/fotorama/fotorama.css'},
      {actual: 'tmp/example1/css/social-likes/social-likes_birman.css', expected: 'test/example1/css/social-likes/social-likes_birman.css'},
      {actual: 'tmp/example1/css/social-likes/social-likes_classic.css', expected: 'test/example1/css/social-likes/social-likes_classic.css'},
      {actual: 'tmp/example1/css/social-likes/social-likes_flat.css', expected: 'test/example1/css/social-likes/social-likes_flat.css'},
      {actual: 'tmp/example1/imgs/fotorama/fotorama.png', expected: 'test/example1/imgs/fotorama/fotorama.png'},
      {actual: 'tmp/example1/imgs/fotorama/fotorama@2x.png', expected: 'test/example1/imgs/fotorama/fotorama@2x.png'},
      {actual: 'tmp/example1/js/backbone/backbone.js', expected: 'test/example1/js/backbone/backbone.js'},
      {actual: 'tmp/example1/js/fotorama/fotorama.js', expected: 'test/example1/js/fotorama/fotorama.js'},
      {actual: 'tmp/example1/js/jquery/jquery.js', expected: 'test/example1/js/jquery/jquery.js'},
      {actual: 'tmp/example1/js/social-likes/social-likes.js', expected: 'test/example1/js/social-likes/social-likes.js'},
      {actual: 'tmp/example1/js/underscore/underscore.js', expected: 'test/example1/js/underscore/underscore.js'}
    ];

    test.expect(equalFiles.length +1);

    equalFiles.forEach(function (item)
    {
      var actual = grunt.file.read(item.actual);
      var expected = grunt.file.read(item.expected);
      test.equal(actual, expected, 'should describe what the default behavior is.');
    });

    test.ok(grunt.file.exists('tmp/example1/js/trash.js'), 'Trash file isnt erased');

    test.done();
  },
  example2: function(test) {

    var equalFiles = [
      {actual: 'tmp/example2/javascripts/libs/backbone/backbone.js', expected: 'test/example2/javascripts/libs/backbone/backbone.js'},
      {actual: 'tmp/example2/javascripts/libs/fotorama/fotorama.js', expected: 'test/example2/javascripts/libs/fotorama/fotorama.js'},
      {actual: 'tmp/example2/javascripts/libs/jquery/jquery.js', expected: 'test/example2/javascripts/libs/jquery/jquery.js'},
      {actual: 'tmp/example2/javascripts/libs/social-likes/social-likes.js', expected: 'test/example2/javascripts/libs/social-likes/social-likes.js'},
      {actual: 'tmp/example2/javascripts/libs/underscore/underscore.js', expected: 'test/example2/javascripts/libs/underscore/underscore.js'}
    ];

    test.expect(equalFiles.length +1);

    equalFiles.forEach(function (item)
    {
      var actual = grunt.file.read(item.actual);
      var expected = grunt.file.read(item.expected);
      test.equal(actual, expected, 'should describe what the default behavior is.');
    });

    test.ok(!grunt.file.exists('tmp/example2/javascripts/libs/trash.js'), 'Trash file is erased');

    test.done();
  },
  example3: function (test)
  {
    var equalFiles = [
      {actual: 'tmp/example3/stylesheets/fotorama/fotorama.css', expected: 'test/example3/stylesheets/fotorama/fotorama.css'},
      {actual: 'tmp/example3/stylesheets/social-likes/social-likes_birman.css', expected: 'test/example3/stylesheets/social-likes/social-likes_birman.css'},
      {actual: 'tmp/example3/stylesheets/social-likes/social-likes_classic.css', expected: 'test/example3/stylesheets/social-likes/social-likes_classic.css'},
      {actual: 'tmp/example3/stylesheets/social-likes/social-likes_flat.css', expected: 'test/example3/stylesheets/social-likes/social-likes_flat.css'},
      {actual: 'tmp/example3/imgs/fotorama/fotorama.png', expected: 'test/example3/imgs/fotorama/fotorama.png'},
      {actual: 'tmp/example3/imgs/fotorama/fotorama@2x.png', expected: 'test/example3/imgs/fotorama/fotorama@2x.png'},
      {actual: 'tmp/example3/js/backbone/backbone.js', expected: 'test/example3/js/backbone/backbone.js'},
      {actual: 'tmp/example3/js/fotorama/fotorama.js', expected: 'test/example3/js/fotorama/fotorama.js'},
      {actual: 'tmp/example3/js/jquery/jquery.js', expected: 'test/example3/js/jquery/jquery.js'},
      {actual: 'tmp/example3/js/social-likes/social-likes.js', expected: 'test/example3/js/social-likes/social-likes.js'},
      {actual: 'tmp/example3/js/underscore/underscore.js', expected: 'test/example3/js/underscore/underscore.js'}
    ];

    test.expect(equalFiles.length);

    equalFiles.forEach(function (item)
    {
      var actual = grunt.file.read(item.actual);
      var expected = grunt.file.read(item.expected);
      test.equal(actual, expected, 'should describe what the default behavior is.');
    });

    test.done();
  }
};
