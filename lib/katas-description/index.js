/*jshint node:true*/
var walk = require('walk-sync');
var fs = require('fs');
var path = require('path');

var KATAS_REGEXP = /katas\/([^\/]+)\/$/;

function slugify(text) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

module.exports = {
	name: 'katas-description',

	isDevelopingAddon: function() {
		return true;
	},

	postBuild: function(result) {
		var files = walk(result.directory).filter(function(dir) {
			return dir.match(KATAS_REGEXP);
		}).map(function(dir, index) {
			var name = dir.match(KATAS_REGEXP)[1];

			return {
				id: index,
				name: name,
				slug: slugify(name),
				path: dir
			};
		});
		var output = JSON.stringify({
			katas: files
		});
		var outputPath = path.join(result.directory, 'katas', 'definition.json');

		fs.writeFileSync(outputPath, output);
	}
};
