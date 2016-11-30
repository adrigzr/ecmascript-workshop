import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import { buildOptions, flattenKata } from './katas';

export default Ember.Route.extend({
	kataStorage: storageFor('katas'),

	codeStorage: storageFor('code'),

	model(params) {
		const katas = this.get('kataStorage.content');
		// Flatten the array & find the kata
		const kata = flattenKata(katas)
			.findBy('slug', params.kata_slug);

		return Ember.$.get(buildOptions(kata.path, 'HELP.md'));
	}
});
