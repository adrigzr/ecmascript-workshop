import Ember from 'ember';

function buildUrl(id, file) {
	return `kata/${id}/${file}`;
}

export default Ember.Route.extend({
	model(params) {
		const readmeUrl = buildUrl(params.kata_id, 'README.md');
		const codeUrl = buildUrl(params.kata_id, 'code.js');
		const suiteUrl = buildUrl(params.kata_id, 'suite.js');

		return Ember.RSVP.hash({
			readme: Ember.$.get(readmeUrl),
			kata: Ember.$.get(codeUrl),
			suite: Ember.$.get(suiteUrl)
		});
	}
});
