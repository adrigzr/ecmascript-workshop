import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const DEBOUNCE_DELAY = 500;

export default Ember.Controller.extend({

	storage: storageFor('katas'),

	/**
	 * Return last edited code if exist.
	 */
	code: Ember.computed(function() {
		const id = this.get('model.id');
		const lastCode = this.get(`storage.${id}.code`);

		return lastCode || this.get('model.code');
	}),

	/**
	 * Update the code & persist in localStorage.
	 */
	_updateCode(code) {
		const id = this.get('model.id');
		const storage = this.get('storage');
		const kata = this.get(`storage.${id}`);

		this.set('code', code);
		// Persist last code changes
		if (kata) {
			storage.set(`${id}.code`, code);
		} else {
			storage.set(`${id}`, { code });
		}
	},

	actions: {
		onChange(code) {
			// Update values
			Ember.run.debounce(this, this._updateCode, code, DEBOUNCE_DELAY);
		},

		onEvent(...args) {
			console.log('event', ...args);
		},

		onEnd(...args) {
			console.log('end', ...args);
		}
	}

});
