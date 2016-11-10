import Ember from 'ember';

export default Ember.Object.extend({
	path: '',

	slug: '',

	name: '',

	readme: Ember.computed('path', function() {
		return Ember.$.get(`${this.get('path')}/README.md`);
	}),

	code: Ember.computed('path', function() {
		return Ember.$.get(`${this.get('path')}/code.js`);
	}),

	suite: Ember.computed('path', function() {
		return Ember.$.get(`${this.get('path')}/suite.js`);
	})
});
