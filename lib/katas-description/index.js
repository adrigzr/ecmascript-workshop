/*jshint node:true*/
var walk = require('walk-sync');
var fs = require('fs');
var path = require('path');

var KATAS_REGEXP = /katas\/([^\/]+)\/$/;

module.exports = {
	name: 'katas-description',

	isDevelopingAddon: function() {
		return true;
	},

	postBuild: function(result) {
		var files = walk(result.directory).filter(function(dir) {
			return dir.match(KATAS_REGEXP);
		}).map(function(dir, index) {
			return {
				id: index,
				name: dir.match(KATAS_REGEXP)[1],
				path: dir
			};
		});
		var output = JSON.stringify({ katas: files });
		var outputPath = path.join(result.directory, 'katas', 'definition.json');

		fs.writeFileSync(outputPath, output);
	}
};
