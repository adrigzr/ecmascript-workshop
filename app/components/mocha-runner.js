/* eslint no-eval:0 */
import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({

	tagName: 'iframe',

	attributeBindings: ['sandbox', 'id', 'src'],

	sandbox: 'allow-scripts',

	src: '/sandbox.html',

	onEvent: null,

	onEnd: null,

	onMessage(message) {
		const { data } = message;

		if (data.state === 'end') {
			if (this.onEnd) {
				this.onEnd();
			}
		} else if (this.onEvent) {
			this.onEvent(data);
		}
	},

	onMessageBinding: computed(function() {
		return this.onMessage.bind(this);
	}),

	didRender(...args) {
		this._super(...args);

		const code = this.get('code');
		const suite = this.get('suite');
		const frame = this.$().get(0);
		const message = {
			code,
			suite
		};

		window.addEventListener('message', this.get('onMessageBinding'));

		frame.onload = () => {
			frame.contentWindow.postMessage(message, '*');
		};
	},

	willDestroy(...args) {
		this._super(...args);

		window.removeEventListener('message', this.get('onMessageBinding'));
	}

});
