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
		}

		if (data.event === 'test end') {
			this.addOutput(data);
		}

		this.sendAction('onEvent', data);
	},

	actions: {
		onEvent(data) {
			this.onEvent(data);
		}
	}

});
