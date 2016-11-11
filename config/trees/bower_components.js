/* jshint node: true */
/* eslint-disable */
'use strict';

var Funnel = require('broccoli-funnel');
var path = require('path');

module.exports = {

	files: [
		'jquery/dist/jquery.min.js',
		'expect.js/index.js',
		'mocha/mocha.js',
		'mocha/mocha.css'
	],

	toTree: function() {
		return new Funnel('bower_components', {
			include: this.files,
			getDestinationPath: function(relativePath) {
				return 'assets/bower_components/' + relativePath;
			}
		});
	}

};
