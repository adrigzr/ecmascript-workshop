import Ember from 'ember';

export default Ember.Component.extend({

  /**
   * Initialize codemirror
   *
   */
  didInsertElement() {
    var myCodeMirror = CodeMirror.fromTextArea(this.element.querySelector('.editor-content'), {
      mode: "javascript"
    });
  }

});
