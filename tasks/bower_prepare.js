/*
 * grunt-bower-prepare
 * https://github.com/makingoff/grunt-bower-prepare
 *
 * Copyright (c) 2014 Aleksei Chikin <mail@makingoff.name>
 * Licensed under the MIT license.
 */

'use strict';

var rimraf = require('rimraf');

module.exports = function(grunt)
{

  grunt.registerMultiTask('bower_prepare', 'Copying bower components to project', function()
  {
    var data = this.data;
    // Merge task-specific and/or target-specific options with these defaults.
    var options = {
      dest: data.dest || './',
      sort: data.sort || 'types',
      clean_before: data.clean_before || false
    };

    var technologics = [
      'imgs',
      'js',
      'css',
      'scss',
      'less',
      'sass',
      'coffee',
      'styl',
      'fonts'
    ];

    technologics.forEach(function (ext)
    {
      if (data[ext + '_dest']) {
        options[ext + '_dest'] = data[ext + '_dest'];
      }
    });

    var addSlashAdDir = function (dirpath)
    {
      if (!dirpath) {
        return '';
      }
      if (dirpath.substr(dirpath.length -1) !== '/') {
        dirpath += '/';
      }
      return dirpath;
    };

    var returnOption = function (ext)
    {
      return options[ext +'_dest'] || (typeof options.dest === 'string' && addSlashAdDir(options.dest) + ext) || '';
    };

    if (options.clean_before) {
      technologics.forEach(function (filename)
      {
        if (returnOption(filename)) {
          rimraf.sync(returnOption(filename));
        }
      });
    }

    var getBowerJSON = function (componentPath)
    {
      componentPath = addSlashAdDir(componentPath);
      var bowerJSON;
      ['bower.json', 'component.json', '.bower.json'].forEach(function (configFile) {
        if (grunt.file.isFile(componentPath + configFile)) {
          bowerJSON = grunt.file.readJSON(componentPath + configFile);
          return false;
        }
      });
      return bowerJSON || grunt.fail.fatal('Didnt find declare bower file at "'+ componentPath +'"');
    };

    var getBowerDirectory = function ()
    {
      if (grunt.file.isFile('.bowerrc')) {
        return grunt.file.readJSON('.bowerrc').directory;
      }
      var directory;
      ['bower_components', 'components'].forEach(function (dir) {
        if (grunt.file.isDir(dir)) {
          directory = dir;
          return false;
        }
      });
      return addSlashAdDir(directory) || grunt.fail.fatal('Didnt find bower components dir');
    };

    var getCleanFileName = function (filename)
    {
      return /([^\?#]*)(\?|#)?/.exec(filename)[1];
    };

    var getPathByExt = function (filename)
    {
      var ext = getCleanFileName(filename.split('.').pop().toLowerCase());
      var dest;

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'wbmp', 'eps'].indexOf(ext) !== -1) {
        dest = returnOption('imgs');
      }
      if (['js', 'css', 'scss', 'less', 'sass', 'coffee', 'styl'].indexOf(ext) !== -1) {
        dest = returnOption(ext);
      }
      if (ext === 'svg') {
        dest = filename.indexOf('font') !== -1 ? returnOption('fonts') : returnOption('imgs');
      }
      if (['eot', 'ttf', 'woff'].indexOf(ext) !== -1) {
        dest = returnOption('fonts');
      }

      if (!dest) {
        return false;
      }
      return addSlashAdDir(dest) + filename.split('/').pop();
    };

    var normilizePath = function (filepath)
    {
      var newpath = [];
      filepath = filepath.split('/');
      filepath.forEach(function (element)
      {
        if (element === '.') return;
        if (element === '..' && newpath.length) {
          newpath.pop();
          return;
        }
        newpath.push(element);
      });
      return newpath.join('/');
    };

    var copyFile = function (filepath, filename)
    {
      filename = getCleanFileName(filename);
      grunt.file.copy(addSlashAdDir(filepath) + filename, getPathByExt(filename));
    };

    var createLocalPath = function (source, target)
    {
      source = source.split('/');
      target = target.split('/');
      source.pop();
      var targetFileName = target.pop();
      var localPath = [];
      source.forEach(function (element)
      {
        var index = source.indexOf(element);
        if (target[index] === element) {
          source.splice(index, 1);
          target.splice(index, 1);
          return false;
        }
      });
      source.forEach(function (element)
      {
        localPath.push('..');
      });
      target.forEach(function (element)
      {
        localPath.push(element);
      });
      return localPath.join('/') + '/' + targetFileName;
    };

    var getEnrichmentByParsingCSS = function (filepath, files)
    {
      var enrichFiles = [];
      var fileContent;
      files.forEach(function (filename)
      {
        var ext = filename.split('.').pop().toLowerCase();
        if (ext === 'css') { // filename css-file
          fileContent = grunt.file.read(filepath + filename);
          var cssFilePath = (filepath + filename).split('/');
          cssFilePath.pop();
          cssFilePath = cssFilePath.join('/') +'/';
          var url;
          var abspath;
          var regexp = /url\(["']?([^'"\)]*)["']?\)/ig;
          var foundedIncludes = [];
          while (url = regexp.exec(fileContent)) {
            regexp.lastIndex;
            url = url[1]; // found image or font
            abspath = normilizePath(cssFilePath + url);
            var newLocalPath = createLocalPath(getPathByExt(filename), getPathByExt(url));
            foundedIncludes.push({filename: url, localPath: newLocalPath});
            files.push(abspath.substr(filepath.length));
          }
          if (foundedIncludes.length) {
            enrichFiles.push({filename: getPathByExt(filename), sources: foundedIncludes});
          }
        }
      });
      return enrichFiles;
    };

    var replaceEnrichmentByParsingCSS = function (enrichFiles)
    {
      enrichFiles.forEach(function (item)
      {
        var fileContent = grunt.file.read(item.filename);
        var replaceFilenames = [];
        item.sources.forEach(function (fileData)
        {
          replaceFilenames.push(fileData.filename);
        });
        var isFound = true;
        while (isFound) {
          isFound = false;
          var index = 0;
          item.sources.forEach(function (fileData)
          {
            replaceFilenames.forEach(function (filename)
            {
              if (fileData.filename !== filename && fileData.filename.indexOf(filename) !== -1) {
                isFound = true;
                item.sources.splice(index, 1);
              }
            });
            index++;
          });
        }
        item.sources.forEach(function (fileData)
        {
          fileContent = fileContent.split(fileData.filename).join(fileData.localPath);
        });
        grunt.file.write(item.filename, fileContent);
      });
    };

    var mainFiles;
    grunt.file.expand(getBowerDirectory() + '/*').forEach(function (filepath)
    {
      filepath += '/';
      var pack = filepath.split('/');
      pack.pop();
      pack = pack.pop();
      mainFiles = getBowerJSON(filepath).main;
      if (typeof mainFiles === 'string') {
        mainFiles = [mainFiles];
      }
      if (data.additionals && data.additionals[pack]) {
        data.additionals[pack].forEach(function (expr)
        {
          grunt.file.expand(filepath + expr).forEach(function (filename)
          {
            mainFiles.push(filename.substr(filepath.length));
          });
        });
      }
      var enrichFiles = getEnrichmentByParsingCSS(filepath, mainFiles);
      mainFiles.forEach(function (filename)
      {
        copyFile(filepath, filename);
      });
      replaceEnrichmentByParsingCSS(enrichFiles);
    });

  });

};
