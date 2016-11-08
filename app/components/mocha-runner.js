/* eslint no-eval:0 */
import Ember from 'ember';

const { mocha } = window;

export default Ember.Component.extend({

	attributeBindings: ['id'],

	id: 'mocha',

	didUpdateAttrs() {
		mocha.suite.suites = [];

		this.$().html('');
	},

	didReceiveAttrs(...args) {
		this._super(...args);

		mocha.setup('bdd');

		const code = this.get('code');

		eval(code);

		mocha.bail(false);
		mocha.checkLeaks();
	},

	didRender(...args) {
		this._super(...args);

		mocha.run();
	}

});
