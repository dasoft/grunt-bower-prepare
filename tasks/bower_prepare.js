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
    var options = {
      dest: data.dest || false,
      sort: data.sort || 'types',
      clean_before: data.clean_before || false
    };

    var technologics = [
      'images',
      'js',
      'css',
      'scss',
      'less',
      'sass',
      'coffee',
      'stylus',
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
      return options[ext +'_dest'] || (typeof options.dest === 'string' && addSlashAdDir(options.dest) + ext) || false;
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
        return addSlashAdDir(grunt.file.readJSON('.bowerrc').directory);
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
      return (/([^\?#]*)(\?|#)?/).exec(filename)[1];
    };

    var getPathByExt = function (filename, packetName)
    {
      if (!packetName) {
        packetName = '';
      }
      else {
        packetName += '/';
      }
      var ext = getCleanFileName(filename.split('.').pop().toLowerCase());
      if (ext === 'map') {
        ext = filename.split('.');
        ext.pop();
        ext = getCleanFileName(ext.pop().toLowerCase());
      }
      var dest;

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'wbmp', 'eps'].indexOf(ext) !== -1) {
        dest = returnOption('images');
      }
      if (['js', 'css', 'scss', 'less', 'sass', 'coffee'].indexOf(ext) !== -1) {
        dest = returnOption(ext);
      }
      if (ext === 'styl') {
        dest = returnOption('stylus');
      }
      if (ext === 'svg') {
        dest = filename.indexOf('font') !== -1 ? returnOption('fonts') : returnOption('images');
      }
      if (['eot', 'ttf', 'woff'].indexOf(ext) !== -1) {
        dest = returnOption('fonts');
      }

      if (!dest) {
        return false;
      }
      return addSlashAdDir(dest) + packetName + filename.split('/').pop();
    };

    var normalizePath = function (filepath)
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

    var copyFile = function (filepath, filename, packet)
    {
      filename = getCleanFileName(filename);
      if (grunt.file.exists(addSlashAdDir(filepath) + filename)) {
        if (getPathByExt(filename, packet)) {
          grunt.log.writeln(normalizePath(filepath + filename), '→', normalizePath(getPathByExt(filename, packet)));
          grunt.file.copy(normalizePath(filepath + filename), normalizePath(getPathByExt(filename, packet)));
        }
      }
      else {
        grunt.log.writeln('File not found: '+ normalizePath(addSlashAdDir(filepath) + filename));
      }
    };

    var createLocalPath = function (source, target)
    {
      source = source.split('/');
      target = target.split('/');
      source.pop();
      var targetFileName = target.pop();
      var localPath = [];
      var duplicateSource = source.join('~~~').split('~~~');
      duplicateSource.forEach(function (element)
      {
        var index = source.indexOf(element);
        if (target[index] === element) {
          source.splice(index, 1);
          target.splice(index, 1);
        }
        else {
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
      return localPath.join('/') + (localPath.length ? '/' : '') + targetFileName;
    };

    var getEnrichmentByParsingCSS = function (filepath, files, packet)
    {
      var enrichFiles = [];
      var fileContent;
      files.forEach(function (filename)
      {
        var ext = getCleanFileName(filename.split('.').pop().toLowerCase());
        if (!getPathByExt(filename, packet)) {
          return;
        }
        if (ext === 'css') { // filename css-file
          if (grunt.file.exists(filepath + filename + '.map')) {
            files.push(filename + '.map');
          }
          if (!grunt.file.exists(filepath + getCleanFileName(filename))) {
            return;
          }
          fileContent = grunt.file.read(filepath + getCleanFileName(filename));
          var cssFilePath = (filepath + filename).split('/');
          cssFilePath.pop();
          cssFilePath = cssFilePath.join('/') +'/';
          var url;
          var abspath;
          var regexpUrl = /url\(["']?([^'"\)]*)["']?\)/ig;
          var foundedSources = [];
          while (url = regexpUrl.exec(fileContent)) {
            regexpUrl.lastIndex;
            url = url[1].trim(); // found image or font
            abspath = normalizePath(cssFilePath + url);
            if (grunt.file.exists(abspath)) {
              foundedSources.push({filename: url, localPath: createLocalPath(getPathByExt(filename, packet), getPathByExt(url, packet))});
              files.push(abspath.substr(filepath.length));
            }
          }
          if (foundedSources.length) {
            enrichFiles.push({filename: getPathByExt(filename, packet), sources: foundedSources});
          }
          var imp;
          var regexpImport = /@import\s*(url\()?(["']?)([^'\"\)]*)/ig;
          var foundedImports = [];
          while (imp = regexpImport.exec(fileContent)) {
            regexpImport.lastIndex;
            imp = imp[3].trim(); // found import css-file
            abspath = normalizePath(cssFilePath + imp);
            var subFiles = [abspath.substr(filepath.length)];
            var subEnrichFiles = getEnrichmentByParsingCSS(filepath, subFiles, packet);
            subFiles.forEach(function (element)
            {
              files.push(element);
            });
            subEnrichFiles.forEach(function (element)
            {
              enrichFiles.push(element);
            });
            foundedImports.push({filename: imp, localPath: createLocalPath(getPathByExt(filename, packet), getPathByExt(imp, packet))});
            files.push(abspath.substr(filepath.length));
          }
          if (foundedImports.length) {
            enrichFiles.push({filename: getPathByExt(filename, packet), sources: foundedImports});
          }
        }
      });
      return enrichFiles;
    };

    var replaceEnrichment = function (enrichFiles)
    {
      enrichFiles.forEach(function (item)
      {
        var fileContent = grunt.file.read(getCleanFileName(item.filename));
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
        grunt.file.write(getCleanFileName(item.filename), fileContent);
      });
    };
    var normilizeStartPath = function (filename)
    {
      if (filename.substr(0, 2) == './') {
        filename = filename.substr(2);
      }
      if (filename.substr(0, 1) == '/') {
        filename = filename.substr(1);
      }
      return filename;
    };

    var mainFiles;
    var includeFiles = [];
    var excludeFiles = [];
    var bowerDir = getBowerDirectory();
    if (data.include) {
      data.include.forEach(function (expr)
      {
        grunt.file.expand(bowerDir + expr).forEach(function (filename)
        {
          includeFiles.push(filename.substr(bowerDir.length));
        });
      });
    }
    if (data.exclude) {
      data.exclude.forEach(function (expr)
      {
        if (grunt.file.isDir(bowerDir + expr)) {
          expr = addSlashAdDir(expr) + '**/*';
        }
        grunt.file.expand(bowerDir + expr).forEach(function (filename)
        {
          excludeFiles.push(filename.substr(bowerDir.length));
        });
      });
    }
    includeFiles.forEach(function (filename)
    {
      filename = normilizeStartPath(filename);
      var pack = filename.split('/').shift();
      copyFile(bowerDir, filename, pack);
    });
    grunt.file.expand(bowerDir + '*').forEach(function (filepath)
    {
      var pack = filepath.split('/').pop();
      filepath += '/';
      mainFiles = getBowerJSON(filepath).main || [];
      if (typeof mainFiles === 'string') {
        mainFiles = [mainFiles];
      }
      var enrichFiles = getEnrichmentByParsingCSS(filepath, mainFiles, pack);
      var removedFiles = 0;
      var mainFilesCopy = mainFiles.join('~~~').split('~~~');
      mainFilesCopy.forEach(function (filename, index)
      {
        filename = pack +'/'+ normilizeStartPath(filename);
        excludeFiles.forEach(function (excFilename)
        {
          if (excFilename == filename) {
            mainFiles.splice(index - removedFiles, 1);
            removedFiles++;
          }
        });
      });
      mainFiles.forEach(function (filename)
      {
        copyFile(filepath, filename, pack);
      });
      replaceEnrichment(enrichFiles);
    });

  });

};
