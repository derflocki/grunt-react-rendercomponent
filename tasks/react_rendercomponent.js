(function() {
	var path = require('path'), 
	fs = require('fs'),
	vm = require('vm'),
	util = require('util'),
	path = require('path'),
	cheerio = require('cheerio');
	var windowCtx = null;
	module.exports = function(grunt) {
		return grunt.registerMultiTask('react_rendercomponent', 'Grunt plugin for rendering reactjs controls', function() {
			var includeInThisContext = function(ctx, path) {
				var code = fs.readFileSync(path);
				vm.runInContext(code, ctx, path);
			}.bind(this);
			/**
			* Checks if `p` is a filepath, being it has an extension.
			*
			* @param {String} p
			* @return {Boolean}
			*/
			function isFilename(p) {
				return !!path.extname(p);
			}
			var done, opts;
			done = this.async();
			opts = this.options({
				scripts: [],
				modules: [],
				context: {},
				silent: false
			});
			//setup the context
			var context = {
			};
			Object.keys(opts.context).forEach(function(key) {
				context[key] = opts.context[key];
			});
			windowCtx = vm.createContext(context);
			//now that we have the context, include the scripts
			opts.scripts.forEach(function(c) {
				includeInThisContext(windowCtx, c);
			});
			this.files.forEach(function(f) {
				var src, cwd = f.cwd;
				src = f.src.filter(function(p) {
					if(cwd) {
						p = path.join(f.cwd, p);
					}
					if(grunt.file.isFile(p)) {
						return true;
					} else {
						grunt.fail.fatal('Source "' + p + '" is not a file');
						return false;
					}
				});

				if(src.length > 1 && isFilename(f.dest)) {
					grunt.fail.fatal('Source file cannot be more than one when dest is a file.');
				}

				src.forEach(function(p) {
					var fileName = f.flatten ? path.basename(p) : p;
					var outFile = isFilename(f.dest) ? f.dest : path.join(f.dest, fileName);
					var components = f.components;
					if(cwd) {
						p = path.join(cwd, p);
					}
					//TODO: do the processing here
					grunt.log.error("input: " + p);
					grunt.log.error("output:" + outFile);
					//grunt.file.write(outFile, banner + recurse(p, opts));
					content = grunt.file.read(p);
					if(content.length === 0) {
						grunt.fail.fatal('Source "' + p + '" is empty');
						return false;
					}
					$ = cheerio.load(content.toString());
					Object.keys(f.components).forEach(function(id) {
						var compCfg = f.components[id], $id = $('#'+id);
						$id.each(function(index, comp) {
							grunt.log.error("Rendering component <" + compCfg.react_class + "> into #"+id);
							grunt.log.error("Component Props: " + JSON.stringify(compCfg.props));
							var component = (windowCtx[compCfg.react_class]).apply(compCfg.props);
							//grunt.log.error(windowCtx.UpnpResult);
							//grunt.log.error(JSON.stringify(Object.keys(component)));
							return $id.html(context.React.renderToString(component));
						});
					});
					grunt.file.write(outFile,$.html());
				});
			});
			done();
		});
	};

}).call(this);
