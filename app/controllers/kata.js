import Ember from 'ember';

const DEBOUNCE_DELAY = 500;

export default Ember.Controller.extend({

	suite: `
describe('Module', function() {
	context('in a context', function() {
		it('does something', function() {
			assert.ok(true, 'true');
		});
	});
});
`,

	code: 'var a = 1;',

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
