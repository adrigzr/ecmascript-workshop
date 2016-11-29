import Ember from 'ember';
import sendAction from '../utils/send-action';

const { Babel } = window;

export default Ember.Component.extend({

	attributeBindings: ['id'],

	id: 'babel-transpiler',

	isVisible: false,

	didReceiveAttrs(...args) {
		this._super(...args);

		const input = this.get('code');
		const options = this.get('options');
		let output;

		try {
			output = Babel.transform(input, options).code;
		} catch (e) {
			return sendAction(this, 'onError', e);
		}

		return sendAction(this, 'onTranspile', output);
	}

});
