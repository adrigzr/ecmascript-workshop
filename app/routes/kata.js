import Ember from 'ember';

function buildUrl(id, file) {
	return `kata/${id}/${file}`;
}

export default Ember.Route.extend({
	model(params) {
		const readmeUrl = buildUrl(params.kata_id, 'README.md');
		const kataUrl = buildUrl(params.kata_id, 'kata.js');
		const testsUrl = buildUrl(params.kata_id, 'tests.js');

		return Ember.RSVP.hash({
			readme: Ember.$.get(readmeUrl),
			kata: Ember.$.get(kataUrl),
			tests: Ember.$.get(testsUrl)
		});
	}
});
