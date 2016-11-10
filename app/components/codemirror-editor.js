import Ember from 'ember';

const { CodeMirror } = window;

export default Ember.Component.extend({

	attributeBindings: ['id'],

	id: 'codemirror-editor',

	classNames: ['transition'],

	onChange: null,

	didInsertElement(...args) {
		this._super(...args);

		const element = this.element.querySelector('.editor-content');
		const instance = CodeMirror.fromTextArea(element, {
			mode: 'javascript',
			lineNumbers: true,
			reindentOnLoad: true,
			theme: 'solarized dark',
			clearWhenEmpty: false
		});

		instance.on('change', (e) => {
			if (this.onChange) {
				this.onChange(e.getValue(), e);
			}
		});

		this.set('instance', instance);
	},

	willDestroy(...args) {
		this._super(...args);

		const instance = this.get('instance');

		instance.off('change');
	}

});
