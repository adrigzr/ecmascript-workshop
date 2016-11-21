import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const buildOptions = (path, filename) => ({
	dataType: 'text',
	url: `${path}/${filename}`
});

function flattenKata(katas) {
	const flat = [];

	katas.forEach(kata => {
		if (kata.childs.length) {
			flat.push(...flattenKata(kata.childs));
		} else {
			flat.push(kata);
		}
	});

	return flat;
}

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model(params) {
		let katas = this.get('storage.katas');
		// Flatten the array & find the kata
		const kata = flattenKata(katas)
			.findBy('slug', params.kata_slug);

		return Ember.RSVP.hash({
			readme: Ember.$.get(buildOptions(kata.path, 'README.md')),
			code: Ember.$.get(buildOptions(kata.path, 'code.js')),
			suite: Ember.$.get(buildOptions(kata.path, 'suite.js'))
		}).then((data) => {
			const lastCode = this.get(`storage.code.${kata.id}.code`);

			return Object.assign({ lastCode }, data, kata);
		});
	}
});
