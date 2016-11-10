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
			type: data.state === 'failed' ? 'danger' : 'success'
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
	},

	actions: {
		onEvent(data) {
			this.onEvent(data);
		}
	}

});
