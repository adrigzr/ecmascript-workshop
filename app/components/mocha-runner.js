/* eslint no-eval:0 */
import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({

	tagName: 'iframe',

	attributeBindings: ['sandbox', 'id', 'src'],

	sandbox: 'allow-scripts allow-same-origin',

	src: 'sandbox.html',

	onEvent: null,

	onEnd: null,

	onMessage(message) {
		const { data } = message;

		if (this.onEvent) {
			this.onEvent(data);
		}
	},

	onMessageBinding: computed(function() {
		return this.onMessage.bind(this);
	}),

	init(...args) {
		this._super(...args);

		window.addEventListener('message', this.get('onMessageBinding'));
	},

	didUpdate() {
		const frame = this.$().get(0);

		frame.contentWindow.location.reload();
	},

	didInsertElement(...args) {
		this._super(...args);

		const frame = this.$().get(0);

		frame.onload = () => {
			const code = this.get('code');
			const suite = this.get('suite');
			const message = {
				code,
				suite
			};

			frame.contentWindow.postMessage(message, '*');
		};
	},

	willDestroy(...args) {
		this._super(...args);

		window.removeEventListener('message', this.get('onMessageBinding'));
	}

});
