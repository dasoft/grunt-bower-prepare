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

There are support technologics:
* imgs
* fonts
* js
* coffee
* css
* styl
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

`undescore.js` from package with the same name will copy to `libs/js/undescore/undescore.js`.
And `bootstrap.css` will copy to `libs/css/bootstrap/bootstrap.css`.

### What exactly will copied to my dest

This plugin watch the main section at `bower.json`. Packages it looking at `.bowerrc` if it exists.
If some css file has `@import` plugin will copy this file too. Also, all images and fonts at `url()` at css files.

If you don't like default path to javascripts files, you can set your path. For example:

```js
bower_prepare: {
  example2: {
    dest: 'libs',
    js_dest: 'javascripts',
    css_dest: 'stylesheets'
  }
}
```

Simple syntax: `technologic_dest` and path. The path you get at `example2` is `libs/javascripts/underscore/underscore.js`.

### Cleaning up your dest

If you remove some package you want to remove them from your dest too. The `clean_before` will help you.
Before you run `bower_prepare` task all dest of your technologics will be cleaned.
Not your dest, only dests of technologics.

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

* `libs/imgs`
* `libs/fonts`
* `libs/js_files`
* `libs/coffee`
* `libs/css`
* `libs/styl`
* `libs/less_files`
* `libs/sass`
* `libs/scss`

And new files will copy againg.
