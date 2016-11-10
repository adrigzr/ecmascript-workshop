import Ember from 'ember';

function buildTitle(data) {
	if (data.parent) {
		return `${buildTitle(data.parent)} ${data.title}`;
	}

	return data.title;
}

export default Ember.Component.extend({

	messages: null,

	resetOutput() {
		this.set('messages', []);
	},

	addOutput(data) {
		const messages = this.get('messages');

		messages.pushObject({
			title: buildTitle(data),
			state: data.state
		});
	},

	onEvent(data) {
		console.log('event', data);

		if (data.event === 'suite' && data.root) {
			this.resetOutput();
			this.sendAction('onStart');
		}

		if (data.event === 'test end') {
			const messages = this.get('messages');

			this.addOutput(data);
			this.sendAction('onEnd', messages);
		}
	},

	actions: {
		onEvent(data) {
			this.onEvent(data);
		}
	}

});
