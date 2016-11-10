import Ember from 'ember';

const DEBOUNCE_DELAY = 500;

export default Ember.Controller.extend({

	code: Ember.computed.reads('model.code'),

	actions: {
		onChange(value) {
			Ember.run.debounce(this, this.set, 'code', value, DEBOUNCE_DELAY);
		},

		onEvent(...args) {
			console.log('event', ...args);
		},

		onEnd(...args) {
			console.log('end', ...args);
		}
	}

});
