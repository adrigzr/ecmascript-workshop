import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model() {
		return Ember.$.get('katas/definition.json').then((data) => {
			this.get('storage').set('katas', data.katas);

			return data.katas;
		});
	}
});
