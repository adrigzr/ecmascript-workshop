/*jshint node:true*/
var walk = require('walk-sync');
var fs = require('fs');
var path = require('path');
var values = require('lodash.values');

var KATAS_REGEXP = /katas\/(.+)\/$/;

function slugify(text) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-\/]+/g, '') // Remove all non-word chars except slashes
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

// Move out or template into a creator function.
function createPath(name) {
	return {
		name: name,
		slug: slugify(name),
		childs: {}
	};
}

// Resolves the path into objects iteratively (but looks eerily like recursion).
function resolvePath(root, dirPath) {
	dirPath.split('/').reduce(function(pathObject, pathName/*, index , array */) {
		// For each path name we come across, use the existing or create a subpath
		pathObject.childs[pathName] = pathObject.childs[pathName] || createPath(pathName);
		// Delete empty label
		if (!pathObject.childs[pathName].name) {
			delete pathObject.childs[pathName];
		}
		// Then return that subpath for the next operation
		return pathObject.childs[pathName];
	// Use the passed in base object to attach our resolutions
	}, root);
}

function objectToArray(object) {
	object.childs = values(object.childs);

	if (object.childs.length) {
		object.childs = object.childs.map(objectToArray);
	}

	return object;
}

module.exports = {
	name: 'katas-description',

	isDevelopingAddon: function() {
		return true;
	},

	postBuild: function(result) {
		var outputPath = path.join(result.directory, 'katas', 'definition.json');
		// Loop all entries
		var files = walk(result.directory).filter(function(dir) {
			return dir.match(KATAS_REGEXP);
		}).reduce(function(carry, pathEntry) {
			// On every path entry, resolve using the base object
			resolvePath(carry, pathEntry);
			// Return the base object for suceeding paths, or for our final value
			return carry;
			// Create our base object
		}, createPath(''));
		// Transform Objects to Arrays
		var output = objectToArray(files);

		fs.writeFileSync(outputPath, JSON.stringify(output.childs));
	}
};
