/* eslint no-eval:0 */
import Ember from 'ember';

const { Mocha, mocha } = window;

function customReporter(instance) {
	return function customReporterInstance(runner) {
		Mocha.reporters.Base.call(this, runner);

		runner.on('pass', instance.trigger.bind(instance, 'onPass'));
		runner.on('fail', instance.trigger.bind(instance, 'onFail'));
		runner.on('end', instance.trigger.bind(instance, 'onEnd'));
	};
}

export default Ember.Component.extend({

	attributeBindings: ['id'],

	id: 'mocha',

	onPass: null,

	onFail: null,

	onEnd: null,

	didUpdateAttrs() {
		mocha.suite.suites = [];

		this.$().html('');
	},

	didReceiveAttrs(...args) {
		this._super(...args);

		mocha.setup({
			reporter: customReporter(this),
			ignoreLeaks: false,
			bail: false,
			ui: 'bdd'
		});

		const code = this.get('code');

		eval(code);
	},

	didRender(...args) {
		this._super(...args);

		mocha.run();
	}

});
