# Installation

1. Make sure you've installed all requirements
2. Clone this repository:  
  `git clone https://github.com/[username]/[repository]`
3. Install dependencies using `npm`:  
  `npm i`
4. Fetch the `Rocket.Chat.Docs` source files:  
  `gulp fetch`
5. Compile assets:  
  `gulp`

It will create a `build` directory with the static pages.

# Requirements

* Gulp (`npm i -g gulp-cli`)

# Missing from `redoc`

- [ ] Search (maybe have to use google)
- [x] Slugfied links
- [x] Gulp to compile `less` files for template (today I get the whole CSS from old `redoc` project. but the ideal is to create new `LESS` files to the new template/markup)
