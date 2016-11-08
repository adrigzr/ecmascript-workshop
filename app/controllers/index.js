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
`

});
