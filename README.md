# grunt-react-rendercomponent

> Grunt plugin for rendering reactjs components in existing markup

This plugin is inspired and partially based on https://github.com/AlexMost/grunt-react-render by AlexMost. However here we do not rely on an augmented html-source, but setup rendering in the Gruntfile, much like the way you would when using react in the browser.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-react-rendercomponent --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-react-rendercomponent');
```

## The "react_render" task

### Overview
In your project's Gruntfile, add a section named `react_render` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	react_rendercomponent: {
		options: {
			//setup the context require for your scripts, like React, window, document, etc.
			context: {
				//modules are required
				React: require('react'),
				//and a basic 'browser like' environment is setup
				window: {}, 
				self: {},       //self is required by RSVP
				document: {}, 
				console: {
					log: function() {},
					//log: grunt.log.error,  //use console.log form grunt
					profile: function() {}, 
					profileEnd: function() {}
				}
			},
			scripts: [process.cwd() + '/src/js/components.js']
		},
		dist: {
			files: [{
				src: [
					'src/index.html'
				],
				dest: 'dist/index.html',
				components: {
					'node-id-to-render-into': {
						'react_class': 'ReactComponent',
						'props': {
							filterText: ''
						}
					}
				},
			}]
		}
	}
});
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.0.2: Don't always render the `UpnpResult` Component
