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

	addException(data) {
		const messages = this.get('messages');

		messages.pushObject({
			title: `Exception: ${data.err.message}`,
			state: data.state
		});
	},

	sendEnd() {
		const messages = this.get('messages');

		this.sendAction('onEnd', messages);
	},

	sendStart() {
		this.sendAction('onStart');
	},

	onEvent(data) {
		console.log('event', data);

		if (data.event === 'suite' && data.root) {
			this.resetOutput();
			this.sendStart();
		}

		if (data.event === 'test end') {
			this.addOutput(data);
		}

		if (data.event === 'exception') {
			this.resetOutput();
			this.addException(data);
			this.sendEnd();
		}

		if (data.event === 'suite end' && data.root) {
			this.sendEnd();
		}
	},

	actions: {
		onEvent(data) {
			this.onEvent(data);
		}
	}

});
