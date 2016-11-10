import Ember from 'ember';

function buildUrl(id, file) {
	return `katas/${id}/${file}`;
}

export default Ember.Route.extend({

	model(params) {
		const id = params.kata_id;
		const readmeUrl = buildUrl(id, 'README.md');
		const codeUrl = buildUrl(id, 'code.js');
		const suiteUrl = buildUrl(id, 'suite.js');

		return Ember.RSVP.hash({
			id,
			readme: Ember.$.get(readmeUrl),
			code: Ember.$.get(codeUrl),
			suite: Ember.$.get(suiteUrl)
		});
	}
});
