# grunt-bower-prepare

> Grunt plugin to copy source files form bower components to your directories.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bower-prepare --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bower-prepare');
```

## The "bower_prepare" task

### Overview

There are supporting technologies:
* images
* fonts
* js
* coffee
* css
* stylus
* less
* sass
* scss

And this grunt plugin copy source files from bower component to your dest with path:
`dest/technologic/package/`

For example:

If you add a section named `bower_prepare` like this:

```js
grunt.initConfig({
  bower_prepare: {
    example1: {
      dest: 'libs'
    }
  },
})
```

`underscore.js` from package with the same name will copy to `libs/js/underscore/underscore.js`.
And `bootstrap.css` will copy to `libs/css/bootstrap/bootstrap.css`.

### What exactly will be copied to my dest

This plugin watch the main section at `bower.json`. Plugin looking packages in `.bowerrc`, if it exists.
If some css file has `@import` then plugin will copy this file too. As well as all images and fonts at `url()` at css files.

If you don't like default javascript files path, you can set your own. For example:

```js
bower_prepare: {
  example2: {
    dest: 'libs',
    js_dest: 'javascripts',
    css_dest: 'stylesheets'
  }
}
```

Result: `libs/javascripts/underscore/underscore.js` and `libs/stylesheets/bootstrap/bootstrap.css`.

Simple syntax: `technologic_dest` and path.

### Cleaning up your dest

If you remove some package then you want to remove them from your dest too. The `clean_before` will help you.
Before you run `bower_prepare` task, all dest of your technologies will be cleaned.
Not your dest, only dests of technologies.

```js
bower_prepare: {
  example3: {
    dest: 'libs',
    js_dest: 'js_files',
    less_dest: 'less_files',
    clean_before: true // false is default value
  }
}
```

Before you run this task the next dests will be removed:

* `libs/images`
* `libs/fonts`
* `libs/js_files`
* `libs/coffee`
* `libs/css`
* `libs/stylus`
* `libs/less_files`
* `libs/sass`
* `libs/scss`

And new files will copy again.

### What if you don't set `dest`

If you don't set `dest` then will be works technologies dest, like `images_dest` or `fonts`.

### SVG may be image and font

If in path exists the `font` word, that svg means font and it will be copied at font dest.

For example, bootstrap has `dist/fonts/glyphicons-halfling-regular.svg`. This file will be copied to the font dest.

### Include and exclude additional files

`include` to add some files than not exists at `main` section
`exclude` to exclude some files you don't want to see

```js
bower_prepare: {
  example4: {
    dest: 'libs',
    include: ['pack1/skins/blue*'],
    exclude: ['pack2/styles/load*', 'pack2/scripts/load*']
  }
}
```

## Changelog

### 2014-10-03 v0.1.2

* `include` option
* `exclude` option
