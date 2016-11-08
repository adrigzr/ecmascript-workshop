import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('codemirror-editor', 'Integration | Component | codemirror editor', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{codemirror-editor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#codemirror-editor}}
      template block text
    {{/codemirror-editor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
