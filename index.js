var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var each = require('metalsmith-each');
var assets = require('metalsmith-assets');
var parseGitHubLinks = require('./plugins/parse-github-links.js');
var generateMenu = require('./plugins/generate-menu.js');
var slugifyFiles = require('./plugins/slugify-files.js');
var slugifyLinks = require('./plugins/slugify-links.js');
var hljs = require("highlight.js");
var slug = require('metalsmith-slug');
var ignore = require('metalsmith-ignore');
var headingsidentifier = require("metalsmith-headings-identifier");
var markdown = require('metalsmith-markdown');
var drafts = require('metalsmith-drafts');

var rootDir = '';
if (process.argv[2]) {
	rootDir = process.argv[2];
}

Metalsmith(__dirname)
	.metadata({
		title: "Rocket.Chat Docs",
		description: "Rocket.Chat Docs",
		generator: "Metalsmith",
		url: "http://www.metalsmith.io/"
	})
	.source('./src')
	.destination('./build' + rootDir)
	.clean(true)
	.use(ignore([
		'.git/**/*',
		'.git*'
	]))
	.use(drafts())
	.use(parseGitHubLinks())
	.use(slugifyFiles())
	.use(generateMenu(rootDir))
	.use(markdown({
		smartypants: true,
		gfm: true,
		tables: true,
		highlight: function(str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(lang, str).value;
				} catch (__) {}
			}

			return str; // use external default escaping
		}
	}))
	.use(function(files, metalsmith, done) {
		Object.keys(files).forEach(function(file) {
			var data = files[file];

			data.rootPath = rootDir;
		});
		done();
	})
	.use(layouts({
		engine: 'handlebars',
		default: 'layout.html',
		partials: 'layouts/partials'
	}))
	.use(slugifyLinks(rootDir))
	.use(headingsidentifier())
	// 	linkTemplate: "<a class='myCustomHeadingsAnchorClass' href='#%s'><span></span></a>"
	// }))
	.use(assets({
		source: './assets', // relative to the working directory
		destination: './assets' // relative to the build directory
	}))
	.build(function(err, files) {
		if (err) {
			throw err;
		}
	});

