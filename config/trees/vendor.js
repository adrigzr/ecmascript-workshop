/* jshint node: true */
/* eslint-disable */
'use strict';

var Funnel = require('broccoli-funnel');
var path = require('path');

module.exports = {

	toTree: function() {
		return new Funnel('vendor', {
			getDestinationPath: function(relativePath) {
				return 'assets/vendor/' + path.basename(relativePath);
			}
		});
	}

};

