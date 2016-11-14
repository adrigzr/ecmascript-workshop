import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model() {
		return Ember.$.get('katas/definition.json').then((data) => {
			const katas = data[0].childs;

			this.get('storage').set('katas', katas);

			return katas;
		});
	}
});
