import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

function buildUrl(path, file) {
	return `${path}/${file}`;
}

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model(params) {
		const slug = params.kata_slug;
		const kata = this.get('storage.katas').findBy('slug', slug);
		const readmeUrl = `${kata.path}/README.md`;
		const codeUrl = `${kata.path}/code.js`;
		const suiteUrl = `${kata.path}/suite.js`;

		return Ember.RSVP.hash({
			readme: Ember.$.get(readmeUrl),
			code: Ember.$.get(codeUrl),
			suite: Ember.$.get(suiteUrl)
		});
	}
});
