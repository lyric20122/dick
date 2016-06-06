var _ = require('underscore');

function navMenu() {
	return function(files, metalsmith, done) {
		var folders = [];
		var unique = {};

		for (var file in files) {
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
					label: secondLevel.replace(/^[0-9. ]+/, ''),
					sortTitle: oneLevel+'/'+secondLevel,
					link: '/' + oneLevel+'/'+secondLevel + '/index.html',
					class: 'guide-nav-item level-2'
				});
			}

			if (unique[oneLevel]) {
				continue;
			}
			unique[oneLevel] = 1;

			folders.push({
				label: oneLevel.replace(/^[0-9. ]+/, ''),
				sortTitle: oneLevel+'/0',
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

module.exports = navMenu;

