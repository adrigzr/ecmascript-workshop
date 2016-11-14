import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const buildOptions = (path, filename) => ({
	dataType: 'text',
	url: `${path}/${filename}`
});

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model(params) {
		let katas = this.get('storage.katas');
		// Flatten the array & find the kata
		const kata = katas.reduce((prev, curr) => {
			let prevArray = prev;

			if (!Array.isArray(prev)) {
				prevArray = [prev];
			}

			return prevArray.concat(curr.childs || curr);
		}).findBy('slug', params.kata_slug);

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
