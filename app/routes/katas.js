import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const buildOptions = (path, filename) => ({
	dataType: 'text',
	url: `${path}/${filename}`
});

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model(params) {
		const kata = this.get('storage.katas').findBy('slug', params.kata_slug);

		return Ember.RSVP.hash({
			readme: Ember.$.get(buildOptions(kata.path, 'README.md')),
			code: Ember.$.get(buildOptions(kata.path, 'code.js')),
			suite: Ember.$.get(buildOptions(kata.path, 'suite.js'))
		}).then((data) => {
			const lastCode = this.get(`storage.code.${kata.id}.code`);

			// Return last edited code if exist.
			if (lastCode) {
				data.code = lastCode;
			}

			return Object.assign({}, data, kata);
		});
	}
});
