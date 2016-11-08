import Ember from 'ember';

export default Ember.Controller.extend({

	code: `
describe('Module', function() {
	context('in a context', function() {
		it('does something', function() {
			assert.ok(true, 'true');
		});
	});
});
`,

	actions: {
		onPass(...args) {
			console.log('pass', ...args);
		},

		onFail(...args) {
			console.log('fail', ...args);
		},

		onEnd(...args) {
			console.log('end', ...args);
		}
	}

});
