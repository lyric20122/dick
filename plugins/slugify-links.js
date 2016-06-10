var extname = require('path').extname;
var async = require('async');
var cheerio = require('cheerio');
var slug = require('./rocketchat-slug.js');

module.exports = slugifyLinks;

function slugifyLinks(rootPath) {
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

					var newHref = slug(old, null, true);

					if (old.match(/^\//)) {
						$(this).attr('href', rootPath+'/'+newHref.replace(/(^|\/)[0-9\-]+/g, '$1'));
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
