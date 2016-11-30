import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export const buildOptions = (path, filename) => ({
	dataType: 'text',
	url: `${path}/${filename}`
});

export const flattenKata = (katas) => {
	const flat = [];

	katas.forEach((kata) => {
		if (kata.childs.length) {
			flat.push(...flattenKata(kata.childs));
		} else {
			flat.push(kata);
		}
	});

	return flat;
};

export default Ember.Route.extend({
	kataStorage: storageFor('katas'),

	codeStorage: storageFor('code'),

	model(params) {
		const katas = this.get('kataStorage.content');
		// Flatten the array & find the kata
		const kata = flattenKata(katas)
			.findBy('slug', params.kata_slug);

		return Ember.RSVP.hash({
			readme: Ember.$.get(buildOptions(kata.path, 'README.md')),
			code: Ember.$.get(buildOptions(kata.path, 'code.js')),
			suite: Ember.$.get(buildOptions(kata.path, 'suite.js')),
			solution: Ember.$.get(buildOptions(kata.path, 'solution.js'))
		}).then((data) => {
			const id = kata.slug;

			return Object.assign({ id }, data, kata);
		});
	}
});
