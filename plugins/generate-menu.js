var _ = require('underscore');
var slugifyPath = require('slugify-path').default;

function createTree(fileTree, items) {
	var item = items.splice(0, 1);

	if (items.length > 0) {

		if (!fileTree[item]) {
			fileTree[item] = {};
		}
		createTree(fileTree[item], items);
	} else {
		fileTree[item] = {};
	}
}

function createMenu(fileTree, initialItem, initialPath, level) {
	var folders = [];

	var linkClass;
	var levelClass = '';

	if (level > 1) {
		levelClass = ' level-' + level;
	}

	Object.keys(fileTree).forEach(function(item) {
		if (item === 'README.md' || (_.isEmpty(fileTree[item]) && !item.match(/\.md$/))) {
			return;
		}

		var extension = '';

		if (item.match(/\.md$/)) {
			linkClass = 'guide-sub-nav-item';
		} else {
			linkClass = 'guide-nav-item';
		}

		var title = item.replace(/^[0-9]+\. /, '').replace(/\.md$/, '');
		folders.push({
			label: title,
			sortTitle: initialItem + '-' + (item.match(/\.md$/) ? '' : item),
			link: initialPath + '/' + slugifyPath(title) + extension,
			class: linkClass + levelClass
		});

		folders = folders.concat(createMenu(fileTree[item], initialItem + '-' + item, initialPath + '/' + slugifyPath(title), level + 1));
	});

	return folders;
}

function generateMenu() {
	return function(files, metalsmith, done) {
		var fileTree = {};

		Object.keys(files).forEach(function(file) {
			var data = files[file];

			var fileParts = data.originalName.split('/');
			var totalParts = fileParts.length;

			createTree(fileTree, fileParts);
		});

		var level = 1;
		// var folders = [];

		var folders = createMenu(fileTree, '', '', 1);

		var newFolders = _.sortBy(folders, 'sortTitle');
		for (var file in files) {
			files[file].mainNav = newFolders;
		}

		done();
	}
}

function generateMenuOld() {
	return function(files, metalsmith, done) {
		var folders = [];
		var unique = {};

		for (var file in files) {
			var data = files[file];
			var slash = file.indexOf('/');
			if (!slash) {
				continue;
			}
			var oneLevel = file.substr(0, file.indexOf('/'));

			if (oneLevel == '' || oneLevel == '.git') {
				continue;
			}

			var secondLevel = file.substr(file.indexOf('/') + 1);
			// console.log('secondLevel ->',secondLevel);
			secondLevel = secondLevel.substr(0, secondLevel.indexOf('/'));

			if (secondLevel != '') {

				if (unique[oneLevel+'/'+secondLevel]) {
					continue;
				}
				unique[oneLevel+'/'+secondLevel] = 1;

				folders.push({
					label: secondLevel.replace(/(^|\/)[0-9\. ]+/g, '$1'),
					sortTitle: data.originalName,
					link: '/' + oneLevel+'/'+secondLevel + '/index.html',
					class: 'guide-nav-item level-2'
				});
			}

			if (unique[oneLevel]) {
				continue;
			}
			unique[oneLevel] = 1;

			folders.push({
				label: oneLevel.replace(/(^|\/)[0-9\. ]+/g, '$1'),
				sortTitle: data.originalName,
				link: '/' + oneLevel + '/index.html',
				class: 'guide-nav-item'
			});
		}

		// console.log('folders ->',folders);

		// files.forEach(function(file) {
		//   folders[file.substr(0,file.lastIndexOf('/'))] = 1;
		// });

		var newFolders = _.sortBy(folders, 'sortTitle');

		// console.log('newFolders ->',newFolders);

		// newFolders.forEach(function(folder, i, list) {
		// 	list[i] = ;
		// });

		// console.log('newFolders->', newFolders);

		for (var file in files) {
			files[file].mainNav = newFolders;
		}

		done();
	}
};

module.exports = generateMenu;

