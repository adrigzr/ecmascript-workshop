/* jshint node:true*/
/* eslint-disable */
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var bowerComponentsBuilder = require('./config/trees/bower_components');
var nodeModulesBuilder = require('./config/trees/node_modules');

module.exports = function(defaults) {
	var app = new EmberApp(defaults, {
		// Add options here
	});

	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.

	// Bootstrap.
	app.import('bower_components/bootstrap/dist/js/bootstrap.js');
	app.import('bower_components/bootstrap/dist/css/bootstrap.css');

	// Solarized bootstrap theme
	app.import('bower_components/bootstrap-solarized-theme/dist/css/solarized-dark-theme.css');

	// Codemirror.
	app.import('bower_components/codemirror/lib/codemirror.js');
	app.import('bower_components/codemirror/mode/javascript/javascript.js');
	app.import('bower_components/codemirror/lib/codemirror.css');
	app.import('bower_components/codemirror/theme/solarized.css');

	// highlightjs
	app.import("bower_components/highlightjs/styles/solarized-dark.css");

	var trees = [
		bowerComponentsBuilder.toTree(),
		nodeModulesBuilder.toTree(),
		app.toTree()
	];

	return mergeTrees(trees);
};
