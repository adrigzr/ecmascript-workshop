import Ember from 'ember';

function buildUrl(id, file) {
	return `kata/${id}/README.md`;
}

export default Ember.Route.extend({
	model(params) {
		const readmeUrl = buildUrl(params.kata_id, 'README.md');

		return Ember.RSVP.hash({
			readme: Ember.$.get(readmeUrl)
		});
	}
});
