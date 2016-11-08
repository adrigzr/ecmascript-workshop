import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['col-xs-12', 'col-md-6', 'transition', 'codemirror-editor'],

  /**
   * Initialize codemirror
   *
   */
  didInsertElement() {
    var myCodeMirror = CodeMirror.fromTextArea(this.element.querySelector('.editor-content'), {
      mode: 'javascript',
      lineNumbers: true,
      reindentOnLoad: true,
      theme: 'solarized dark'
    });
  }

});
