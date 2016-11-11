import Ember from 'ember';

export default function sendSafeAction(context, action, ...args) {
	const func = context.get(action);

	if (Ember.typeOf(func) === 'function') {
		return func.call(context, ...args);
	}

	if (Ember.typeOf(func) === 'string') {
		return context.sendAction(action, ...args);
	}
}
