import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const DEBOUNCE_DELAY = 500;
const STATUS = {
	PENDING: {
		ICON: 'timer',
		DESC: 'Running tests...'
	},
	ERROR: {
		ICON: 'close',
		DESC: 'Not all tests pased'
	},
	OK: {
		ICON: 'check',
		DESC: 'All tests pased'
	}
};

export default Ember.Controller.extend({

	kataStorage: storageFor('katas'),

	codeStorage: storageFor('code'),

	code: Ember.computed('model.id', function() {
		const id = this.get('model.id');
		const lastCode = this.get(`codeStorage.${id}`);

		// Return last edited code if exist.
		return lastCode || this.get('model.code');
	}),

	/**
	 * [close|check]
	 */
	status: STATUS.ERROR,

	/**
	 * Update the code & persist in localkataStorage.
	 */
	_updateCode(code) {
		const id = this.get('model.id');
		const codeStorage = this.get('codeStorage');

		// Persist last code changes
		this.set(`codeStorage.${id}`, code);
	},

	actions: {
		onChange(code) {
			const kataId = this.get('model.kata.id');

			Ember.run.debounce(this, this._updateCode, code, DEBOUNCE_DELAY);
		},

		onError(e) {
			this.set('status', STATUS.ERROR);
		},

		onStart() {
			// Update toolbar status
			this.set('status', STATUS.PENDING);
		},

		onEnd(messages) {
			// Update toolbar status
			if (messages.some((test) => test.state === 'failed')) {
				this.set('status', STATUS.ERROR);
			} else {
				this.set('status', STATUS.OK);
			}
		},

		run() {
			this.notifyPropertyChange('code');
		},

		changeCode(code) {
			const id = this.get('model.id');

			this.set(`codeStorage.${id}`, code);
			this.notifyPropertyChange('code');
		}
	}

});
