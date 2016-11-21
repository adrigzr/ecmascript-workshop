import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
	kataStorage: storageFor('katas'),

	model() {
		return Ember.$.get('katas/definition.json').then((data) => {
			const katas = data[0].childs;

			this.set('kataStorage.content', katas);

			return katas;
		});
	}
});
