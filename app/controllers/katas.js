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

	storage: storageFor('katas'),

	code: Ember.computed.reads('model.code'),

	/**
	 * [close|check]
	 */
	status: STATUS.ERROR,

	/**
	 * Update the code & persist in localStorage.
	 */
	_updateCode(code) {
		const id = this.get('model.id');
		const storage = this.get('storage');
		const kata = this.get(`storage.code.${id}`);

		this.set('code', code);
		// Persist last code changes
		if (kata) {
			storage.set(`code.${id}.code`, code);
		} else {
			storage.set(`code.${id}`, { code });
		}
		// Reset results
		this.get('lastResults').clear();
		// Update toolbar status
		this.set('status', STATUS.PENDING);
	},

	lastResults: [],

	actions: {
		onChange(code) {
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

			// Update toolbar status
			if (this.get('lastResults').some((test) => test.state === 'failed')) {
				this.set('status', STATUS.ERROR);
			} else {
				this.set('status', STATUS.OK);
			}
		},

		run() {
			this.notifyPropertyChange('code');
		}
	}

});
