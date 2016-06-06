var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var metallic = require('metalsmith-metallic');
var each = require('metalsmith-each');
var assets = require('metalsmith-assets');
var navMenu = require('./navMenu.js');
var slug = require('metalsmith-slug');
var ignore = require('metalsmith-ignore');

Metalsmith(__dirname)
  .metadata({
    title: "Rocket.Chat Docs",
    description: "Rocket.Chat Docs",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(ignore([
    '.git/*',
    '.git*'
  ]))
  .use(function(files, metalsmith, done) {
    for (file in files) {
      files[file].githubPath = 'https://github.com/RocketChat/Rocket.Chat.Docs/tree/master/' + file;
      // file.githubPath = 'https://github.com/RocketChat/Rocket.Chat.Docs/tree/master/' + filename;
    }
      // console.log('file.githubPath ->',file.githubPath);
      // console.log('filename ->',filename);

    done();
  })
  .use(
    each(function (file, filename) {
      return filename.replace(/README\.md/, 'index.md');
    }
  ))
  // .use(slug())
  // .use(permalinks({
  //   pattern: ':title'
  // }))
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
  }))
  .use(metallic())
  .use(navMenu())
  .use(layouts({
    engine: 'handlebars',
    default: 'layout.html',
    directory: 'templates',
    partials: 'templates'
  }))
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
