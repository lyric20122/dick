var slugifyPath = require('slugify-path').default;
var cheerio = require('cheerio');
var extname = require('path').extname;
var async = require('async');

function slug(filePath, data) {
	if (filePath.charAt(0) === '/') {
		filePath = filePath.substr(1);
	}
	var fileParts = filePath.split('/');
	var totalParts = fileParts.length;

	var fileName = fileParts[totalParts - 1];

	if (fileName === 'README.md') {
		fileParts[totalParts - 1] = 'index.md';

		if (data !== undefined && !data.title) {
			var previousPart = 2;
			if (totalParts < 2) {
				previousPart = 1;
			}
			data.title = fileParts[totalParts - previousPart].replace(/(^|\/)[0-9\. ]+/g, '$1');

			if (data.title === 'index.md') {
				data.title = 'Rocket.Chat Docs';
			}
		}
	}

	for (var i = 0; i < totalParts; i++) {
		fileParts[i] = fileParts[i].replace(/^[0-9]+\. /, '');
		if (i + 1 === totalParts) {
			var lastDot = fileParts[i].lastIndexOf('.');
			if (lastDot > -1) {
				// console.log('name ->',fileParts[i].substr(0, lastDot));
				fileParts[i] = slugifyPath(fileParts[i].substr(0, lastDot)) + fileParts[i].substr(lastDot);
			} else {
				fileParts[i] = slugifyPath(fileParts[i]);
			}
		} else {
			fileParts[i] = slugifyPath(fileParts[i]);
		}
		// console.log('fileParts[i] ->',fileParts[i]);
	}

	return fileParts.join('/');
}

module.exports = {
	collection: {},

	slugifyFiles: function() {
		var self = this;
		return function(files, metalsmith, done) {
			async.each(Object.keys(files), function(file, cb) {
				var data = files[file];

				// if (data.title) {
				// 	return cb();
				// }

				var slugPath = slug(file, data);

				// console.log('fileParts ->', fileParts, '-',fileName);
				data.originalName = file;

				// var extension = extname(file);

				// if (extension !== '.md') {
				// 	return cb();
				// }

				// var newName = slugifyPath(
				// 	file.replace(/(^|\/)[0-9\. ]+/g, '$1')
				// 		.replace(/README\.md/, 'index.md')
				// 		.replace(new RegExp(extension + '$'), '')
				// ) + extension;

				// self.collection[data.originalName] = newName;

				delete files[file];
				files[slugPath] = data;

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

						// var extension = extname(old);

						// if (!old.match(/\/$/) && (extension == '.html' || extension == '.md')) {
						// 	newHref = slugifyPath(old.replace(new RegExp(extension + '$'), '')) + (extension == '.md' ? '.html' : extension);
						// } else {
						// 	newHref = slugifyPath(old);
						// }

						var newHref = slug(old);

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
