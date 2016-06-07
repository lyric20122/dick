var slugifyPath = require('slugify-path').default;
var cheerio = require('cheerio');
var extname = require('path').extname;
var async = require('async');

module.exports = {
	collection: {},

	slugifyFiles: function() {
		var self = this;
		return function(files, metalsmith, done) {
			async.each(Object.keys(files), function(file, cb) {
				var data = files[file];

				data.originalName = file;

				var extension = extname(file);

				if (extension !== '.md') {
					return cb();
				}

				var newName = slugifyPath(file.replace(/(^|\/)[0-9\. ]+/g, '$1').replace(/README\.md/, 'index.md').replace(new RegExp(extension + '$'), '')) + extension;

				self.collection[data.originalName] = newName;

				delete files[file];
				files[newName] = data;

				cb();
			}, function() {
				done();
			});
		};
	},

	slugifyLinks: function() {
		var self = this;
		return function(files, metalsmith, done) {
			async.each(Object.keys(files), function(file, cb) {
				if (extname(file) !== '.html') {
					return cb();
				}
				var data = files[file];
				var contents = data.contents.toString();
				var $ = cheerio.load(contents);

				$('a').each(function() {
					if (!$(this).attr('href').match(/(^https?:\/\/|\/\/)/)) {
						var old = decodeURIComponent($(this).attr('href'));

						var extension = extname(old);

						if (!old.match(/\/$/) && (extension == '.html' || extension == '.md')) {
							newHref = slugifyPath(old.replace(new RegExp(extension + '$'), '')) + (extension == '.md' ? '.html' : extension);
						} else {
							newHref = slugifyPath(old);
						}

						if (old.match(/^\//)) {
							$(this).attr('href', '/'+newHref.replace(/(^|\/)[0-9\-]+/g, '$1'));
						} else {
							$(this).attr('href', newHref.replace(/(^|\/)[0-9\-]+/g, '$1'));
						}
					}
				});

				data.contents = new Buffer($.html());
				cb();
			}, function() {
				done();
			});
		};
	}
};
