import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('babel-transpiler', 'Integration | Component | babel transpiler', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{babel-transpiler}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#babel-transpiler}}
      template block text
    {{/babel-transpiler}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
