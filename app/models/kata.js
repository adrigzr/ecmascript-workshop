import Ember from 'ember';

export default Ember.Object.extend({
	path: '',

	slug: '',

	name: '',

	readme: Ember.computed('path', function() {
		const options = this._buildOptions('README.md');

		return Ember.$.get(options);
	}),

	code: Ember.computed('path', function() {
		const options = this._buildOptions('code.js');

		return Ember.$.get(options);
	}),

	suite: Ember.computed('path', function() {
		const options = this._buildOptions('suite.js');

		return Ember.$.get(options);
	}),

	_buildOptions(filename) {
		const path = this.get('path');

		return {
			dataType: 'text',
			url: `${path}/${filename}`
		};
	}
});
