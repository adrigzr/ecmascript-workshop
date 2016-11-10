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
	 * [close|check]
	 */
	testResultIcon: 'close',

	testResultDescription: 'Not all tests pased',

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
		// Reset results
		this.get('lastResults').clear();
		// Update toolbar status
		this.setProperties({
			testResultIcon: 'timer',
			testResultDescription: 'Running tests...'
		});
	},

	lastResults: [],

	actions: {
		onChange(code) {
			// Update values
			Ember.run.debounce(this, this._updateCode, code, DEBOUNCE_DELAY);
		},

		onEvent(obj) {
			console.log('event', ...arguments);

			// Push state
			this.get('lastResults').pushObject(obj);
			// Update toolbar title
			this.set('testResultDescription', obj.title);
		},

		onEnd() {
			console.log('end', ...arguments);

			let icon = 'check';
			let description = 'All tests pased';

			// Update toolbar status
			if (this.get('lastResults').some((test) => test.state === 'failed')) {
				icon = 'close';
				description = 'Not all tests pased';
			}
			this.setProperties({
				testResultIcon: icon,
				testResultDescription: description
			});
		}
	}

});
