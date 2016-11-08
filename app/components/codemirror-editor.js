import Ember from 'ember';

export default Ember.Component.extend({

	attributeBindings: ['id'],

	id: 'codemirror-editor',

	classNames: ['transition'],

	didInsertElement() {
		var myCodeMirror = CodeMirror.fromTextArea(this.element.querySelector('.editor-content'), {
			mode: 'javascript',
			lineNumbers: true,
			reindentOnLoad: true,
			theme: 'solarized dark'
		});
	}

});
