/* jshint node: true */
/* eslint-disable */
'use strict';

var Funnel = require('broccoli-funnel');
var path = require('path');

module.exports = {

	files: [
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/expect.js/index.js',
		'bower_components/mocha/mocha.js',
		'bower_components/mocha/mocha.css',
		'node_modules/babel-core/browser.js'
	],

	toTree: function() {
		return new Funnel('.', {
			include: this.files,
			getDestinationPath: function(relativePath) {
				return 'assets/' + relativePath;
			}
		});
	}

};
