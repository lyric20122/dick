# Installation

1. Make sure you've installed all requirements
2. Clone this repository:  
  `git clone https://github.com/[username]/[repository]`
3. Install dependencies using `npm`:  
  `npm i`
4. Fetch the `Rocket.Chat.Docs` source files, into a `src` directory:  
  `gulp fetch`
5. Compile assets and serve the transformed pages locally:  
  `gulp`

It will create a `build` directory with the static pages.

# Workflow

1. make edits to the files in `src` directory
2. metalsmith will *hot reload* and compile your changes
3. test using a browser 
4. repeat 1 if required
5. `git push` the tested final changes back to `Rocket.Chat.Docs`

# Requirements

* Gulp (`npm i -g gulp-cli`)

# Missing from `redoc`

- [ ] Search (maybe have to use google)
- [x] Slugfied links
- [x] Gulp to compile `less` files for template (today I get the whole CSS from old `redoc` project. but the ideal is to create new `LESS` files to the new template/markup)
