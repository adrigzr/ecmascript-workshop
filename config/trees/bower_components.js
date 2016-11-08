/* jshint node: true */
/* eslint-disable */
'use strict';

var Funnel = require('broccoli-funnel');
var path = require('path');

module.exports = {

	files: [],

	toTree: function() {
		return new Funnel('bower_components', {
			include: this.files,
			getDestinationPath: function(relativePath) {
				return 'assets/vendor/' + path.basename(relativePath);
			}
		});
	}

};
