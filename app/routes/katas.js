import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import KataModel from 'workshop/models/kata';

export default Ember.Route.extend({
	storage: storageFor('katas'),

	model(params) {
		let kata = this.get('storage.katas').findBy('slug', params.kata_slug);

		kata = KataModel.create(kata);

		return Ember.RSVP.hash({
			readme: kata.get('readme'),
			code: kata.get('code'),
			suite: kata.get('suite')
		});
	}
});
