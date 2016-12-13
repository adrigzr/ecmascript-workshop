"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('workshop/app', ['exports', 'ember', 'workshop/resolver', 'ember-load-initializers', 'workshop/config/environment'], function (exports, _ember, _workshopResolver, _emberLoadInitializers, _workshopConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _workshopConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _workshopConfigEnvironment['default'].podModulePrefix,
    Resolver: _workshopResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _workshopConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('workshop/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'workshop/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _workshopConfigEnvironment) {

  var name = _workshopConfigEnvironment['default'].APP.name;
  var version = _workshopConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('workshop/components/babel-transpiler', ['exports', 'ember', 'workshop/utils/send-action'], function (exports, _ember, _workshopUtilsSendAction) {
	var Babel = window.Babel;
	exports['default'] = _ember['default'].Component.extend({

		attributeBindings: ['id'],

		id: 'babel-transpiler',

		isVisible: false,

		didReceiveAttrs: function didReceiveAttrs() {
			this._super.apply(this, arguments);

			var input = this.get('code');
			var options = this.get('options');
			var output = undefined;

			try {
				output = Babel.transform(input, options).code;
			} catch (e) {
				return (0, _workshopUtilsSendAction['default'])(this, 'onError', e);
			}

			return (0, _workshopUtilsSendAction['default'])(this, 'onTranspile', output);
		}

	});
});
define('workshop/components/basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown'], function (exports, _emberBasicDropdownComponentsBasicDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdown['default'];
    }
  });
});
define('workshop/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content'], function (exports, _emberBasicDropdownComponentsBasicDropdownContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownContent['default'];
    }
  });
});
define('workshop/components/basic-dropdown/trigger', ['exports', 'ember-basic-dropdown/components/basic-dropdown/trigger'], function (exports, _emberBasicDropdownComponentsBasicDropdownTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownTrigger['default'];
    }
  });
});
define('workshop/components/codemirror-editor', ['exports', 'ember'], function (exports, _ember) {
	var CodeMirror = window.CodeMirror;
	exports['default'] = _ember['default'].Component.extend({

		attributeBindings: ['id'],

		id: 'codemirror-editor',

		classNames: ['transition'],

		onChange: null,

		didInsertElement: function didInsertElement() {
			var _this = this;

			this._super.apply(this, arguments);

			var element = this.element.querySelector('.editor-content');
			var instance = CodeMirror.fromTextArea(element, {
				mode: 'javascript',
				lineNumbers: true,
				reindentOnLoad: true,
				theme: 'solarized dark',
				clearWhenEmpty: false
			});

			instance.on('change', function (e) {
				if (_this.onChange) {
					_this.onChange(e.getValue(), e);
				}
			});

			this.set('instance', instance);
		},

		didUpdateAttrs: function didUpdateAttrs() {
			this._super.apply(this, arguments);

			var instance = this.get('instance');
			var currentValue = instance.getValue();
			var newValue = this.get('code');

			if (instance && currentValue !== newValue) {
				instance.setValue(newValue);
			}
		},

		willDestroy: function willDestroy() {
			this._super.apply(this, arguments);

			var instance = this.get('instance');

			instance.off('change');
		}

	});
});
define('workshop/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('workshop/components/kata-description', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({

		attributeBindings: ['id'],

		id: 'kata-description',

		classNames: ['transition']

	});
});
define('workshop/components/kata-output', ['exports', 'ember'], function (exports, _ember) {

	function buildTitle(data) {
		if (data.parent) {
			return buildTitle(data.parent) + ' ' + data.title;
		}

		return data.title;
	}

	exports['default'] = _ember['default'].Component.extend({

		attributeBindings: ['id'],

		id: 'kata-output',

		messages: null,

		resetOutput: function resetOutput() {
			this.set('messages', []);
		},

		addOutput: function addOutput(data) {
			var messages = this.get('messages');

			messages.pushObject({
				title: buildTitle(data),
				state: data.state
			});
		},

		addException: function addException(data) {
			var messages = this.get('messages');

			messages.pushObject({
				title: 'Exception: ' + data.err.message,
				state: data.state
			});
		},

		sendEnd: function sendEnd() {
			var messages = this.get('messages');

			this.sendAction('onEnd', messages);
		},

		sendStart: function sendStart() {
			this.sendAction('onStart');
		},

		onEvent: function onEvent(data) {
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
			onEvent: function onEvent(data) {
				this.onEvent(data);
			}
		}

	});
});
define('workshop/components/menu-kata-item', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		tagName: 'li'
	});
});
define('workshop/components/mocha-runner', ['exports', 'ember'], function (exports, _ember) {
	var computed = _ember['default'].computed;
	exports['default'] = _ember['default'].Component.extend({

		tagName: 'iframe',

		attributeBindings: ['sandbox', 'id', 'src'],

		sandbox: 'allow-scripts allow-same-origin',

		src: '/sandbox.html',

		onEvent: null,

		onEnd: null,

		onMessage: function onMessage(message) {
			var data = message.data;

			if (this.onEvent) {
				this.onEvent(data);
			}
		},

		onMessageBinding: computed(function () {
			return this.onMessage.bind(this);
		}),

		init: function init() {
			this._super.apply(this, arguments);

			window.addEventListener('message', this.get('onMessageBinding'));
		},

		didUpdate: function didUpdate() {
			var frame = this.$().get(0);

			frame.contentWindow.location.reload();
		},

		didInsertElement: function didInsertElement() {
			var _this = this;

			this._super.apply(this, arguments);

			var frame = this.$().get(0);

			frame.onload = function () {
				var code = _this.get('code');
				var suite = _this.get('suite');
				var message = {
					code: code,
					suite: suite
				};

				frame.contentWindow.postMessage(message, '*');
			};
		},

		willDestroy: function willDestroy() {
			this._super.apply(this, arguments);

			window.removeEventListener('message', this.get('onMessageBinding'));
		}

	});
});
/* eslint no-eval:0 */
define('workshop/components/paper-autocomplete-content', ['exports', 'ember-paper/components/paper-autocomplete-content'], function (exports, _emberPaperComponentsPaperAutocompleteContent) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteContent['default'];
});
define('workshop/components/paper-autocomplete-dropdown', ['exports', 'ember-paper/components/paper-autocomplete-dropdown'], function (exports, _emberPaperComponentsPaperAutocompleteDropdown) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteDropdown['default'];
});
define('workshop/components/paper-autocomplete-highlight', ['exports', 'ember-paper/components/paper-autocomplete-highlight'], function (exports, _emberPaperComponentsPaperAutocompleteHighlight) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocompleteHighlight['default'];
    }
  });
});
define('workshop/components/paper-autocomplete-options', ['exports', 'ember-paper/components/paper-autocomplete-options'], function (exports, _emberPaperComponentsPaperAutocompleteOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocompleteOptions['default'];
    }
  });
});
define('workshop/components/paper-autocomplete-trigger-container', ['exports', 'ember-paper/components/paper-autocomplete-trigger-container'], function (exports, _emberPaperComponentsPaperAutocompleteTriggerContainer) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteTriggerContainer['default'];
});
define('workshop/components/paper-autocomplete-trigger', ['exports', 'ember-paper/components/paper-autocomplete-trigger'], function (exports, _emberPaperComponentsPaperAutocompleteTrigger) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteTrigger['default'];
});
define('workshop/components/paper-autocomplete', ['exports', 'ember-paper/components/paper-autocomplete'], function (exports, _emberPaperComponentsPaperAutocomplete) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocomplete['default'];
    }
  });
});
define('workshop/components/paper-backdrop', ['exports', 'ember-paper/components/paper-backdrop'], function (exports, _emberPaperComponentsPaperBackdrop) {
  exports['default'] = _emberPaperComponentsPaperBackdrop['default'];
});
define('workshop/components/paper-button', ['exports', 'ember-paper/components/paper-button'], function (exports, _emberPaperComponentsPaperButton) {
  exports['default'] = _emberPaperComponentsPaperButton['default'];
});
define('workshop/components/paper-card-actions', ['exports', 'ember-paper/components/paper-card-actions'], function (exports, _emberPaperComponentsPaperCardActions) {
  exports['default'] = _emberPaperComponentsPaperCardActions['default'];
});
define('workshop/components/paper-card-avatar', ['exports', 'ember-paper/components/paper-card-avatar'], function (exports, _emberPaperComponentsPaperCardAvatar) {
  exports['default'] = _emberPaperComponentsPaperCardAvatar['default'];
});
define('workshop/components/paper-card-content', ['exports', 'ember-paper/components/paper-card-content'], function (exports, _emberPaperComponentsPaperCardContent) {
  exports['default'] = _emberPaperComponentsPaperCardContent['default'];
});
define('workshop/components/paper-card-header-headline', ['exports', 'ember-paper/components/paper-card-header-headline'], function (exports, _emberPaperComponentsPaperCardHeaderHeadline) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderHeadline['default'];
});
define('workshop/components/paper-card-header-subhead', ['exports', 'ember-paper/components/paper-card-header-subhead'], function (exports, _emberPaperComponentsPaperCardHeaderSubhead) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderSubhead['default'];
});
define('workshop/components/paper-card-header-text', ['exports', 'ember-paper/components/paper-card-header-text'], function (exports, _emberPaperComponentsPaperCardHeaderText) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderText['default'];
});
define('workshop/components/paper-card-header-title', ['exports', 'ember-paper/components/paper-card-header-title'], function (exports, _emberPaperComponentsPaperCardHeaderTitle) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderTitle['default'];
});
define('workshop/components/paper-card-header', ['exports', 'ember-paper/components/paper-card-header'], function (exports, _emberPaperComponentsPaperCardHeader) {
  exports['default'] = _emberPaperComponentsPaperCardHeader['default'];
});
define('workshop/components/paper-card-icon-actions', ['exports', 'ember-paper/components/paper-card-icon-actions'], function (exports, _emberPaperComponentsPaperCardIconActions) {
  exports['default'] = _emberPaperComponentsPaperCardIconActions['default'];
});
define('workshop/components/paper-card-image', ['exports', 'ember-paper/components/paper-card-image'], function (exports, _emberPaperComponentsPaperCardImage) {
  exports['default'] = _emberPaperComponentsPaperCardImage['default'];
});
define('workshop/components/paper-card-media', ['exports', 'ember-paper/components/paper-card-media'], function (exports, _emberPaperComponentsPaperCardMedia) {
  exports['default'] = _emberPaperComponentsPaperCardMedia['default'];
});
define('workshop/components/paper-card-title-media', ['exports', 'ember-paper/components/paper-card-title-media'], function (exports, _emberPaperComponentsPaperCardTitleMedia) {
  exports['default'] = _emberPaperComponentsPaperCardTitleMedia['default'];
});
define('workshop/components/paper-card-title-text', ['exports', 'ember-paper/components/paper-card-title-text'], function (exports, _emberPaperComponentsPaperCardTitleText) {
  exports['default'] = _emberPaperComponentsPaperCardTitleText['default'];
});
define('workshop/components/paper-card-title', ['exports', 'ember-paper/components/paper-card-title'], function (exports, _emberPaperComponentsPaperCardTitle) {
  exports['default'] = _emberPaperComponentsPaperCardTitle['default'];
});
define('workshop/components/paper-card', ['exports', 'ember-paper/components/paper-card'], function (exports, _emberPaperComponentsPaperCard) {
  exports['default'] = _emberPaperComponentsPaperCard['default'];
});
define('workshop/components/paper-checkbox', ['exports', 'ember-paper/components/paper-checkbox'], function (exports, _emberPaperComponentsPaperCheckbox) {
  exports['default'] = _emberPaperComponentsPaperCheckbox['default'];
});
define('workshop/components/paper-content', ['exports', 'ember-paper/components/paper-content'], function (exports, _emberPaperComponentsPaperContent) {
  exports['default'] = _emberPaperComponentsPaperContent['default'];
});
define('workshop/components/paper-dialog-actions', ['exports', 'ember-paper/components/paper-dialog-actions'], function (exports, _emberPaperComponentsPaperDialogActions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogActions['default'];
    }
  });
});
define('workshop/components/paper-dialog-container', ['exports', 'ember-paper/components/paper-dialog-container'], function (exports, _emberPaperComponentsPaperDialogContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogContainer['default'];
    }
  });
});
define('workshop/components/paper-dialog-content', ['exports', 'ember-paper/components/paper-dialog-content'], function (exports, _emberPaperComponentsPaperDialogContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogContent['default'];
    }
  });
});
define('workshop/components/paper-dialog-inner', ['exports', 'ember-paper/components/paper-dialog-inner'], function (exports, _emberPaperComponentsPaperDialogInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogInner['default'];
    }
  });
});
define('workshop/components/paper-dialog', ['exports', 'ember-paper/components/paper-dialog'], function (exports, _emberPaperComponentsPaperDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialog['default'];
    }
  });
});
define('workshop/components/paper-divider', ['exports', 'ember-paper/components/paper-divider'], function (exports, _emberPaperComponentsPaperDivider) {
  exports['default'] = _emberPaperComponentsPaperDivider['default'];
});
define('workshop/components/paper-form', ['exports', 'ember-paper/components/paper-form'], function (exports, _emberPaperComponentsPaperForm) {
  exports['default'] = _emberPaperComponentsPaperForm['default'];
});
define('workshop/components/paper-grid-list', ['exports', 'ember-paper/components/paper-grid-list'], function (exports, _emberPaperComponentsPaperGridList) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridList['default'];
    }
  });
});
define('workshop/components/paper-grid-tile-footer', ['exports', 'ember-paper/components/paper-grid-tile-footer'], function (exports, _emberPaperComponentsPaperGridTileFooter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridTileFooter['default'];
    }
  });
});
define('workshop/components/paper-grid-tile', ['exports', 'ember-paper/components/paper-grid-tile'], function (exports, _emberPaperComponentsPaperGridTile) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridTile['default'];
    }
  });
});
define('workshop/components/paper-icon', ['exports', 'ember-paper/components/paper-icon'], function (exports, _emberPaperComponentsPaperIcon) {
  exports['default'] = _emberPaperComponentsPaperIcon['default'];
});
define('workshop/components/paper-input', ['exports', 'ember-paper/components/paper-input'], function (exports, _emberPaperComponentsPaperInput) {
  exports['default'] = _emberPaperComponentsPaperInput['default'];
});
define('workshop/components/paper-item', ['exports', 'ember-paper/components/paper-item'], function (exports, _emberPaperComponentsPaperItem) {
  exports['default'] = _emberPaperComponentsPaperItem['default'];
});
define('workshop/components/paper-list', ['exports', 'ember-paper/components/paper-list'], function (exports, _emberPaperComponentsPaperList) {
  exports['default'] = _emberPaperComponentsPaperList['default'];
});
define('workshop/components/paper-menu-content-inner', ['exports', 'ember-paper/components/paper-menu-content-inner'], function (exports, _emberPaperComponentsPaperMenuContentInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuContentInner['default'];
    }
  });
});
define('workshop/components/paper-menu-content', ['exports', 'ember-paper/components/paper-menu-content'], function (exports, _emberPaperComponentsPaperMenuContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuContent['default'];
    }
  });
});
define('workshop/components/paper-menu-item', ['exports', 'ember-paper/components/paper-menu-item'], function (exports, _emberPaperComponentsPaperMenuItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuItem['default'];
    }
  });
});
define('workshop/components/paper-menu', ['exports', 'ember-paper/components/paper-menu'], function (exports, _emberPaperComponentsPaperMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenu['default'];
    }
  });
});
define('workshop/components/paper-optgroup', ['exports', 'ember-paper/components/paper-optgroup'], function (exports, _emberPaperComponentsPaperOptgroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperOptgroup['default'];
    }
  });
});
define('workshop/components/paper-option', ['exports', 'ember-paper/components/paper-option'], function (exports, _emberPaperComponentsPaperOption) {
  exports['default'] = _emberPaperComponentsPaperOption['default'];
});
define('workshop/components/paper-progress-circular', ['exports', 'ember-paper/components/paper-progress-circular'], function (exports, _emberPaperComponentsPaperProgressCircular) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperProgressCircular['default'];
    }
  });
});
define('workshop/components/paper-progress-linear', ['exports', 'ember-paper/components/paper-progress-linear'], function (exports, _emberPaperComponentsPaperProgressLinear) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperProgressLinear['default'];
    }
  });
});
define('workshop/components/paper-radio-group', ['exports', 'ember-paper/components/paper-radio-group'], function (exports, _emberPaperComponentsPaperRadioGroup) {
  exports['default'] = _emberPaperComponentsPaperRadioGroup['default'];
});
define('workshop/components/paper-radio', ['exports', 'ember-paper/components/paper-radio'], function (exports, _emberPaperComponentsPaperRadio) {
  exports['default'] = _emberPaperComponentsPaperRadio['default'];
});
define('workshop/components/paper-reset-button', ['exports', 'ember-paper/components/paper-reset-button'], function (exports, _emberPaperComponentsPaperResetButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperResetButton['default'];
    }
  });
});
define('workshop/components/paper-select-content', ['exports', 'ember-paper/components/paper-select-content'], function (exports, _emberPaperComponentsPaperSelectContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectContent['default'];
    }
  });
});
define('workshop/components/paper-select-header', ['exports', 'ember-paper/components/paper-select-header'], function (exports, _emberPaperComponentsPaperSelectHeader) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectHeader['default'];
    }
  });
});
define('workshop/components/paper-select-menu-inner', ['exports', 'ember-paper/components/paper-select-menu-inner'], function (exports, _emberPaperComponentsPaperSelectMenuInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectMenuInner['default'];
    }
  });
});
define('workshop/components/paper-select-menu-trigger', ['exports', 'ember-paper/components/paper-select-menu-trigger'], function (exports, _emberPaperComponentsPaperSelectMenuTrigger) {
  exports['default'] = _emberPaperComponentsPaperSelectMenuTrigger['default'];
});
define('workshop/components/paper-select-menu', ['exports', 'ember-paper/components/paper-select-menu'], function (exports, _emberPaperComponentsPaperSelectMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectMenu['default'];
    }
  });
});
define('workshop/components/paper-select-options', ['exports', 'ember-paper/components/paper-select-options'], function (exports, _emberPaperComponentsPaperSelectOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectOptions['default'];
    }
  });
});
define('workshop/components/paper-select-search', ['exports', 'ember-paper/components/paper-select-search'], function (exports, _emberPaperComponentsPaperSelectSearch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectSearch['default'];
    }
  });
});
define('workshop/components/paper-select-trigger', ['exports', 'ember-paper/components/paper-select-trigger'], function (exports, _emberPaperComponentsPaperSelectTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectTrigger['default'];
    }
  });
});
define('workshop/components/paper-select', ['exports', 'ember-paper/components/paper-select'], function (exports, _emberPaperComponentsPaperSelect) {
  exports['default'] = _emberPaperComponentsPaperSelect['default'];
});
define('workshop/components/paper-sidenav-container', ['exports', 'ember-paper/components/paper-sidenav-container'], function (exports, _emberPaperComponentsPaperSidenavContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSidenavContainer['default'];
    }
  });
});
define('workshop/components/paper-sidenav-inner', ['exports', 'ember-paper/components/paper-sidenav-inner'], function (exports, _emberPaperComponentsPaperSidenavInner) {
  exports['default'] = _emberPaperComponentsPaperSidenavInner['default'];
});
define('workshop/components/paper-sidenav-toggle', ['exports', 'ember-paper/components/paper-sidenav-toggle'], function (exports, _emberPaperComponentsPaperSidenavToggle) {
  exports['default'] = _emberPaperComponentsPaperSidenavToggle['default'];
});
define('workshop/components/paper-sidenav', ['exports', 'ember-paper/components/paper-sidenav'], function (exports, _emberPaperComponentsPaperSidenav) {
  exports['default'] = _emberPaperComponentsPaperSidenav['default'];
});
define('workshop/components/paper-slider', ['exports', 'ember-paper/components/paper-slider'], function (exports, _emberPaperComponentsPaperSlider) {
  exports['default'] = _emberPaperComponentsPaperSlider['default'];
});
define('workshop/components/paper-subheader', ['exports', 'ember-paper/components/paper-subheader'], function (exports, _emberPaperComponentsPaperSubheader) {
  exports['default'] = _emberPaperComponentsPaperSubheader['default'];
});
define('workshop/components/paper-switch', ['exports', 'ember-paper/components/paper-switch'], function (exports, _emberPaperComponentsPaperSwitch) {
  exports['default'] = _emberPaperComponentsPaperSwitch['default'];
});
define('workshop/components/paper-toolbar-tools', ['exports', 'ember-paper/components/paper-toolbar-tools'], function (exports, _emberPaperComponentsPaperToolbarTools) {
  exports['default'] = _emberPaperComponentsPaperToolbarTools['default'];
});
define('workshop/components/paper-toolbar', ['exports', 'ember-paper/components/paper-toolbar'], function (exports, _emberPaperComponentsPaperToolbar) {
  exports['default'] = _emberPaperComponentsPaperToolbar['default'];
});
define('workshop/components/paper-virtual-repeat-scroller', ['exports', 'ember-paper/components/paper-virtual-repeat-scroller'], function (exports, _emberPaperComponentsPaperVirtualRepeatScroller) {
  exports['default'] = _emberPaperComponentsPaperVirtualRepeatScroller['default'];
});
define('workshop/components/paper-virtual-repeat', ['exports', 'ember-paper/components/paper-virtual-repeat'], function (exports, _emberPaperComponentsPaperVirtualRepeat) {
  exports['default'] = _emberPaperComponentsPaperVirtualRepeat['default'];
});
define('workshop/components/power-select-multiple', ['exports', 'ember-power-select/components/power-select-multiple'], function (exports, _emberPowerSelectComponentsPowerSelectMultiple) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultiple['default'];
    }
  });
});
define('workshop/components/power-select-multiple/trigger', ['exports', 'ember-power-select/components/power-select-multiple/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectMultipleTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultipleTrigger['default'];
    }
  });
});
define('workshop/components/power-select', ['exports', 'ember-power-select/components/power-select'], function (exports, _emberPowerSelectComponentsPowerSelect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelect['default'];
    }
  });
});
define('workshop/components/power-select/before-options', ['exports', 'ember-power-select/components/power-select/before-options'], function (exports, _emberPowerSelectComponentsPowerSelectBeforeOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectBeforeOptions['default'];
    }
  });
});
define('workshop/components/power-select/options', ['exports', 'ember-power-select/components/power-select/options'], function (exports, _emberPowerSelectComponentsPowerSelectOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectOptions['default'];
    }
  });
});
define('workshop/components/power-select/search-message', ['exports', 'ember-power-select/components/power-select/search-message'], function (exports, _emberPowerSelectComponentsPowerSelectSearchMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectSearchMessage['default'];
    }
  });
});
define('workshop/components/power-select/trigger', ['exports', 'ember-power-select/components/power-select/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectTrigger['default'];
    }
  });
});
define('workshop/components/transition-group', ['exports', 'ember-css-transitions/components/transition-group'], function (exports, _emberCssTransitionsComponentsTransitionGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCssTransitionsComponentsTransitionGroup['default'];
    }
  });
});
define('workshop/components/virtual-each', ['exports', 'virtual-each/components/virtual-each/component'], function (exports, _virtualEachComponentsVirtualEachComponent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _virtualEachComponentsVirtualEachComponent['default'];
    }
  });
});
define('workshop/controllers/application', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Controller.extend({
		leftSideBarOpen: false,

		actions: {
			toggleMenu: function toggleMenu() {
				this.toggleProperty('leftSideBarOpen');
			}
		}
	});
});
define('workshop/controllers/katas', ['exports', 'ember', 'ember-local-storage', 'workshop/config/environment'], function (exports, _ember, _emberLocalStorage, _workshopConfigEnvironment) {
	var APP = _workshopConfigEnvironment['default'].APP;

	var DEBOUNCE_DELAY = 500;
	var STATUS = {
		PENDING: {
			ICON: 'timer',
			DESC: 'Running tests...'
		},
		ERROR: {
			ICON: 'close',
			DESC: 'Not all tests pased'
		},
		OK: {
			ICON: 'check',
			DESC: 'All tests pased'
		}
	};

	exports['default'] = _ember['default'].Controller.extend({

		kataStorage: (0, _emberLocalStorage.storageFor)('katas'),

		codeStorage: (0, _emberLocalStorage.storageFor)('code'),

		options: APP.babel,

		code: _ember['default'].computed('model.id', function () {
			var id = this.get('model.id');
			var lastCode = this.get('codeStorage.' + id);

			// Return last edited code if exist.
			return lastCode || this.get('model.code');
		}),

		/**
   * [close|check]
   */
		status: STATUS.ERROR,

		/**
   * Update the code & persist in localkataStorage.
   */
		_updateCode: function _updateCode(code) {
			var id = this.get('model.id');

			// Persist last code changes
			this.set('codeStorage.' + id, code);
		},

		actions: {
			onChange: function onChange(code) {
				_ember['default'].run.debounce(this, this._updateCode, code, DEBOUNCE_DELAY);
			},

			onError: function onError(e) {
				this.set('status', STATUS.ERROR);
			},

			onStart: function onStart() {
				// Update toolbar status
				this.set('status', STATUS.PENDING);
			},

			onEnd: function onEnd(messages) {
				// Update toolbar status
				if (messages.some(function (test) {
					return test.state === 'failed';
				})) {
					this.set('status', STATUS.ERROR);
				} else {
					this.set('status', STATUS.OK);
				}
			},

			run: function run() {
				this.notifyPropertyChange('code');
			},

			changeCode: function changeCode(code) {
				var id = this.get('model.id');

				this.set('codeStorage.' + id, code);
				this.notifyPropertyChange('code');
			}
		}

	});
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-dropdown.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-dropdown.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete-dropdown.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-highlight.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-highlight.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete-highlight.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-options.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-options.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete-options.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-trigger-container.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-trigger-container.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'modules/ember-paper/components/paper-autocomplete-trigger-container.js should pass jshint.\nmodules/ember-paper/components/paper-autocomplete-trigger-container.js: line 26, col 9, \'self\' is not defined.\n\n1 error');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete-trigger.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete-trigger.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete-trigger.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-autocomplete.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-autocomplete.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-autocomplete.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-backdrop.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-backdrop.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-backdrop.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-button.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-button.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-actions.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-actions.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-actions.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-avatar.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-avatar.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-avatar.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-header-headline.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-header-headline.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-header-headline.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-header-subhead.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-header-subhead.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-header-subhead.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-header-text.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-header-text.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-header-text.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-header-title.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-header-title.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-header-title.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-header.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-header.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-header.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-icon-actions.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-icon-actions.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-icon-actions.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-image.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-image.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-image.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-media.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-media.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-media.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-title-media.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-title-media.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-title-media.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-title-text.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-title-text.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-title-text.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card-title.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card-title.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card-title.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-card.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-card.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-card.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-checkbox.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-checkbox.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-checkbox.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-dialog-actions.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-dialog-actions.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-dialog-actions.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-dialog-container.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-dialog-container.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-dialog-container.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-dialog-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-dialog-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-dialog-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-dialog-inner.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-dialog-inner.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-dialog-inner.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-dialog.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-dialog.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-dialog.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-divider.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-divider.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-divider.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-form.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-form.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-form.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-grid-list.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-grid-list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-grid-list.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-grid-tile-footer.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-grid-tile-footer.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-grid-tile-footer.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-grid-tile.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-grid-tile.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-grid-tile.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-icon.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-icon.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-icon.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-input.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-input.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-input.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-item.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-item.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-item.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-list.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-list.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-list.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-menu-content-inner.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-menu-content-inner.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-menu-content-inner.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-menu-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-menu-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-menu-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-menu-item.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-menu-item.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-menu-item.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-menu.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-menu.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-menu.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-optgroup.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-optgroup.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-optgroup.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-option.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-option.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-option.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-progress-circular.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-progress-circular.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-progress-circular.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-progress-linear.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-progress-linear.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-progress-linear.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-radio-group.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-radio-group.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-radio-group.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-radio.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-radio.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-radio.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-reset-button.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-reset-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-reset-button.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-content.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-content.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-content.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-header.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-header.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-header.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-menu-inner.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-menu-inner.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-menu-inner.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-menu-trigger.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-menu-trigger.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-menu-trigger.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-menu.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-menu.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-menu.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-options.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-options.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-options.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-search.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-search.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-search.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select-trigger.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select-trigger.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select-trigger.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-select.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-select.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-select.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-sidenav-container.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-sidenav-container.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-sidenav-container.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-sidenav-inner.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-sidenav-inner.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-sidenav-inner.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-sidenav-toggle.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-sidenav-toggle.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-sidenav-toggle.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-sidenav.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-sidenav.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-sidenav.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-slider.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-slider.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-slider.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-subheader.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-subheader.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-subheader.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-switch.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-switch.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-switch.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-toolbar-tools.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-toolbar-tools.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-toolbar-tools.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-toolbar.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-toolbar.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-toolbar.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-virtual-repeat-scroller.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-virtual-repeat-scroller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-virtual-repeat-scroller.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/components/paper-virtual-repeat.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/components/paper-virtual-repeat.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/components/paper-virtual-repeat.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/helpers/underscore.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/helpers/underscore.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/helpers/underscore.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/initializers/paper-wormhole.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/initializers/paper-wormhole.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/initializers/paper-wormhole.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/child-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/child-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/child-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/color-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/color-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/color-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/events-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/events-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/events-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/flex-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/flex-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/flex-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/focusable-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/focusable-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/focusable-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/parent-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/parent-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/parent-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/proxiable-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/proxiable-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/proxiable-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/proxy-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/proxy-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/proxy-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/ripple-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/ripple-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/ripple-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/translate3d-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/translate3d-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/translate3d-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/mixins/validation-mixin.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/mixins/validation-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/mixins/validation-mixin.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/services/paper-sidenav.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/services/paper-sidenav.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/services/paper-sidenav.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/utils/grid-layout.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/utils/grid-layout.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/utils/grid-layout.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/utils/promise-proxies.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/utils/promise-proxies.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/utils/promise-proxies.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/validators/max.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/validators/max.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/validators/max.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/validators/maxlength.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/validators/maxlength.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/validators/maxlength.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/validators/min.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/validators/min.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/validators/min.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/validators/minlength.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/validators/minlength.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/validators/minlength.js should pass jshint.');
  });
});
define('workshop/ember-paper/tests/modules/ember-paper/validators/required.jshint', ['exports'], function (exports) {
  QUnit.module('JSHint | modules/ember-paper/validators/required.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'modules/ember-paper/validators/required.js should pass jshint.');
  });
});
define('workshop/helpers/-paper-underscore', ['exports', 'ember-paper/helpers/underscore'], function (exports, _emberPaperHelpersUnderscore) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperHelpersUnderscore['default'];
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function get() {
      return _emberPaperHelpersUnderscore.underscore;
    }
  });
});
define('workshop/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/cancel-all', ['exports', 'ember', 'ember-concurrency/-helpers'], function (exports, _ember, _emberConcurrencyHelpers) {
  exports.cancelHelper = cancelHelper;

  function cancelHelper(args) {
    var cancelable = args[0];
    if (!cancelable || typeof cancelable.cancelAll !== 'function') {
      _ember['default'].assert('The first argument passed to the `cancel-all` helper should be a Task or TaskGroup (without quotes); you passed ' + cancelable, false);
    }

    return (0, _emberConcurrencyHelpers.taskHelperClosure)('cancelAll', args);
  }

  exports['default'] = _ember['default'].Helper.helper(cancelHelper);
});
define('workshop/helpers/debounce', ['exports', 'ember-reactive-helpers/helpers/debounce'], function (exports, _emberReactiveHelpersHelpersDebounce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersDebounce['default'];
    }
  });
  Object.defineProperty(exports, 'debounce', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersDebounce.debounce;
    }
  });
});
define('workshop/helpers/ember-power-select-is-selected', ['exports', 'ember-power-select/helpers/ember-power-select-is-selected'], function (exports, _emberPowerSelectHelpersEmberPowerSelectIsSelected) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsSelected', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected.emberPowerSelectIsSelected;
    }
  });
});
define('workshop/helpers/ember-power-select-true-string-if-present', ['exports', 'ember-power-select/helpers/ember-power-select-true-string-if-present'], function (exports, _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectTrueStringIfPresent', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent.emberPowerSelectTrueStringIfPresent;
    }
  });
});
define('workshop/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/format-markdown', ['exports', 'ember', 'markdown-code-highlighting/helpers/format-markdown'], function (exports, _ember, _markdownCodeHighlightingHelpersFormatMarkdown) {
  exports['default'] = _markdownCodeHighlightingHelpersFormatMarkdown['default'];
});
define('workshop/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('workshop/helpers/perform', ['exports', 'ember', 'ember-concurrency/-task-property', 'ember-concurrency/-helpers'], function (exports, _ember, _emberConcurrencyTaskProperty, _emberConcurrencyHelpers) {
  exports.performHelper = performHelper;

  function performHelper(args, hash) {
    var task = args[0];
    if (!(task instanceof _emberConcurrencyTaskProperty.Task)) {
      _ember['default'].assert('The first argument passed to the `perform` helper should be a Task object (without quotes); you passed ' + task, false);
    }

    return (0, _emberConcurrencyHelpers.taskHelperClosure)('perform', args, hash);
  }

  exports['default'] = _ember['default'].Helper.helper(performHelper);
});
define('workshop/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('workshop/helpers/r', ['exports', 'ember-reactive-helpers/helpers/r'], function (exports, _emberReactiveHelpersHelpersR) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersR['default'];
    }
  });
  Object.defineProperty(exports, 'helper', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersR.helper;
    }
  });
});
define('workshop/helpers/r/debugger', ['exports', 'ember-reactive-helpers/helpers/r/debugger'], function (exports, _emberReactiveHelpersHelpersRDebugger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRDebugger['default'];
    }
  });
  Object.defineProperty(exports, 'rDebugger', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRDebugger.rDebugger;
    }
  });
});
define('workshop/helpers/r/get', ['exports', 'ember-reactive-helpers/helpers/r/get'], function (exports, _emberReactiveHelpersHelpersRGet) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRGet['default'];
    }
  });
  Object.defineProperty(exports, 'rGet', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRGet.rGet;
    }
  });
});
define('workshop/helpers/r/log', ['exports', 'ember-reactive-helpers/helpers/r/log'], function (exports, _emberReactiveHelpersHelpersRLog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRLog['default'];
    }
  });
  Object.defineProperty(exports, 'rLog', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRLog.rLog;
    }
  });
});
define('workshop/helpers/r/mut', ['exports', 'ember-reactive-helpers/helpers/r/mut'], function (exports, _emberReactiveHelpersHelpersRMut) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRMut['default'];
    }
  });
  Object.defineProperty(exports, 'rMut', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRMut.rMut;
    }
  });
});
define('workshop/helpers/r/param', ['exports', 'ember-reactive-helpers/helpers/r/param'], function (exports, _emberReactiveHelpersHelpersRParam) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRParam['default'];
    }
  });
  Object.defineProperty(exports, 'rParam', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRParam.rParam;
    }
  });
});
define('workshop/helpers/r/tap', ['exports', 'ember-reactive-helpers/helpers/r/tap'], function (exports, _emberReactiveHelpersHelpersRTap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRTap['default'];
    }
  });
  Object.defineProperty(exports, 'rTap', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersRTap.rTap;
    }
  });
});
define('workshop/helpers/shhh', ['exports', 'ember-reactive-helpers/helpers/shhh'], function (exports, _emberReactiveHelpersHelpersShhh) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersShhh['default'];
    }
  });
  Object.defineProperty(exports, 'shhh', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersShhh.shhh;
    }
  });
});
define('workshop/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('workshop/helpers/task', ['exports', 'ember'], function (exports, _ember) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function taskHelper(_ref) {
    var _ref2 = _toArray(_ref);

    var task = _ref2[0];

    var args = _ref2.slice(1);

    return task._curry.apply(task, _toConsumableArray(args));
  }

  exports['default'] = _ember['default'].Helper.helper(taskHelper);
});
define('workshop/helpers/throttle', ['exports', 'ember-reactive-helpers/helpers/throttle'], function (exports, _emberReactiveHelpersHelpersThrottle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersThrottle['default'];
    }
  });
  Object.defineProperty(exports, 'throttle', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersThrottle.throttle;
    }
  });
});
define('workshop/helpers/transition-to', ['exports', 'ember-reactive-helpers/helpers/transition-to'], function (exports, _emberReactiveHelpersHelpersTransitionTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersTransitionTo['default'];
    }
  });
  Object.defineProperty(exports, 'transitionTo', {
    enumerable: true,
    get: function get() {
      return _emberReactiveHelpersHelpersTransitionTo.transitionTo;
    }
  });
});
define('workshop/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('workshop/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'workshop/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _workshopConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_workshopConfigEnvironment['default'].APP.name, _workshopConfigEnvironment['default'].APP.version)
  };
});
define('workshop/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('workshop/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('workshop/initializers/ember-concurrency', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  exports['default'] = {
    name: 'ember-concurrency',
    initialize: function initialize() {}
  };
});
// This initializer exists only to make sure that the following
// imports happen before the app boots.
define('workshop/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('workshop/initializers/export-application-global', ['exports', 'ember', 'workshop/config/environment'], function (exports, _ember, _workshopConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_workshopConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _workshopConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_workshopConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('workshop/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('workshop/initializers/local-storage-adapter', ['exports', 'ember-local-storage/initializers/local-storage-adapter'], function (exports, _emberLocalStorageInitializersLocalStorageAdapter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter.initialize;
    }
  });
});
define('workshop/initializers/paper-wormhole', ['exports', 'ember-paper/initializers/paper-wormhole'], function (exports, _emberPaperInitializersPaperWormhole) {
  exports['default'] = {
    name: 'paper-wormhole',
    initialize: _emberPaperInitializersPaperWormhole['default']
  };
});
define('workshop/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('workshop/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('workshop/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("workshop/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('workshop/mixins/transition-mixin', ['exports', 'ember-css-transitions/mixins/transition-mixin'], function (exports, _emberCssTransitionsMixinsTransitionMixin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCssTransitionsMixinsTransitionMixin['default'];
    }
  });
});
define('workshop/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('workshop/router', ['exports', 'ember', 'workshop/config/environment'], function (exports, _ember, _workshopConfigEnvironment) {

	var Router = _ember['default'].Router.extend({
		location: _workshopConfigEnvironment['default'].locationType,
		rootURL: _workshopConfigEnvironment['default'].rootURL
	});

	Router.map(function () {
		this.route('katas', { path: '/katas/:kata_slug' });
		this.route('help', { path: '/help/:kata_slug' });
	});

	exports['default'] = Router;
});
define('workshop/routes/application', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
	exports['default'] = _ember['default'].Route.extend({
		kataStorage: (0, _emberLocalStorage.storageFor)('katas'),

		model: function model() {
			var _this = this;

			return _ember['default'].$.get('katas/definition.json').then(function (data) {
				var katas = data[0].childs;

				_this.set('kataStorage.content', katas);

				return katas;
			});
		}
	});
});
define('workshop/routes/help', ['exports', 'ember', 'ember-local-storage', 'workshop/routes/katas'], function (exports, _ember, _emberLocalStorage, _workshopRoutesKatas) {
	exports['default'] = _ember['default'].Route.extend({
		kataStorage: (0, _emberLocalStorage.storageFor)('katas'),

		codeStorage: (0, _emberLocalStorage.storageFor)('code'),

		model: function model(params) {
			var katas = this.get('kataStorage.content');
			// Flatten the array & find the kata
			var kata = (0, _workshopRoutesKatas.flattenKata)(katas).findBy('slug', params.kata_slug);

			return _ember['default'].$.get((0, _workshopRoutesKatas.buildOptions)(kata.path, 'HELP.md')).then(function (help) {
				var id = kata.slug;

				return Object.assign({ id: id, help: help }, kata);
			});
		}
	});
});
define('workshop/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('workshop/routes/katas', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	var buildOptions = function buildOptions(path, filename) {
		return {
			dataType: 'text',
			url: path + '/' + filename
		};
	};

	exports.buildOptions = buildOptions;
	var flattenKata = function flattenKata(katas) {
		var flat = [];

		katas.forEach(function (kata) {
			if (kata.childs.length) {
				flat.push.apply(flat, _toConsumableArray(flattenKata(kata.childs)));
			} else {
				flat.push(kata);
			}
		});

		return flat;
	};

	exports.flattenKata = flattenKata;
	exports['default'] = _ember['default'].Route.extend({
		kataStorage: (0, _emberLocalStorage.storageFor)('katas'),

		codeStorage: (0, _emberLocalStorage.storageFor)('code'),

		model: function model(params) {
			var katas = this.get('kataStorage.content');
			// Flatten the array & find the kata
			var kata = flattenKata(katas).findBy('slug', params.kata_slug);

			return _ember['default'].RSVP.hash({
				readme: _ember['default'].$.get(buildOptions(kata.path, 'README.md')),
				code: _ember['default'].$.get(buildOptions(kata.path, 'code.js')),
				suite: _ember['default'].$.get(buildOptions(kata.path, 'suite.js')),
				solution: _ember['default'].$.get(buildOptions(kata.path, 'solution.js'))
			}).then(function (data) {
				var id = kata.slug;

				return Object.assign({ id: id }, data, kata);
			});
		}
	});
});
define('workshop/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('workshop/services/constants', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var inject = _ember['default'].inject;
  var computed = _ember['default'].computed;
  var EObject = _ember['default'].Object;
  exports['default'] = Service.extend({

    sniffer: inject.service('sniffer'),

    webkit: computed(function () {
      return (/webkit/i.test(this.get('sniffer.vendorPrefix'))
      );
    }),

    vendorProperty: function vendorProperty(name) {
      var prefix = this.get('sniffer.vendorPrefix').toLowerCase();
      return this.get('webkit') ? '-webkit-' + name.charAt(0) + name.substring(1) : name;
    },

    CSS: computed('webkit', function () {
      var webkit = this.get('webkit');
      return {
        /* Constants */
        TRANSITIONEND: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
        ANIMATIONEND: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

        TRANSFORM: this.vendorProperty('transform'),
        TRANSFORM_ORIGIN: this.vendorProperty('transformOrigin'),
        TRANSITION: this.vendorProperty('transition'),
        TRANSITION_DURATION: this.vendorProperty('transitionDuration'),
        ANIMATION_PLAY_STATE: this.vendorProperty('animationPlayState'),
        ANIMATION_DURATION: this.vendorProperty('animationDuration'),
        ANIMATION_NAME: this.vendorProperty('animationName'),
        ANIMATION_TIMING: this.vendorProperty('animationTimingFunction'),
        ANIMATION_DIRECTION: this.vendorProperty('animationDirection')
      };
    }),

    KEYCODE: EObject.create({
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      TAB: 9
    }),

    MEDIA: {
      'xs': '(max-width: 599px)',
      'gt-xs': '(min-width: 600px)',
      'sm': '(min-width: 600px) and (max-width: 959px)',
      'gt-sm': '(min-width: 960px)',
      'md': '(min-width: 960px) and (max-width: 1279px)',
      'gt-md': '(min-width: 1280px)',
      'lg': '(min-width: 1280px) and (max-width: 1919px)',
      'gt-lg': '(min-width: 1920px)',
      'xl': '(min-width: 1920px)',
      'print': 'print'
    },

    MEDIA_PRIORITY: ['xl', 'gt-lg', 'lg', 'gt-md', 'md', 'gt-sm', 'sm', 'gt-xs', 'xs', 'print']
  });
});
define('workshop/services/paper-sidenav', ['exports', 'ember-paper/services/paper-sidenav'], function (exports, _emberPaperServicesPaperSidenav) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperServicesPaperSidenav['default'];
    }
  });
});
define('workshop/services/sniffer', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var computed = _ember['default'].computed;

  var isString = function isString(value) {
    return typeof value === 'string';
  };

  var lowercase = function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
  };

  var toInt = function toInt(str) {
    return parseInt(str, 10);
  };

  exports['default'] = Service.extend({
    vendorPrefix: '',
    transitions: false,
    animations: false,
    _document: null,
    _window: null,

    android: computed('', function () {
      return toInt((/android (\d+)/.exec(lowercase((this.get('_window').navigator || {}).userAgent)) || [])[1]);
    }),

    init: function init() {
      this._super.apply(this, arguments);
      if (typeof FastBoot !== 'undefined') {
        return;
      }

      var _document = document;
      var _window = window;

      this.setProperties({
        _document: _document,
        _window: _window
      });

      var bodyStyle = _document.body && _document.body.style;
      var vendorPrefix = undefined;
      var vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/;

      var transitions = false;
      var animations = false;
      var match = undefined;

      if (bodyStyle) {
        for (var prop in bodyStyle) {
          if (match = vendorRegex.exec(prop)) {
            vendorPrefix = match[0];
            vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
            break;
          }
        }

        if (!vendorPrefix) {
          vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
        }

        transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
        animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);

        if (this.get('android') && (!transitions || !animations)) {
          transitions = isString(bodyStyle.webkitTransition);
          animations = isString(bodyStyle.webkitAnimation);
        }
      }

      this.set('transitions', transitions);
      this.set('animations', animations);

      this.set('vendorPrefix', vendorPrefix);
    }

  });
});
/* globals FastBoot */
define('workshop/services/text-measurer', ['exports', 'ember-text-measurer/services/text-measurer'], function (exports, _emberTextMeasurerServicesTextMeasurer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTextMeasurerServicesTextMeasurer['default'];
    }
  });
});
define('workshop/services/util', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var $ = _ember['default'].$;

  var Util = Service.extend({

    // Disables scroll around the passed element.
    disableScrollAround: function disableScrollAround(element) {
      var util = this;
      var $document = $(window.document);

      util.disableScrollAround._count = util.disableScrollAround._count || 0;
      ++util.disableScrollAround._count;
      if (util.disableScrollAround._enableScrolling) {
        return util.disableScrollAround._enableScrolling;
      }

      var _$document$get = $document.get(0);

      var body = _$document$get.body;

      var restoreBody = disableBodyScroll();
      var restoreElement = disableElementScroll();

      return util.disableScrollAround._enableScrolling = function () {
        if (! --util.disableScrollAround._count) {
          restoreBody();
          restoreElement();
          delete util.disableScrollAround._enableScrolling;
        }
      };

      // Creates a virtual scrolling mask to absorb touchmove, keyboard, scrollbar clicking, and wheel events
      function disableElementScroll() {
        var zIndex = 50;
        var scrollMask = $('<div class="md-scroll-mask" style="z-index: ' + zIndex + '">\n          <div class="md-scroll-mask-bar"></div>\n        </div>');
        body.appendChild(scrollMask[0]);

        scrollMask.on('wheel', preventDefault);
        scrollMask.on('touchmove', preventDefault);
        $document.on('keydown', disableKeyNav);

        return function restoreScroll() {
          scrollMask.off('wheel');
          scrollMask.off('touchmove');
          scrollMask[0].parentNode.removeChild(scrollMask[0]);
          $document.off('keydown', disableKeyNav);
          delete util.disableScrollAround._enableScrolling;
        };

        // Prevent keypresses from elements inside the body
        // used to stop the keypresses that could cause the page to scroll
        // (arrow keys, spacebar, tab, etc).
        function disableKeyNav(e) {
          // -- temporarily removed this logic, will possibly re-add at a later date
          return;
          if (!element[0].contains(e.target)) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }

        function preventDefault(e) {
          e.preventDefault();
        }
      }

      // Converts the body to a position fixed block and translate it to the proper scroll
      // position
      function disableBodyScroll() {
        var htmlNode = body.parentNode;
        var restoreHtmlStyle = htmlNode.getAttribute('style') || '';
        var restoreBodyStyle = body.getAttribute('style') || '';
        var scrollOffset = body.scrollTop + body.parentElement.scrollTop;
        var clientWidth = body.clientWidth;

        if (body.scrollHeight > body.clientHeight) {
          applyStyles(body, {
            position: 'fixed',
            width: '100%',
            top: -scrollOffset + 'px'
          });

          applyStyles(htmlNode, {
            overflowY: 'scroll'
          });
        }

        if (body.clientWidth < clientWidth) {
          applyStyles(body, { overflow: 'hidden' });
        }

        return function restoreScroll() {
          body.setAttribute('style', restoreBodyStyle);
          htmlNode.setAttribute('style', restoreHtmlStyle);
          body.scrollTop = scrollOffset;
        };
      }

      function applyStyles(el, styles) {
        for (var key in styles) {
          el.style[key] = styles[key];
        }
      }
    },
    enableScrolling: function enableScrolling() {
      var method = this.disableScrollAround._enableScrolling;
      method && method();
    },

    /*
     * supplant() method from Crockford's `Remedial Javascript`
     * Equivalent to use of $interpolate; without dependency on
     * interpolation symbols and scope. Note: the '{<token>}' can
     * be property names, property chains, or array indices.
     */
    supplant: function supplant(template, values, pattern) {
      pattern = pattern || /\{([^\{\}]*)\}/g;
      return template.replace(pattern, function (a, b) {
        var p = b.split('.');
        var r = values;
        try {
          for (var s in p) {
            if (p.hasOwnProperty(s)) {
              r = r[p[s]];
            }
          }
        } catch (e) {
          r = a;
        }
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    },
    nextTick: (function (window, prefixes, i, p, fnc) {
      while (!fnc && i < prefixes.length) {
        fnc = window[prefixes[i++] + 'equestAnimationFrame'];
      }
      return fnc && fnc.bind(window) || window.setImmediate || function (fnc) {
        window.setTimeout(fnc, 0);
      };
    })(window, 'r webkitR mozR msR oR'.split(' '), 0)

  });

  exports['default'] = Util;
});
define('workshop/storages/code', ['exports', 'ember-local-storage/local/object'], function (exports, _emberLocalStorageLocalObject) {

	var Storage = _emberLocalStorageLocalObject['default'].extend();

	Storage.reopenClass({
		initialState: function initialState() {
			return {};
		}
	});

	exports['default'] = Storage;
});
define('workshop/storages/katas', ['exports', 'ember-local-storage/local/array'], function (exports, _emberLocalStorageLocalArray) {

	var Storage = _emberLocalStorageLocalArray['default'].extend();

	Storage.reopenClass({
		initialState: function initialState() {
			return [];
		}
	});

	exports['default'] = Storage;
});
define("workshop/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 6,
                    "column": 3
                  },
                  "end": {
                    "line": 6,
                    "column": 32
                  }
                },
                "moduleName": "workshop/templates/application.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("Katas");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 5,
                  "column": 2
                },
                "end": {
                  "line": 7,
                  "column": 2
                }
              },
              "moduleName": "workshop/templates/application.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("			");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["block", "paper-toolbar-tools", [], [], 0, null, ["loc", [null, [6, 3], [6, 56]]]]],
            locals: ["toolbar"],
            templates: [child0]
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 10,
                    "column": 3
                  },
                  "end": {
                    "line": 10,
                    "column": 27
                  }
                },
                "moduleName": "workshop/templates/application.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("Home");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 9,
                  "column": 2
                },
                "end": {
                  "line": 11,
                  "column": 2
                }
              },
              "moduleName": "workshop/templates/application.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("			");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["block", "link-to", ["index"], [], 0, null, ["loc", [null, [10, 3], [10, 39]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        var child2 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 13,
                  "column": 3
                },
                "end": {
                  "line": 15,
                  "column": 3
                }
              },
              "moduleName": "workshop/templates/application.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("				");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "menu-kata-item", [], ["kata", ["subexpr", "@mut", [["get", "kata", ["loc", [null, [14, 26], [14, 30]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [14, 4], [14, 32]]], 0, 0]],
            locals: ["kata"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 1
              },
              "end": {
                "line": 17,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("ul");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("		");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[2] = dom.createMorphAt(dom.childAt(fragment, [3]), 1, 1);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [["block", "paper-toolbar", [], [], 0, null, ["loc", [null, [5, 2], [7, 20]]]], ["block", "paper-content", [], ["padding", true], 1, null, ["loc", [null, [9, 2], [11, 20]]]], ["block", "each", [["get", "model", ["loc", [null, [13, 11], [13, 16]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [13, 3], [15, 12]]]]],
          locals: [],
          templates: [child0, child1, child2]
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 25,
                      "column": 4
                    },
                    "end": {
                      "line": 27,
                      "column": 4
                    }
                  },
                  "moduleName": "workshop/templates/application.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("					");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                  return morphs;
                },
                statements: [["inline", "paper-icon", ["menu"], [], ["loc", [null, [26, 5], [26, 26]]], 0, 0]],
                locals: [],
                templates: []
              };
            })();
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 23,
                    "column": 3
                  },
                  "end": {
                    "line": 36,
                    "column": 3
                  }
                },
                "moduleName": "workshop/templates/application.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("				");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("h2");
                var el2 = dom.createTextNode("EcmaScript Workshop");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("				");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                dom.setAttribute(el1, "class", "flex");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("				");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                dom.setAttribute(el1, "id", "toolbar-buttons");
                var el2 = dom.createTextNode("\n");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("				");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                return morphs;
              },
              statements: [["block", "paper-button", [], ["iconButton", true, "onClick", ["subexpr", "action", ["toggleMenu"], [], ["loc", [null, [25, 44], [25, 65]]], 0, 0]], 0, null, ["loc", [null, [25, 4], [27, 21]]]]],
              locals: [],
              templates: [child0]
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 22,
                  "column": 2
                },
                "end": {
                  "line": 37,
                  "column": 2
                }
              },
              "moduleName": "workshop/templates/application.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "toolbar.tools", [], [], 0, null, ["loc", [null, [23, 3], [36, 21]]]]],
            locals: ["toolbar"],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 20,
                "column": 1
              },
              "end": {
                "line": 42,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n		");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "layout-fill layout-align-start-center layout-column full-height");
            var el2 = dom.createTextNode("\n			");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n		");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [["block", "paper-toolbar", [], [], 0, null, ["loc", [null, [22, 2], [37, 20]]]], ["content", "outlet", ["loc", [null, [40, 3], [40, 13]]], 0, 0, 0, 0]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 43,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-sidenav", [], ["class", "md-whiteframe-z2", "name", "left", "open", ["subexpr", "@mut", [["get", "leftSideBarOpen", ["loc", [null, [3, 60], [3, 75]]], 0, 0, 0, 0]], [], [], 0, 0], "onToggle", ["subexpr", "action", [["subexpr", "mut", [["get", "leftSideBarOpen", ["loc", [null, [3, 98], [3, 113]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 93], [3, 114]]], 0, 0]], [], ["loc", [null, [3, 85], [3, 115]]], 0, 0]], 0, null, ["loc", [null, [3, 1], [17, 19]]]], ["block", "paper-card-content", [], ["class", "flex"], 1, null, ["loc", [null, [20, 1], [42, 24]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 44,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "paper-sidenav-container", [], ["class", "inner-sidenav full-height"], 0, null, ["loc", [null, [1, 0], [43, 28]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/babel-transpiler", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/babel-transpiler.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/base-focusable", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/base-focusable.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/codemirror-editor", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 1
              },
              "end": {
                "line": 5,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/components/codemirror-editor.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "yield", ["loc", [null, [4, 2], [4, 11]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/codemirror-editor.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "toolbar.tools", [], [], 0, null, ["loc", [null, [3, 1], [5, 19]]]]],
        locals: ["toolbar"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/codemirror-editor.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("textarea");
        dom.setAttribute(el1, "class", "editor-content");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "paper-toolbar", [], [], 0, null, ["loc", [null, [2, 0], [6, 18]]]], ["content", "code", ["loc", [null, [8, 33], [8, 41]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/kata-description", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/kata-description.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "format-markdown", [["get", "kata", ["loc", [null, [1, 18], [1, 22]]], 0, 0, 0, 0]], [], ["loc", [null, [1, 0], [1, 24]]], 0, 0], ["content", "yield", ["loc", [null, [3, 0], [3, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/kata-output", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 79
              },
              "end": {
                "line": 5,
                "column": 122
              }
            },
            "moduleName": "workshop/templates/components/kata-output.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("✓");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 122
              },
              "end": {
                "line": 5,
                "column": 138
              }
            },
            "moduleName": "workshop/templates/components/kata-output.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("✘");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 1
            },
            "end": {
              "line": 6,
              "column": 1
            }
          },
          "moduleName": "workshop/templates/components/kata-output.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("[");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("] ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0, 1, 1);
          morphs[2] = dom.createMorphAt(element0, 3, 3);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["code code-", ["subexpr", "if", [["subexpr", "eq", [["get", "message.state", ["loc", [null, [5, 32], [5, 45]]], 0, 0, 0, 0], "passed"], [], ["loc", [null, [5, 28], [5, 55]]], 0, 0], "success", "danger"], [], ["loc", [null, [5, 23], [5, 76]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["block", "if", [["subexpr", "eq", [["get", "message.state", ["loc", [null, [5, 89], [5, 102]]], 0, 0, 0, 0], "passed"], [], ["loc", [null, [5, 85], [5, 112]]], 0, 0]], [], 0, 1, ["loc", [null, [5, 79], [5, 145]]]], ["content", "message.title", ["loc", [null, [5, 147], [5, 164]]], 0, 0, 0, 0]],
        locals: ["message"],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/kata-output.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "code");
        var el2 = dom.createTextNode("Test results:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        morphs[1] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["block", "each", [["get", "messages", ["loc", [null, [4, 9], [4, 17]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [4, 1], [6, 10]]]], ["inline", "yield", [["subexpr", "hash", [], ["onEvent", ["subexpr", "action", ["onEvent"], [], ["loc", [null, [9, 22], [9, 40]]], 0, 0]], ["loc", [null, [9, 8], [9, 41]]], 0, 0]], [], ["loc", [null, [9, 0], [9, 43]]], 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/menu-kata-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 1
              },
              "end": {
                "line": 2,
                "column": 45
              }
            },
            "moduleName": "workshop/templates/components/menu-kata-item.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["content", "kata.name", ["loc", [null, [2, 32], [2, 45]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 2
              },
              "end": {
                "line": 6,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/menu-kata-item.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "menu-kata-item", [], ["kata", ["subexpr", "@mut", [["get", "child", ["loc", [null, [5, 25], [5, 30]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [5, 3], [5, 32]]], 0, 0]],
          locals: ["child"],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 8,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/menu-kata-item.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("ul");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]), 1, 1);
          return morphs;
        },
        statements: [["block", "paper-content", [], ["padding", true], 0, null, ["loc", [null, [2, 1], [2, 63]]]], ["block", "each", [["get", "kata.childs", ["loc", [null, [4, 10], [4, 21]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [4, 2], [6, 11]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 10,
                  "column": 2
                },
                "end": {
                  "line": 10,
                  "column": 45
                }
              },
              "moduleName": "workshop/templates/components/menu-kata-item.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["content", "kata.name", ["loc", [null, [10, 32], [10, 45]]], 0, 0, 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 1
              },
              "end": {
                "line": 11,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/components/menu-kata-item.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["block", "link-to", ["katas", ["get", "kata.slug", ["loc", [null, [10, 21], [10, 30]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [10, 2], [10, 57]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/menu-kata-item.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-content", [], ["padding", true], 0, null, ["loc", [null, [9, 1], [11, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/menu-kata-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "kata.childs", ["loc", [null, [1, 6], [1, 17]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [12, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-autocomplete-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 4,
                  "column": 4
                },
                "end": {
                  "line": 11,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-autocomplete-content.hbs"
            },
            isEmpty: false,
            arity: 2,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "virtualItems", ["loc", [null, [10, 14], [10, 26]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 6], [10, 28]]], 0, 0]],
            locals: ["rawItems", "virtualItems"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 12,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-autocomplete-content.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["inline", "paper-backdrop", [], ["class", "md-click-catcher"], ["loc", [null, [3, 4], [3, 47]]], 0, 0], ["block", "paper-virtual-repeat", [["subexpr", "readonly", [["get", "select.results", ["loc", [null, [4, 38], [4, 52]]], 0, 0, 0, 0]], [], ["loc", [null, [4, 28], [4, 53]]], 0, 0]], ["id", ["subexpr", "readonly", [["get", "dropdownId", ["loc", [null, [5, 19], [5, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [5, 9], [5, 30]]], 0, 0], "class", ["subexpr", "concat", [["get", "dropdownId", ["loc", [null, [6, 20], [6, 30]]], 0, 0, 0, 0], " md-autocomplete-suggestions-container", " ember-basic-dropdown-content ", ["subexpr", "if", [["get", "renderInPlace", ["loc", [null, [6, 109], [6, 122]]], 0, 0, 0, 0], "ember-basic-dropdown-content--in-place "], [], ["loc", [null, [6, 105], [6, 165]]], 0, 0], ["subexpr", "if", [["get", "hPosition", ["loc", [null, [6, 170], [6, 179]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "hPosition", ["loc", [null, [6, 221], [6, 230]]], 0, 0, 0, 0], " "], [], ["loc", [null, [6, 180], [6, 235]]], 0, 0]], [], ["loc", [null, [6, 166], [6, 236]]], 0, 0], ["subexpr", "if", [["get", "vPosition", ["loc", [null, [6, 241], [6, 250]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "vPosition", ["loc", [null, [6, 292], [6, 301]]], 0, 0, 0, 0], " "], [], ["loc", [null, [6, 251], [6, 306]]], 0, 0], "md-whiteframe-z1 "], [], ["loc", [null, [6, 237], [6, 327]]], 0, 0], ["get", "animationClass", ["loc", [null, [6, 328], [6, 342]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 12], [6, 343]]], 0, 0], "containerSelector", ".md-autocomplete-suggestions", "scrollIndex", ["subexpr", "readonly", [["get", "select.scrollIndex", ["loc", [null, [8, 28], [8, 46]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 18], [8, 47]]], 0, 0], "positionCoordinates", ["subexpr", "readonly", [["get", "positionCoordinates", ["loc", [null, [9, 36], [9, 55]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 26], [9, 56]]], 0, 0]], 0, null, ["loc", [null, [4, 4], [11, 29]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-content.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "ember-wormhole", [], ["to", ["subexpr", "@mut", [["get", "to", ["loc", [null, [2, 23], [2, 25]]], 0, 0, 0, 0]], [], [], 0, 0], "renderInPlace", ["subexpr", "@mut", [["get", "renderInPlace", ["loc", [null, [2, 40], [2, 53]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [2, 2], [12, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete-content.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "dropdown.isOpen", ["loc", [null, [1, 6], [1, 21]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [13, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-autocomplete-dropdown", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete-dropdown.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["isOpen", ["get", "publicAPI.isOpen", ["loc", [null, [2, 9], [2, 25]]], 0, 0, 0, 0], "disabled", ["get", "publicAPI.disabled", ["loc", [null, [3, 11], [3, 29]]], 0, 0, 0, 0], "actions", ["get", "publicAPI.actions", ["loc", [null, [4, 10], [4, 27]]], 0, 0, 0, 0], "trigger", ["subexpr", "component", [["get", "triggerComponent", ["loc", [null, [5, 21], [5, 37]]], 0, 0, 0, 0]], ["appRoot", ["subexpr", "readonly", [["get", "appRoot", ["loc", [null, [6, 22], [6, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 12], [6, 30]]], 0, 0], "dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [7, 23], [7, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 13], [7, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [8, 24], [8, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 14], [8, 34]]], 0, 0], "onFocus", ["subexpr", "action", ["handleFocus"], [], ["loc", [null, [9, 12], [9, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [10, 28], [10, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 18], [10, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [11, 24], [11, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 14], [11, 34]]], 0, 0]], ["loc", [null, [5, 10], [12, 3]]], 0, 0], "content", ["subexpr", "component", [["get", "contentComponent", ["loc", [null, [13, 21], [13, 37]]], 0, 0, 0, 0]], ["appRoot", ["subexpr", "readonly", [["get", "appRoot", ["loc", [null, [14, 22], [14, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [14, 12], [14, 30]]], 0, 0], "dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [15, 23], [15, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 13], [15, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [16, 24], [16, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 14], [16, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [17, 28], [17, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 18], [17, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [18, 24], [18, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 14], [18, 34]]], 0, 0], "positionCoordinates", ["subexpr", "hash", [], ["top", ["get", "top", ["loc", [null, [20, 10], [20, 13]]], 0, 0, 0, 0], "left", ["get", "left", ["loc", [null, [21, 11], [21, 15]]], 0, 0, 0, 0], "right", ["get", "right", ["loc", [null, [22, 12], [22, 17]]], 0, 0, 0, 0], "width", ["get", "width", ["loc", [null, [23, 12], [23, 17]]], 0, 0, 0, 0]], ["loc", [null, [19, 24], [24, 5]]], 0, 0]], ["loc", [null, [13, 10], [25, 3]]], 0, 0]], ["loc", [null, [1, 8], [26, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [26, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-autocomplete-highlight", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 13
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete-highlight.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "highlight", ["loc", [null, [1, 0], [1, 13]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-autocomplete-options", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-options.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "role", "option");
          dom.setAttribute(el1, "tabindex", "0");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(6);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createAttrMorph(element0, 'aria-selected');
          morphs[2] = dom.createAttrMorph(element0, 'aria-disabled');
          morphs[3] = dom.createAttrMorph(element0, 'aria-current');
          morphs[4] = dom.createAttrMorph(element0, 'data-option-index');
          morphs[5] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["ember-power-select-option ", ["subexpr", "if", [["subexpr", "eq", [["get", "opt.raw", ["loc", [null, [2, 48], [2, 55]]], 0, 0, 0, 0], ["get", "select.highlighted", ["loc", [null, [2, 56], [2, 74]]], 0, 0, 0, 0]], [], ["loc", [null, [2, 44], [2, 75]]], 0, 0], "selected"], [], ["loc", [null, [2, 39], [2, 88]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "aria-selected", ["concat", [["subexpr", "ember-power-select-is-selected", [["get", "opt.raw", ["loc", [null, [3, 52], [3, 59]]], 0, 0, 0, 0], ["get", "select.selected", ["loc", [null, [3, 60], [3, 75]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 19], [3, 77]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "aria-disabled", ["subexpr", "ember-power-select-true-string-if-present", [["get", "opt.disabled", ["loc", [null, [4, 62], [4, 74]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [4, 76]]], 0, 0], 0, 0, 0, 0], ["attribute", "aria-current", ["concat", [["subexpr", "eq", [["get", "opt.raw", ["loc", [null, [5, 23], [5, 30]]], 0, 0, 0, 0], ["get", "select.highlighted", ["loc", [null, [5, 31], [5, 49]]], 0, 0, 0, 0]], [], ["loc", [null, [5, 18], [5, 51]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "data-option-index", ["concat", [["get", "groupIndex", ["loc", [null, [6, 25], [6, 35]]], 0, 0, 0, 0], ["get", "opt.virtualIndex", ["loc", [null, [6, 39], [6, 55]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "yield", [["get", "opt.raw", ["loc", [null, [9, 12], [9, 19]]], 0, 0, 0, 0], ["get", "select", ["loc", [null, [9, 20], [9, 26]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 4], [9, 28]]], 0, 0]],
        locals: ["opt"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete-options.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "options", ["loc", [null, [1, 8], [1, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [11, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-autocomplete-trigger", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "paper-input", [], ["label", ["subexpr", "@mut", [["get", "extra.label", ["loc", [null, [3, 10], [3, 21]]], 0, 0, 0, 0]], [], [], 0, 0], "value", ["subexpr", "@mut", [["get", "text", ["loc", [null, [4, 10], [4, 14]]], 0, 0, 0, 0]], [], [], 0, 0], "flex", true, "validationErrorMessages", ["subexpr", "readonly", [["get", "validationErrorMessages", ["loc", [null, [6, 38], [6, 61]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 28], [6, 62]]], 0, 0], "disabled", ["subexpr", "readonly", [["get", "disabled", ["loc", [null, [7, 23], [7, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 13], [7, 32]]], 0, 0], "onChange", ["subexpr", "action", ["handleInputLocal"], [], ["loc", [null, [8, 13], [8, 40]]], 0, 0], "onFocus", ["subexpr", "action", [["get", "onFocus", ["loc", [null, [9, 20], [9, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 12], [9, 28]]], 0, 0], "onBlur", ["subexpr", "action", [["get", "onBlur", ["loc", [null, [10, 19], [10, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 11], [10, 26]]], 0, 0], "onKeyDown", ["subexpr", "action", ["handleKeydown"], [], ["loc", [null, [11, 14], [11, 38]]], 0, 0]], ["loc", [null, [2, 2], [11, 40]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 24,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("input");
          dom.setAttribute(el1, "type", "search");
          dom.setAttribute(el1, "class", "ember-power-select-typeahead-input ember-power-select-search-input flex");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(9);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'placeholder');
          morphs[2] = dom.createAttrMorph(element0, 'oninput');
          morphs[3] = dom.createAttrMorph(element0, 'onchange');
          morphs[4] = dom.createAttrMorph(element0, 'onfocus');
          morphs[5] = dom.createAttrMorph(element0, 'onblur');
          morphs[6] = dom.createAttrMorph(element0, 'onkeydown');
          morphs[7] = dom.createAttrMorph(element0, 'disabled');
          morphs[8] = dom.createAttrMorph(element0, 'onmousedown');
          return morphs;
        },
        statements: [["attribute", "value", ["get", "text", ["loc", [null, [14, 12], [14, 16]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "placeholder", ["subexpr", "readonly", [["get", "placeholder", ["loc", [null, [16, 27], [16, 38]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [16, 40]]], 0, 0], 0, 0, 0, 0], ["attribute", "oninput", ["subexpr", "action", ["handleInputLocal"], [], ["loc", [null, [null, null], [17, 41]]], 0, 0], 0, 0, 0, 0], ["attribute", "onchange", ["subexpr", "action", ["handleInputLocal"], [], ["loc", [null, [null, null], [18, 42]]], 0, 0], 0, 0, 0, 0], ["attribute", "onfocus", ["subexpr", "action", [["get", "onFocus", ["loc", [null, [19, 21], [19, 28]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [19, 30]]], 0, 0], 0, 0, 0, 0], ["attribute", "onblur", ["subexpr", "action", [["get", "onBlur", ["loc", [null, [20, 20], [20, 26]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [20, 28]]], 0, 0], 0, 0, 0, 0], ["attribute", "onkeydown", ["subexpr", "action", ["handleKeydown"], [], ["loc", [null, [null, null], [21, 40]]], 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["subexpr", "readonly", [["get", "disabled", ["loc", [null, [22, 24], [22, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [22, 34]]], 0, 0], 0, 0, 0, 0], ["attribute", "onmousedown", ["subexpr", "action", ["stopPropagation"], [], ["loc", [null, [null, null], [23, 44]]], 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 0
            },
            "end": {
              "line": 27,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "paper-progress-linear", [], ["class", ["subexpr", "concat", [["subexpr", "if", [["get", "extra.label", [], 0, 0, 0, 0], "md-inline"], [], [], 0, 0], " "], [], [], 0, 0]], ["loc", [null, [26, 2], [26, 69]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 29,
                "column": 2
              },
              "end": {
                "line": 31,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "paper-icon", ["close"], [], ["loc", [null, [30, 4], [30, 26]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 0
            },
            "end": {
              "line": 32,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-reset-button", [], ["class", "ng-scope", "onReset", ["subexpr", "action", ["clear"], [], ["loc", [null, [29, 49], [29, 65]]], 0, 0], "tabindex", "-1"], 0, null, ["loc", [null, [29, 2], [31, 25]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 33,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete-trigger.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "extra.label", ["loc", [null, [1, 6], [1, 17]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [24, 7]]]], ["block", "if", [["subexpr", "and", [["get", "select.loading", ["loc", [null, [25, 11], [25, 25]]], 0, 0, 0, 0], ["get", "select.isActive", ["loc", [null, [25, 26], [25, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [25, 6], [25, 42]]], 0, 0]], [], 2, null, ["loc", [null, [25, 0], [27, 7]]]], ["block", "if", [["subexpr", "and", [["subexpr", "or", [["get", "selected", ["loc", [null, [28, 15], [28, 23]]], 0, 0, 0, 0], ["get", "text", ["loc", [null, [28, 24], [28, 28]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 11], [28, 29]]], 0, 0], ["get", "allowClear", ["loc", [null, [28, 30], [28, 40]]], 0, 0, 0, 0], ["subexpr", "not", [["get", "select.disabled", ["loc", [null, [28, 46], [28, 61]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 41], [28, 62]]], 0, 0]], [], ["loc", [null, [28, 6], [28, 63]]], 0, 0]], [], 3, null, ["loc", [null, [28, 0], [32, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define("workshop/templates/components/paper-autocomplete", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 27,
                  "column": 4
                },
                "end": {
                  "line": 50,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
            },
            isEmpty: false,
            arity: 2,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "opt", ["loc", [null, [49, 14], [49, 17]]], 0, 0, 0, 0], ["get", "term", ["loc", [null, [49, 18], [49, 22]]], 0, 0, 0, 0]], [], ["loc", [null, [49, 6], [49, 24]]], 0, 0]],
            locals: ["opt", "term"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 2
              },
              "end": {
                "line": 51,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "component", [["get", "triggerComponent", ["loc", [null, [27, 17], [27, 33]]], 0, 0, 0, 0]], ["allowClear", ["subexpr", "readonly", [["get", "allowClear", ["loc", [null, [28, 27], [28, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 17], [28, 38]]], 0, 0], "class", "layout-row", "flex", ["subexpr", "readonly", [["get", "flex", ["loc", [null, [30, 21], [30, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [30, 11], [30, 26]]], 0, 0], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [31, 15], [31, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "buildSelection", ["subexpr", "readonly", [["get", "buildSelection", ["loc", [null, [32, 31], [32, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [32, 21], [32, 46]]], 0, 0], "extra", ["subexpr", "readonly", [["get", "extra", ["loc", [null, [33, 22], [33, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [33, 12], [33, 28]]], 0, 0], "listboxId", ["subexpr", "readonly", [["get", "optionsId", ["loc", [null, [34, 26], [34, 35]]], 0, 0, 0, 0]], [], ["loc", [null, [34, 16], [34, 36]]], 0, 0], "onFocus", ["subexpr", "action", ["onFocus"], [], ["loc", [null, [35, 14], [35, 32]]], 0, 0], "activate", ["subexpr", "action", ["activate"], [], ["loc", [null, [36, 15], [36, 34]]], 0, 0], "onBlur", ["subexpr", "action", ["onBlur"], [], ["loc", [null, [37, 13], [37, 30]]], 0, 0], "onInput", ["subexpr", "action", ["onInput"], [], ["loc", [null, [38, 14], [38, 32]]], 0, 0], "placeholder", ["subexpr", "readonly", [["get", "placeholder", ["loc", [null, [39, 28], [39, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [39, 18], [39, 40]]], 0, 0], "onKeydown", ["subexpr", "action", ["onKeydown"], [], ["loc", [null, [40, 16], [40, 36]]], 0, 0], "searchEnabled", ["subexpr", "readonly", [["get", "searchEnabled", ["loc", [null, [41, 30], [41, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [41, 20], [41, 44]]], 0, 0], "searchField", ["subexpr", "readonly", [["get", "searchField", ["loc", [null, [42, 28], [42, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [42, 18], [42, 40]]], 0, 0], "searchText", ["subexpr", "readonly", [["get", "searchText", ["loc", [null, [43, 27], [43, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [43, 17], [43, 38]]], 0, 0], "validationErrorMessages", ["subexpr", "readonly", [["get", "validationErrorMessages", ["loc", [null, [44, 40], [44, 63]]], 0, 0, 0, 0]], [], ["loc", [null, [44, 30], [44, 64]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [45, 23], [45, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [45, 13], [45, 33]]], 0, 0], "selected", ["subexpr", "readonly", [["get", "selected", ["loc", [null, [46, 25], [46, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [46, 15], [46, 34]]], 0, 0], "selectedItemComponent", ["subexpr", "readonly", [["get", "selectedItemComponent", ["loc", [null, [47, 38], [47, 59]]], 0, 0, 0, 0]], [], ["loc", [null, [47, 28], [47, 60]]], 0, 0]], 0, null, ["loc", [null, [27, 4], [50, 18]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 57,
                  "column": 4
                },
                "end": {
                  "line": 62,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "component", [["get", "searchMessageComponent", ["loc", [null, [58, 18], [58, 40]]], 0, 0, 0, 0]], ["searchMessage", ["subexpr", "readonly", [["get", "searchMessage", ["loc", [null, [59, 32], [59, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [59, 22], [59, 46]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [60, 25], [60, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [60, 15], [60, 35]]], 0, 0]], ["loc", [null, [58, 6], [61, 8]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 63,
                      "column": 6
                    },
                    "end": {
                      "line": 65,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("        ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                  return morphs;
                },
                statements: [["inline", "yield", [], ["to", "inverse"], ["loc", [null, [64, 8], [64, 30]]], 0, 0]],
                locals: [],
                templates: []
              };
            })();
            var child1 = (function () {
              var child0 = (function () {
                return {
                  meta: {
                    "revision": "Ember@2.8.3",
                    "loc": {
                      "source": null,
                      "start": {
                        "line": 65,
                        "column": 6
                      },
                      "end": {
                        "line": 71,
                        "column": 6
                      }
                    },
                    "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
                  },
                  isEmpty: false,
                  arity: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("        ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("ul");
                    dom.setAttribute(el1, "class", "ember-power-select-options md-autocomplete-suggestions");
                    dom.setAttribute(el1, "role", "listbox");
                    var el2 = dom.createTextNode("\n          ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("li");
                    dom.setAttribute(el2, "class", "ember-power-select-option ember-power-select-option--no-matches-message");
                    dom.setAttribute(el2, "role", "option");
                    var el3 = dom.createTextNode("\n            ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createComment("");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n          ");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n        ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n      ");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var element0 = dom.childAt(fragment, [1, 1]);
                    var morphs = new Array(2);
                    morphs[0] = dom.createElementMorph(element0);
                    morphs[1] = dom.createMorphAt(element0, 1, 1);
                    return morphs;
                  },
                  statements: [["element", "action", ["onCreate", ["get", "publicAPI.searchText", ["loc", [null, [67, 128], [67, 148]]], 0, 0, 0, 0]], [], ["loc", [null, [67, 108], [67, 150]]], 0, 0], ["content", "noMatchesMessage", ["loc", [null, [68, 12], [68, 32]]], 0, 0, 0, 0]],
                  locals: [],
                  templates: []
                };
              })();
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 65,
                      "column": 6
                    },
                    "end": {
                      "line": 71,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                  dom.insertBoundary(fragment, 0);
                  dom.insertBoundary(fragment, null);
                  return morphs;
                },
                statements: [["block", "if", [["get", "noMatchesMessage", ["loc", [null, [65, 16], [65, 32]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [65, 6], [71, 6]]]]],
                locals: [],
                templates: [child0]
              };
            })();
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 62,
                    "column": 4
                  },
                  "end": {
                    "line": 72,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                dom.insertBoundary(fragment, null);
                return morphs;
              },
              statements: [["block", "if", [["subexpr", "hasBlock", ["inverse"], [], ["loc", [null, [63, 12], [63, 32]]], 0, 0]], [], 0, 1, ["loc", [null, [63, 6], [71, 13]]]]],
              locals: [],
              templates: [child0, child1]
            };
          })();
          var child1 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 73,
                      "column": 6
                    },
                    "end": {
                      "line": 83,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
                },
                isEmpty: false,
                arity: 2,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("          ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                  return morphs;
                },
                statements: [["inline", "yield", [["get", "option", ["loc", [null, [82, 18], [82, 24]]], 0, 0, 0, 0], ["get", "term", ["loc", [null, [82, 25], [82, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [82, 10], [82, 31]]], 0, 0]],
                locals: ["option", "term"],
                templates: []
              };
            })();
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 72,
                    "column": 4
                  },
                  "end": {
                    "line": 84,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("    ");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                return morphs;
              },
              statements: [["block", "component", [["get", "optionsComponent", ["loc", [null, [73, 19], [73, 35]]], 0, 0, 0, 0]], ["class", "ember-power-select-options md-autocomplete-suggestions", "groupIndex", "", "loadingMessage", ["subexpr", "readonly", [["get", "loadingMessage", ["loc", [null, [76, 33], [76, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [76, 23], [76, 48]]], 0, 0], "id", ["subexpr", "readonly", [["get", "optionsId", ["loc", [null, [77, 21], [77, 30]]], 0, 0, 0, 0]], [], ["loc", [null, [77, 11], [77, 31]]], 0, 0], "options", ["subexpr", "readonly", [["get", "virtualItems", ["loc", [null, [78, 26], [78, 38]]], 0, 0, 0, 0]], [], ["loc", [null, [78, 16], [78, 39]]], 0, 0], "optionsComponent", ["subexpr", "readonly", [["get", "optionsComponent", ["loc", [null, [79, 35], [79, 51]]], 0, 0, 0, 0]], [], ["loc", [null, [79, 25], [79, 52]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [80, 25], [80, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [80, 15], [80, 35]]], 0, 0]], 0, null, ["loc", [null, [73, 6], [83, 20]]]]],
              locals: [],
              templates: [child0]
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 62,
                  "column": 4
                },
                "end": {
                  "line": 84,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "if", [["get", "mustShowNoMessages", ["loc", [null, [62, 14], [62, 32]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [62, 4], [84, 4]]]]],
            locals: [],
            templates: [child0, child1]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 53,
                "column": 2
              },
              "end": {
                "line": 85,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "if", [["get", "mustShowSearchMessage", ["loc", [null, [57, 10], [57, 31]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [57, 4], [84, 11]]]]],
          locals: ["virtualItems"],
          templates: [child0, child1]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 86,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "dropdown.trigger", [], ["ariaDescribedBy", ["subexpr", "readonly", [["get", "ariaDescribedBy", ["loc", [null, [15, 30], [15, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 20], [15, 46]]], 0, 0], "ariaInvalid", ["subexpr", "readonly", [["get", "ariaInvalid", ["loc", [null, [16, 26], [16, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 16], [16, 38]]], 0, 0], "ariaLabel", ["subexpr", "readonly", [["get", "ariaLabel", ["loc", [null, [17, 24], [17, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 14], [17, 34]]], 0, 0], "ariaLabelledBy", ["subexpr", "readonly", [["get", "ariaLabelledBy", ["loc", [null, [18, 29], [18, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 19], [18, 44]]], 0, 0], "ariaRequired", ["subexpr", "readonly", [["get", "required", ["loc", [null, [19, 27], [19, 35]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 17], [19, 36]]], 0, 0], "class", ["subexpr", "readonly", [["get", "concatenatedTriggerClasses", ["loc", [null, [20, 20], [20, 46]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 10], [20, 47]]], 0, 0], "onKeydown", ["subexpr", "action", ["onTriggerKeydown"], [], ["loc", [null, [21, 14], [21, 41]]], 0, 0], "onFocus", ["subexpr", "action", ["onTriggerFocus"], [], ["loc", [null, [22, 12], [22, 37]]], 0, 0], "onBlur", ["subexpr", "action", ["deactivate"], [], ["loc", [null, [23, 11], [23, 32]]], 0, 0], "tabindex", ["subexpr", "readonly", [["get", "tabindex", ["loc", [null, [24, 23], [24, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 13], [24, 32]]], 0, 0], "disabledProxy", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [25, 18], [25, 26]]], 0, 0, 0, 0]], [], [], 0, 0], "label", ["subexpr", "@mut", [["get", "label", ["loc", [null, [26, 10], [26, 15]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [14, 2], [51, 23]]]], ["block", "dropdown.content", [], ["class", ["subexpr", "readonly", [["get", "concatenatedDropdownClasses", ["loc", [null, [54, 20], [54, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [54, 10], [54, 48]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [55, 21], [55, 30]]], 0, 0, 0, 0]], [], ["loc", [null, [55, 11], [55, 31]]], 0, 0], "to", ["subexpr", "readonly", [["get", "destination", ["loc", [null, [56, 17], [56, 28]]], 0, 0, 0, 0]], [], ["loc", [null, [56, 7], [56, 29]]], 0, 0]], 1, null, ["loc", [null, [53, 2], [85, 23]]]]],
        locals: ["dropdown"],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 87,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-autocomplete.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "paper-autocomplete-dropdown", [], ["horizontalPosition", ["subexpr", "readonly", [["get", "horizontalPosition", ["loc", [null, [2, 31], [2, 49]]], 0, 0, 0, 0]], [], ["loc", [null, [2, 21], [2, 50]]], 0, 0], "initiallyOpened", ["subexpr", "readonly", [["get", "initiallyOpened", ["loc", [null, [3, 28], [3, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 18], [3, 44]]], 0, 0], "matchTriggerWidth", ["subexpr", "readonly", [["get", "matchTriggerWidth", ["loc", [null, [4, 30], [4, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [4, 20], [4, 48]]], 0, 0], "onClose", ["subexpr", "action", ["onClose"], [], ["loc", [null, [5, 10], [5, 28]]], 0, 0], "onOpen", ["subexpr", "action", ["onOpen"], [], ["loc", [null, [6, 9], [6, 26]]], 0, 0], "registerAPI", ["subexpr", "action", ["registerAPI"], [], ["loc", [null, [7, 14], [7, 36]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [8, 26], [8, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 16], [8, 40]]], 0, 0], "verticalPosition", ["subexpr", "readonly", [["get", "verticalPosition", ["loc", [null, [9, 29], [9, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 19], [9, 46]]], 0, 0], "disabled", ["subexpr", "readonly", [["get", "disabled", ["loc", [null, [10, 21], [10, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 11], [10, 30]]], 0, 0], "contentComponent", ["subexpr", "readonly", [["get", "contentComponent", ["loc", [null, [11, 29], [11, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 19], [11, 46]]], 0, 0]], 0, null, ["loc", [null, [1, 0], [86, 32]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-button.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [2, 2], [2, 11]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-button.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "label", ["loc", [null, [4, 2], [4, 11]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-button.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [1, 6], [1, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [5, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-card-actions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card-actions.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["icons", ["subexpr", "component", ["paper-card-icon-actions"], [], ["loc", [null, [2, 8], [2, 45]]], 0, 0]], ["loc", [null, [1, 8], [3, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [3, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-card-header-text", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card-header-text.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["title", ["subexpr", "component", ["paper-card-header-title"], [], ["loc", [null, [2, 8], [2, 45]]], 0, 0], "subhead", ["subexpr", "component", ["paper-card-header-subhead"], [], ["loc", [null, [3, 10], [3, 49]]], 0, 0]], ["loc", [null, [1, 8], [4, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [4, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-card-header", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card-header.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["text", ["subexpr", "component", ["paper-card-header-text"], [], ["loc", [null, [2, 7], [2, 43]]], 0, 0], "avatar", ["subexpr", "component", ["paper-card-avatar"], [], ["loc", [null, [3, 9], [3, 40]]], 0, 0]], ["loc", [null, [1, 8], [4, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [4, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-card-media", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-card-media.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-media-", ["get", "size", ["loc", [null, [2, 25], [2, 29]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [3, 4], [3, 13]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-card-media.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createAttrMorph(element0, 'src');
          morphs[2] = dom.createAttrMorph(element0, 'alt');
          morphs[3] = dom.createAttrMorph(element0, 'title');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-media-", ["get", "size", ["loc", [null, [6, 25], [6, 29]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "src", ["get", "src", ["loc", [null, [6, 39], [6, 42]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "alt", ["get", "alt", ["loc", [null, [6, 51], [6, 54]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "title", ["get", "title", ["loc", [null, [6, 65], [6, 70]]], 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 7
          }
        },
        "moduleName": "workshop/templates/components/paper-card-media.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [1, 6], [1, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [7, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-card-title-media", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-card-title-media.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          morphs[1] = dom.createMorphAt(element1, 1, 1);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-media-", ["get", "size", ["loc", [null, [2, 25], [2, 29]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [3, 4], [3, 13]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-card-title-media.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createAttrMorph(element0, 'src');
          morphs[2] = dom.createAttrMorph(element0, 'alt');
          morphs[3] = dom.createAttrMorph(element0, 'title');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-media-", ["get", "size", ["loc", [null, [6, 25], [6, 29]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "src", ["get", "src", ["loc", [null, [6, 39], [6, 42]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "alt", ["get", "alt", ["loc", [null, [6, 51], [6, 54]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "title", ["get", "title", ["loc", [null, [6, 65], [6, 70]]], 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 7
          }
        },
        "moduleName": "workshop/templates/components/paper-card-title-media.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [1, 6], [1, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [7, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-card-title-text", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card-title-text.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["headline", ["subexpr", "component", ["paper-card-header-headline"], [], ["loc", [null, [2, 11], [2, 51]]], 0, 0], "subhead", ["subexpr", "component", ["paper-card-header-subhead"], [], ["loc", [null, [3, 10], [3, 49]]], 0, 0]], ["loc", [null, [1, 8], [4, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [4, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-card-title", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card-title.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["text", ["subexpr", "component", ["paper-card-title-text"], [], ["loc", [null, [2, 7], [2, 42]]], 0, 0], "media", ["subexpr", "component", ["paper-card-title-media"], [], ["loc", [null, [3, 8], [3, 44]]], 0, 0]], ["loc", [null, [1, 8], [4, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [4, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-card", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-card.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["title", ["subexpr", "component", ["paper-card-title"], [], ["loc", [null, [2, 8], [2, 38]]], 0, 0], "content", ["subexpr", "component", ["paper-card-content"], [], ["loc", [null, [3, 10], [3, 42]]], 0, 0], "actions", ["subexpr", "component", ["paper-card-actions"], [], ["loc", [null, [4, 10], [4, 42]]], 0, 0], "header", ["subexpr", "component", ["paper-card-header"], [], ["loc", [null, [5, 9], [5, 40]]], 0, 0], "image", ["subexpr", "component", ["paper-card-image"], [], ["loc", [null, [6, 8], [6, 38]]], 0, 0], "media", ["subexpr", "component", ["paper-card-media"], [], ["loc", [null, [7, 8], [7, 38]]], 0, 0]], ["loc", [null, [1, 8], [8, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [8, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-checkbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 0
            },
            "end": {
              "line": 10,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-checkbox.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [7, 6], [7, 15]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 16,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-checkbox.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "label", ["loc", [null, [13, 6], [13, 15]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-checkbox.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-icon");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [4, 6], [4, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [4, 0], [16, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-dialog", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 9,
                  "column": 4
                },
                "end": {
                  "line": 17,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-dialog.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["content", "yield", ["loc", [null, [16, 6], [16, 15]]], 0, 0, 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 2
              },
              "end": {
                "line": 18,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-dialog.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "paper-dialog-inner", [], ["origin", ["subexpr", "@mut", [["get", "origin", ["loc", [null, [10, 13], [10, 19]]], 0, 0, 0, 0]], [], [], 0, 0], "defaultedParent", ["subexpr", "@mut", [["get", "defaultedParent", ["loc", [null, [11, 22], [11, 37]]], 0, 0, 0, 0]], [], [], 0, 0], "defaultedOpenFrom", ["subexpr", "@mut", [["get", "defaultedOpenFrom", ["loc", [null, [12, 24], [12, 41]]], 0, 0, 0, 0]], [], [], 0, 0], "defaultedCloseTo", ["subexpr", "@mut", [["get", "defaultedCloseTo", ["loc", [null, [13, 23], [13, 39]]], 0, 0, 0, 0]], [], [], 0, 0], "fullscreen", ["subexpr", "@mut", [["get", "fullscreen", ["loc", [null, [14, 17], [14, 27]]], 0, 0, 0, 0]], [], [], 0, 0], "focusOnOpen", ["subexpr", "@mut", [["get", "focusOnOpen", ["loc", [null, [15, 18], [15, 29]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [9, 4], [17, 27]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 19,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-dialog.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["inline", "paper-backdrop", [], ["locked-open", ["subexpr", "@mut", [["get", "isLockedOpen", ["loc", [null, [3, 16], [3, 28]]], 0, 0, 0, 0]], [], [], 0, 0], "opaque", true, "fixed", ["subexpr", "unless", [["get", "parent", ["loc", [null, [5, 18], [5, 24]]], 0, 0, 0, 0], true], [], ["loc", [null, [5, 10], [5, 30]]], 0, 0], "class", "md-dialog-backdrop", "onClick", ["subexpr", "action", ["outsideClicked"], [], ["loc", [null, [7, 12], [7, 37]]], 0, 0]], ["loc", [null, [2, 2], [7, 39]]], 0, 0], ["block", "paper-dialog-container", [], ["outsideClicked", ["subexpr", "action", ["outsideClicked"], [], ["loc", [null, [8, 43], [8, 68]]], 0, 0]], 0, null, ["loc", [null, [8, 2], [18, 29]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-dialog.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "ember-wormhole", [], ["to", ["subexpr", "@mut", [["get", "destinationId", ["loc", [null, [1, 21], [1, 34]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [1, 0], [19, 19]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["isValid", ["get", "isValid", ["loc", [null, [2, 10], [2, 17]]], 0, 0, 0, 0], "isInvalid", ["get", "isInvalid", ["loc", [null, [3, 12], [3, 21]]], 0, 0, 0, 0], "input", ["subexpr", "component", ["paper-input"], ["parentComponent", ["subexpr", "@mut", [["get", "this", ["loc", [null, [5, 20], [5, 24]]], 0, 0, 0, 0]], [], [], 0, 0], "onValidityChange", ["subexpr", "action", ["onValidityChange"], [], ["loc", [null, [6, 21], [6, 48]]], 0, 0]], ["loc", [null, [4, 8], [7, 3]]], 0, 0], "select", ["subexpr", "component", ["paper-select"], ["parentComponent", ["subexpr", "@mut", [["get", "this", ["loc", [null, [9, 19], [9, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "onValidityChange", ["subexpr", "action", ["onValidityChange"], [], ["loc", [null, [10, 20], [10, 47]]], 0, 0]], ["loc", [null, [8, 9], [11, 3]]], 0, 0], "autocomplete", ["subexpr", "component", ["paper-autocomplete"], ["parentComponent", ["subexpr", "@mut", [["get", "this", ["loc", [null, [13, 19], [13, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "onValidityChange", ["subexpr", "action", ["onValidityChange"], [], ["loc", [null, [14, 20], [14, 47]]], 0, 0]], ["loc", [null, [12, 15], [15, 3]]], 0, 0], "onSubmit", ["subexpr", "action", ["onSubmit"], [], ["loc", [null, [16, 11], [16, 30]]], 0, 0]], ["loc", [null, [1, 8], [17, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [17, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-grid-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-grid-list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-grid-tile-footer", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-grid-tile-footer.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("figcaption");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [2, 2], [2, 11]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-grid-tile", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-grid-tile.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("figure");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [2, 2], [2, 11]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-icon", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 31
          }
        },
        "moduleName": "workshop/templates/components/paper-icon.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "-paper-underscore", [["get", "iconClass", ["loc", [null, [1, 20], [1, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [1, 0], [1, 31]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-input", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("label");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element3, 'for');
          morphs[1] = dom.createAttrMorph(element3, 'class');
          morphs[2] = dom.createMorphAt(element3, 0, 0);
          return morphs;
        },
        statements: [["attribute", "for", ["get", "inputElementId", ["loc", [null, [2, 15], [2, 29]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "required", ["loc", [null, [2, 44], [2, 52]]], 0, 0, 0, 0], "md-required"], [], ["loc", [null, [2, 39], [2, 68]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "label", ["loc", [null, [2, 70], [2, 79]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "paper-icon", [["get", "icon", ["loc", [null, [6, 15], [6, 19]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 2], [6, 21]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 34,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("textarea");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(22);
          morphs[0] = dom.createAttrMorph(element2, 'class');
          morphs[1] = dom.createAttrMorph(element2, 'id');
          morphs[2] = dom.createAttrMorph(element2, 'placeholder');
          morphs[3] = dom.createAttrMorph(element2, 'disabled');
          morphs[4] = dom.createAttrMorph(element2, 'autofocus');
          morphs[5] = dom.createAttrMorph(element2, 'onfocus');
          morphs[6] = dom.createAttrMorph(element2, 'onblur');
          morphs[7] = dom.createAttrMorph(element2, 'onkeydown');
          morphs[8] = dom.createAttrMorph(element2, 'oninput');
          morphs[9] = dom.createAttrMorph(element2, 'name');
          morphs[10] = dom.createAttrMorph(element2, 'rows');
          morphs[11] = dom.createAttrMorph(element2, 'cols');
          morphs[12] = dom.createAttrMorph(element2, 'maxlength');
          morphs[13] = dom.createAttrMorph(element2, 'tabindex');
          morphs[14] = dom.createAttrMorph(element2, 'required');
          morphs[15] = dom.createAttrMorph(element2, 'selectionEnd');
          morphs[16] = dom.createAttrMorph(element2, 'selectionStart');
          morphs[17] = dom.createAttrMorph(element2, 'selectionDirection');
          morphs[18] = dom.createAttrMorph(element2, 'wrap');
          morphs[19] = dom.createAttrMorph(element2, 'readonly');
          morphs[20] = dom.createAttrMorph(element2, 'form');
          morphs[21] = dom.createAttrMorph(element2, 'spellcheck');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-input ", ["subexpr", "if", [["get", "isInvalid", ["loc", [null, [11, 25], [11, 34]]], 0, 0, 0, 0], "ng-invalid"], [], ["loc", [null, [11, 20], [11, 49]]], 0, 0], " ", ["subexpr", "if", [["get", "isTouched", ["loc", [null, [11, 55], [11, 64]]], 0, 0, 0, 0], "ng-dirty"], [], ["loc", [null, [11, 50], [11, 77]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "id", ["get", "inputElementId", ["loc", [null, [12, 9], [12, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "placeholder", ["get", "placeholder", ["loc", [null, [13, 18], [13, 29]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["get", "disabled", ["loc", [null, [14, 15], [14, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "autofocus", ["get", "autofocus", ["loc", [null, [15, 16], [15, 25]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onfocus", ["get", "onFocus", ["loc", [null, [16, 14], [16, 21]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onblur", ["subexpr", "action", ["handleBlur"], [], ["loc", [null, [null, null], [17, 34]]], 0, 0], 0, 0, 0, 0], ["attribute", "onkeydown", ["get", "onKeyDown", ["loc", [null, [18, 16], [18, 25]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "oninput", ["subexpr", "action", ["handleInput"], [], ["loc", [null, [null, null], [19, 36]]], 0, 0], 0, 0, 0, 0], ["attribute", "name", ["get", "passThru.name", ["loc", [null, [21, 11], [21, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "rows", ["get", "passThru.rows", ["loc", [null, [22, 11], [22, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "cols", ["get", "passThru.cols", ["loc", [null, [23, 11], [23, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "maxlength", ["get", "passThru.maxlength", ["loc", [null, [24, 16], [24, 34]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "tabindex", ["get", "passThru.tabindex", ["loc", [null, [25, 15], [25, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "required", ["get", "passThru.required", ["loc", [null, [26, 15], [26, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selectionEnd", ["get", "passThru.selectionEnd", ["loc", [null, [27, 19], [27, 40]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selectionStart", ["get", "passThru.selectionStart", ["loc", [null, [28, 21], [28, 44]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selectionDirection", ["get", "passThru.selectionDirection", ["loc", [null, [29, 25], [29, 52]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "wrap", ["get", "passThru.wrap", ["loc", [null, [30, 11], [30, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "readonly", ["get", "passThru.readonly", ["loc", [null, [31, 15], [31, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "form", ["get", "passThru.form", ["loc", [null, [32, 11], [32, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "spellcheck", ["get", "passThru.spellcheck", ["loc", [null, [33, 17], [33, 36]]], 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 34,
              "column": 0
            },
            "end": {
              "line": 72,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("input");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(35);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          morphs[1] = dom.createAttrMorph(element1, 'id');
          morphs[2] = dom.createAttrMorph(element1, 'placeholder');
          morphs[3] = dom.createAttrMorph(element1, 'type');
          morphs[4] = dom.createAttrMorph(element1, 'disabled');
          morphs[5] = dom.createAttrMorph(element1, 'autofocus');
          morphs[6] = dom.createAttrMorph(element1, 'onfocus');
          morphs[7] = dom.createAttrMorph(element1, 'onblur');
          morphs[8] = dom.createAttrMorph(element1, 'onkeydown');
          morphs[9] = dom.createAttrMorph(element1, 'oninput');
          morphs[10] = dom.createAttrMorph(element1, 'accept');
          morphs[11] = dom.createAttrMorph(element1, 'autocomplete');
          morphs[12] = dom.createAttrMorph(element1, 'autosave');
          morphs[13] = dom.createAttrMorph(element1, 'form');
          morphs[14] = dom.createAttrMorph(element1, 'formaction');
          morphs[15] = dom.createAttrMorph(element1, 'formenctype');
          morphs[16] = dom.createAttrMorph(element1, 'formmethod');
          morphs[17] = dom.createAttrMorph(element1, 'formnovalidate');
          morphs[18] = dom.createAttrMorph(element1, 'formtarget');
          morphs[19] = dom.createAttrMorph(element1, 'height');
          morphs[20] = dom.createAttrMorph(element1, 'inputmode');
          morphs[21] = dom.createAttrMorph(element1, 'min');
          morphs[22] = dom.createAttrMorph(element1, 'maxlength');
          morphs[23] = dom.createAttrMorph(element1, 'max');
          morphs[24] = dom.createAttrMorph(element1, 'multiple');
          morphs[25] = dom.createAttrMorph(element1, 'name');
          morphs[26] = dom.createAttrMorph(element1, 'pattern');
          morphs[27] = dom.createAttrMorph(element1, 'readonly');
          morphs[28] = dom.createAttrMorph(element1, 'required');
          morphs[29] = dom.createAttrMorph(element1, 'selectionDirection');
          morphs[30] = dom.createAttrMorph(element1, 'size');
          morphs[31] = dom.createAttrMorph(element1, 'spellcheck');
          morphs[32] = dom.createAttrMorph(element1, 'step');
          morphs[33] = dom.createAttrMorph(element1, 'tabindex');
          morphs[34] = dom.createAttrMorph(element1, 'width');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["md-input ", ["subexpr", "if", [["get", "isInvalid", ["loc", [null, [36, 25], [36, 34]]], 0, 0, 0, 0], "ng-invalid"], [], ["loc", [null, [36, 20], [36, 49]]], 0, 0], "  ", ["subexpr", "if", [["get", "isTouched", ["loc", [null, [36, 56], [36, 65]]], 0, 0, 0, 0], "ng-dirty"], [], ["loc", [null, [36, 51], [36, 78]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "id", ["get", "inputElementId", ["loc", [null, [37, 9], [37, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "placeholder", ["get", "placeholder", ["loc", [null, [38, 18], [38, 29]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "type", ["get", "type", ["loc", [null, [39, 11], [39, 15]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "disabled", ["get", "disabled", ["loc", [null, [40, 15], [40, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "autofocus", ["get", "autofocus", ["loc", [null, [41, 16], [41, 25]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onfocus", ["get", "onFocus", ["loc", [null, [42, 14], [42, 21]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onblur", ["subexpr", "action", ["handleBlur"], [], ["loc", [null, [null, null], [43, 34]]], 0, 0], 0, 0, 0, 0], ["attribute", "onkeydown", ["get", "onKeyDown", ["loc", [null, [44, 16], [44, 25]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "oninput", ["subexpr", "action", ["handleInput"], [], ["loc", [null, [null, null], [45, 36]]], 0, 0], 0, 0, 0, 0], ["attribute", "accept", ["get", "passThru.accept", ["loc", [null, [47, 13], [47, 28]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "autocomplete", ["get", "passThru.autocomplete", ["loc", [null, [48, 19], [48, 40]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "autosave", ["get", "passThru.autosave", ["loc", [null, [49, 15], [49, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "form", ["get", "passThru.form", ["loc", [null, [50, 11], [50, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "formaction", ["get", "passThru.formaction", ["loc", [null, [51, 17], [51, 36]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "formenctype", ["get", "passThru.formenctype", ["loc", [null, [52, 18], [52, 38]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "formmethod", ["get", "passThru.formmethod", ["loc", [null, [53, 17], [53, 36]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "formnovalidate", ["get", "passThru.formnovalidate", ["loc", [null, [54, 21], [54, 44]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "formtarget", ["get", "passThru.formtarget", ["loc", [null, [55, 17], [55, 36]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "height", ["get", "passThru.height", ["loc", [null, [56, 13], [56, 28]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "inputmode", ["get", "passThru.inputmode", ["loc", [null, [57, 16], [57, 34]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "min", ["get", "passThru.min", ["loc", [null, [58, 10], [58, 22]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "maxlength", ["get", "passThru.maxlength", ["loc", [null, [59, 16], [59, 34]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "max", ["get", "passThru.max", ["loc", [null, [60, 10], [60, 22]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "multiple", ["get", "passThru.multiple", ["loc", [null, [61, 15], [61, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "name", ["get", "passThru.name", ["loc", [null, [62, 11], [62, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "pattern", ["get", "passThru.pattern", ["loc", [null, [63, 14], [63, 30]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "readonly", ["get", "passThru.readonly", ["loc", [null, [64, 15], [64, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "required", ["get", "passThru.required", ["loc", [null, [65, 15], [65, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selectionDirection", ["get", "passThru.selectionDirection", ["loc", [null, [66, 25], [66, 52]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "size", ["get", "passThru.size", ["loc", [null, [67, 11], [67, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "spellcheck", ["get", "passThru.spellcheck", ["loc", [null, [68, 17], [68, 36]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "step", ["get", "passThru.step", ["loc", [null, [69, 11], [69, 24]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "tabindex", ["get", "passThru.tabindex", ["loc", [null, [70, 15], [70, 32]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "width", ["get", "passThru.width", ["loc", [null, [71, 12], [71, 26]]], 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 76,
                "column": 4
              },
              "end": {
                "line": 78,
                "column": 4
              }
            },
            "moduleName": "workshop/templates/components/paper-input.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "md-char-counter");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["content", "renderCharCount", ["loc", [null, [77, 35], [77, 54]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 82,
                  "column": 6
                },
                "end": {
                  "line": 87,
                  "column": 6
                }
              },
              "moduleName": "workshop/templates/components/paper-input.hbs"
            },
            isEmpty: false,
            arity: 2,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "paper-input-error ng-enter ng-enter-active");
              dom.setAttribute(el1, "ng-message", "");
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element0 = dom.childAt(fragment, [1]);
              var morphs = new Array(2);
              morphs[0] = dom.createAttrMorph(element0, 'id');
              morphs[1] = dom.createMorphAt(element0, 1, 1);
              return morphs;
            },
            statements: [["attribute", "id", ["concat", ["error-", ["get", "inputElementId", ["loc", [null, [83, 25], [83, 39]]], 0, 0, 0, 0], "-", ["get", "index", ["loc", [null, [83, 44], [83, 49]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "error.message", ["loc", [null, [85, 10], [85, 27]]], 0, 0, 0, 0]],
            locals: ["error", "index"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 80,
                "column": 2
              },
              "end": {
                "line": 89,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-input.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "md-input-messages-animation md-auto-hide");
            dom.setAttribute(el1, "ng-messages", "");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["block", "each", [["get", "validationErrorMessages", ["loc", [null, [82, 14], [82, 37]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [82, 6], [87, 15]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 74,
              "column": 0
            },
            "end": {
              "line": 90,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-errors-spacer");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "maxlength", ["loc", [null, [76, 10], [76, 19]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [76, 4], [78, 11]]]], ["block", "if", [["get", "isInvalidAndTouched", ["loc", [null, [80, 8], [80, 27]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [80, 2], [89, 9]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 92,
              "column": 0
            },
            "end": {
              "line": 94,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-input.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "paper-icon", [["get", "iconRight", ["loc", [null, [93, 15], [93, 24]]], 0, 0, 0, 0]], [], ["loc", [null, [93, 2], [93, 26]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 95,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-input.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        morphs[3] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "label", ["loc", [null, [1, 6], [1, 11]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["block", "if", [["get", "icon", ["loc", [null, [5, 6], [5, 10]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [5, 0], [7, 7]]]], ["block", "if", [["get", "textarea", ["loc", [null, [9, 6], [9, 14]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [9, 0], [72, 7]]]], ["block", "unless", [["get", "hideAllMessages", ["loc", [null, [74, 10], [74, 25]]], 0, 0, 0, 0]], [], 4, null, ["loc", [null, [74, 0], [90, 11]]]], ["block", "if", [["get", "iconRight", ["loc", [null, [92, 6], [92, 15]]], 0, 0, 0, 0]], [], 5, null, ["loc", [null, [92, 0], [94, 7]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  })());
});
define("workshop/templates/components/paper-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-no-style md-list-item-inner");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [2, 0], [2, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-menu-content-inner", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 95
          }
        },
        "moduleName": "workshop/templates/components/paper-menu-content-inner.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["menu-item", ["subexpr", "component", ["paper-menu-item"], ["dropdown", ["subexpr", "@mut", [["get", "dropdown", ["loc", [null, [1, 62], [1, 70]]], 0, 0, 0, 0]], [], [], 0, 0], "parentComponent", ["subexpr", "@mut", [["get", "this", ["loc", [null, [1, 87], [1, 91]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [1, 24], [1, 92]]], 0, 0]], ["loc", [null, [1, 8], [1, 93]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 95]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-menu-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 15,
                  "column": 6
                },
                "end": {
                  "line": 17,
                  "column": 6
                }
              },
              "moduleName": "workshop/templates/components/paper-menu-content.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "innerContentHash", ["loc", [null, [16, 16], [16, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 8], [16, 34]]], 0, 0]],
            locals: ["innerContentHash"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 19,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-menu-content.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [3]);
            var morphs = new Array(6);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createAttrMorph(element0, 'id');
            morphs[2] = dom.createAttrMorph(element0, 'class');
            morphs[3] = dom.createAttrMorph(element0, 'style');
            morphs[4] = dom.createAttrMorph(element0, 'dir');
            morphs[5] = dom.createMorphAt(element0, 1, 1);
            return morphs;
          },
          statements: [["inline", "paper-backdrop", [], ["class", "md-menu-backdrop md-click-catcher"], ["loc", [null, [8, 4], [8, 64]]], 0, 0], ["attribute", "id", ["get", "dropdownId", ["loc", [null, [10, 11], [10, 21]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "class", ["concat", ["ember-basic-dropdown-content ", ["get", "class", ["loc", [null, [11, 44], [11, 49]]], 0, 0, 0, 0], " ", ["subexpr", "if", [["get", "renderInPlace", ["loc", [null, [11, 57], [11, 70]]], 0, 0, 0, 0], "ember-basic-dropdown-content--in-place"], [], ["loc", [null, [11, 52], [11, 113]]], 0, 0], " ", ["subexpr", "if", [["get", "hPosition", ["loc", [null, [11, 119], [11, 128]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "hPosition", ["loc", [null, [11, 170], [11, 179]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 129], [11, 180]]], 0, 0]], [], ["loc", [null, [11, 114], [11, 182]]], 0, 0], " ", ["subexpr", "if", [["get", "vPosition", ["loc", [null, [11, 188], [11, 197]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "vPosition", ["loc", [null, [11, 239], [11, 248]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 198], [11, 249]]], 0, 0]], [], ["loc", [null, [11, 183], [11, 251]]], 0, 0], "\n      md-open-menu-container md-whiteframe-z2 md-clickable ", ["subexpr", "if", [["get", "isActive", ["loc", [null, [12, 64], [12, 72]]], 0, 0, 0, 0], "md-active"], [], ["loc", [null, [12, 59], [12, 86]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "style", ["loc", [null, [13, 14], [13, 19]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "dir", ["get", "dir", ["loc", [null, [14, 12], [14, 15]]], 0, 0, 0, 0], 0, 0, 0, 0], ["block", "paper-menu-content-inner", [], ["width", ["subexpr", "@mut", [["get", "width", ["loc", [null, [15, 40], [15, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "dense", ["subexpr", "@mut", [["get", "dense", ["loc", [null, [15, 52], [15, 57]]], 0, 0, 0, 0]], [], [], 0, 0], "dropdown", ["subexpr", "@mut", [["get", "dropdown", ["loc", [null, [15, 67], [15, 75]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [15, 6], [17, 35]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 20,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-menu-content.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "ember-wormhole", [], ["to", ["subexpr", "@mut", [["get", "to", ["loc", [null, [2, 23], [2, 25]]], 0, 0, 0, 0]], [], [], 0, 0], "renderInPlace", ["subexpr", "@mut", [["get", "renderInPlace", ["loc", [null, [2, 40], [2, 53]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [2, 2], [19, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-menu-content.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "dropdown.isOpen", ["loc", [null, [1, 6], [1, 21]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [20, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-menu-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 4,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-menu-item.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "yield", ["loc", [null, [3, 4], [3, 13]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-menu-item.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-button", [], ["onClick", "handleClick", "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [2, 49], [2, 57]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [2, 2], [4, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-menu-item.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [6, 2], [6, 11]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-menu-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "onClick", ["loc", [null, [1, 6], [1, 13]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [7, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-menu", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-menu.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["isOpen", ["get", "publicAPI.isOpen", ["loc", [null, [2, 9], [2, 25]]], 0, 0, 0, 0], "disabled", ["get", "publicAPI.disabled", ["loc", [null, [3, 11], [3, 29]]], 0, 0, 0, 0], "actions", ["get", "publicAPI.actions", ["loc", [null, [4, 10], [4, 27]]], 0, 0, 0, 0], "trigger", ["subexpr", "component", [["get", "triggerComponent", ["loc", [null, [5, 21], [5, 37]]], 0, 0, 0, 0]], ["tagName", "md-menu", "dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [7, 23], [7, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 13], [7, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [8, 24], [8, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 14], [8, 34]]], 0, 0], "onFocus", ["subexpr", "action", ["handleFocus"], [], ["loc", [null, [9, 12], [9, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [10, 28], [10, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 18], [10, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [11, 24], [11, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 14], [11, 34]]], 0, 0]], ["loc", [null, [5, 10], [12, 3]]], 0, 0], "content", ["subexpr", "component", ["paper-menu-content"], ["dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [14, 23], [14, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [14, 13], [14, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [15, 24], [15, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 14], [15, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [16, 28], [16, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 18], [16, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [17, 24], [17, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 14], [17, 34]]], 0, 0], "top", ["subexpr", "readonly", [["get", "top", ["loc", [null, [18, 18], [18, 21]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 8], [18, 22]]], 0, 0], "left", ["subexpr", "readonly", [["get", "left", ["loc", [null, [19, 19], [19, 23]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 9], [19, 24]]], 0, 0], "right", ["subexpr", "readonly", [["get", "right", ["loc", [null, [20, 20], [20, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 10], [20, 26]]], 0, 0], "width", ["subexpr", "readonly", [["get", "width", ["loc", [null, [21, 20], [21, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [21, 10], [21, 26]]], 0, 0], "transform", ["subexpr", "@mut", [["get", "transform", ["loc", [null, [22, 14], [22, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "transformOrigin", ["subexpr", "@mut", [["get", "transformOrigin", ["loc", [null, [23, 20], [23, 35]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [13, 10], [24, 3]]], 0, 0]], ["loc", [null, [1, 8], [25, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [25, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-nav-container", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 14
          }
        },
        "moduleName": "workshop/templates/components/paper-nav-container.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["get", "this", ["loc", [null, [1, 8], [1, 12]]], 0, 0, 0, 0]], [], ["loc", [null, [1, 0], [1, 14]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-optgroup", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 9
          }
        },
        "moduleName": "workshop/templates/components/paper-optgroup.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("label");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 0, 0);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "label", ["loc", [null, [1, 7], [1, 16]]], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [2, 0], [2, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-option", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 36
          }
        },
        "moduleName": "workshop/templates/components/paper-option.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-text");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 0, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 21], [1, 30]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-progress-circular", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 6
          }
        },
        "moduleName": "workshop/templates/components/paper-progress-circular.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-spinner-wrapper");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-inner ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "md-gap");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "md-left");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "md-half-circle");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "md-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "md-half-circle");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3, 1]);
        var element4 = dom.childAt(element1, [5, 1]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createAttrMorph(element0, 'style');
        morphs[2] = dom.createAttrMorph(element2, 'style');
        morphs[3] = dom.createAttrMorph(element3, 'style');
        morphs[4] = dom.createAttrMorph(element4, 'style');
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["md-scale-wrapper ", ["get", "spinnerClass", ["loc", [null, [1, 31], [1, 43]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "scaleWrapperStyle", ["loc", [null, [1, 55], [1, 72]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "gapStyle", ["loc", [null, [4, 34], [4, 42]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "leftStyle", ["loc", [null, [6, 44], [6, 53]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "rightStyle", ["loc", [null, [9, 44], [9, 54]]], 0, 0, 0, 0], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-progress-linear", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-progress-linear.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-dashed");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-bar md-bar1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-bar md-bar2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element0, [5]);
        var morphs = new Array(3);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createAttrMorph(element1, 'style');
        morphs[2] = dom.createAttrMorph(element2, 'style');
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["md-container ", ["get", "queryModeClass", ["loc", [null, [1, 27], [1, 41]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "bar1Style", ["loc", [null, [3, 38], [3, 47]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "bar2Style", ["loc", [null, [4, 38], [4, 47]]], 0, 0, 0, 0], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-radio-group", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-radio-group.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["radio", ["subexpr", "component", ["paper-radio"], ["toggle", ["subexpr", "@mut", [["get", "toggle", ["loc", [null, [3, 11], [3, 17]]], 0, 0, 0, 0]], [], [], 0, 0], "disabled", ["subexpr", "@mut", [["get", "disabled", ["loc", [null, [4, 13], [4, 21]]], 0, 0, 0, 0]], [], [], 0, 0], "groupValue", ["subexpr", "@mut", [["get", "groupValue", ["loc", [null, [5, 15], [5, 25]]], 0, 0, 0, 0]], [], [], 0, 0], "onChange", ["subexpr", "action", ["onChange"], [], ["loc", [null, [6, 13], [6, 32]]], 0, 0], "parentComponent", ["subexpr", "@mut", [["get", "this", ["loc", [null, [7, 20], [7, 24]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [2, 10], [7, 25]]], 0, 0]], ["loc", [null, [1, 8], [8, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [8, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-radio", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-radio.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [8, 6], [8, 15]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 0
            },
            "end": {
              "line": 17,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-radio.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["content", "label", ["loc", [null, [14, 6], [14, 15]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-radio.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-off");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-on");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "hasBlock", ["loc", [null, [5, 6], [5, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [5, 0], [17, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-select-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 15,
                  "column": 6
                },
                "end": {
                  "line": 17,
                  "column": 6
                }
              },
              "moduleName": "workshop/templates/components/paper-select-content.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "innerContentHash", ["loc", [null, [16, 16], [16, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 8], [16, 34]]], 0, 0]],
            locals: ["innerContentHash"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 19,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-content.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [3]);
            var morphs = new Array(6);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createAttrMorph(element0, 'id');
            morphs[2] = dom.createAttrMorph(element0, 'class');
            morphs[3] = dom.createAttrMorph(element0, 'style');
            morphs[4] = dom.createAttrMorph(element0, 'dir');
            morphs[5] = dom.createMorphAt(element0, 1, 1);
            return morphs;
          },
          statements: [["inline", "paper-backdrop", [], ["class", "md-select-backdrop md-click-catcher"], ["loc", [null, [8, 4], [8, 66]]], 0, 0], ["attribute", "id", ["get", "dropdownId", ["loc", [null, [10, 11], [10, 21]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "class", ["concat", ["ember-basic-dropdown-content ", ["get", "class", ["loc", [null, [11, 44], [11, 49]]], 0, 0, 0, 0], " ", ["subexpr", "if", [["get", "renderInPlace", ["loc", [null, [11, 57], [11, 70]]], 0, 0, 0, 0], "ember-basic-dropdown-content--in-place"], [], ["loc", [null, [11, 52], [11, 113]]], 0, 0], " ", ["subexpr", "if", [["get", "hPosition", ["loc", [null, [11, 119], [11, 128]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "hPosition", ["loc", [null, [11, 170], [11, 179]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 129], [11, 180]]], 0, 0]], [], ["loc", [null, [11, 114], [11, 182]]], 0, 0], " ", ["subexpr", "if", [["get", "vPosition", ["loc", [null, [11, 188], [11, 197]]], 0, 0, 0, 0], ["subexpr", "concat", ["ember-basic-dropdown-content--", ["get", "vPosition", ["loc", [null, [11, 239], [11, 248]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 198], [11, 249]]], 0, 0]], [], ["loc", [null, [11, 183], [11, 251]]], 0, 0], "\n      md-select-menu-container md-clickable ", ["subexpr", "if", [["get", "isActive", ["loc", [null, [12, 49], [12, 57]]], 0, 0, 0, 0], "md-active"], [], ["loc", [null, [12, 44], [12, 71]]], 0, 0], " ", ["subexpr", "unless", [["get", "isActive", ["loc", [null, [12, 81], [12, 89]]], 0, 0, 0, 0], "md-leave"], [], ["loc", [null, [12, 72], [12, 102]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "style", ["loc", [null, [13, 14], [13, 19]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "dir", ["get", "dir", ["loc", [null, [14, 12], [14, 15]]], 0, 0, 0, 0], 0, 0, 0, 0], ["block", "paper-select-menu-inner", [], ["width", ["subexpr", "@mut", [["get", "width", ["loc", [null, [15, 39], [15, 44]]], 0, 0, 0, 0]], [], [], 0, 0], "dense", ["subexpr", "@mut", [["get", "dense", ["loc", [null, [15, 51], [15, 56]]], 0, 0, 0, 0]], [], [], 0, 0], "dropdown", ["subexpr", "@mut", [["get", "dropdown", ["loc", [null, [15, 66], [15, 74]]], 0, 0, 0, 0]], [], [], 0, 0], "searchEnabled", ["subexpr", "@mut", [["get", "searchEnabled", ["loc", [null, [15, 89], [15, 102]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [15, 6], [17, 34]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 20,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-content.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "ember-wormhole", [], ["to", ["subexpr", "@mut", [["get", "to", ["loc", [null, [2, 23], [2, 25]]], 0, 0, 0, 0]], [], [], 0, 0], "renderInPlace", ["subexpr", "@mut", [["get", "renderInPlace", ["loc", [null, [2, 40], [2, 53]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [2, 2], [19, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-select-content.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "dropdown.isOpen", ["loc", [null, [1, 6], [1, 21]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [20, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-select-header", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-select-header.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-select-menu-inner", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-menu-inner.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("md-content");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["inline", "yield", [["subexpr", "hash", [], ["menu", ["get", "this", ["loc", [null, [3, 21], [3, 25]]], 0, 0, 0, 0]], ["loc", [null, [3, 10], [3, 26]]], 0, 0]], [], ["loc", [null, [3, 2], [3, 28]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-menu-inner.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "yield", [["subexpr", "hash", [], ["menu", ["get", "this", ["loc", [null, [6, 20], [6, 24]]], 0, 0, 0, 0]], ["loc", [null, [6, 9], [6, 25]]], 0, 0]], [], ["loc", [null, [6, 1], [6, 27]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 7
          }
        },
        "moduleName": "workshop/templates/components/paper-select-menu-inner.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "searchEnabled", ["loc", [null, [1, 6], [1, 19]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [7, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-select-menu", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 3
          }
        },
        "moduleName": "workshop/templates/components/paper-select-menu.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["isOpen", ["get", "publicAPI.isOpen", ["loc", [null, [2, 9], [2, 25]]], 0, 0, 0, 0], "disabled", ["get", "publicAPI.disabled", ["loc", [null, [3, 11], [3, 29]]], 0, 0, 0, 0], "actions", ["get", "publicAPI.actions", ["loc", [null, [4, 10], [4, 27]]], 0, 0, 0, 0], "trigger", ["subexpr", "component", [["get", "triggerComponent", ["loc", [null, [5, 21], [5, 37]]], 0, 0, 0, 0]], ["disabled", ["subexpr", "@mut", [["get", "publicAPI.disabled", ["loc", [null, [6, 13], [6, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [7, 23], [7, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 13], [7, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [8, 24], [8, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 14], [8, 34]]], 0, 0], "onFocus", ["subexpr", "action", ["handleFocus"], [], ["loc", [null, [9, 12], [9, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [10, 28], [10, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 18], [10, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [11, 24], [11, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 14], [11, 34]]], 0, 0]], ["loc", [null, [5, 10], [12, 3]]], 0, 0], "content", ["subexpr", "component", ["paper-select-content"], ["dropdown", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [14, 23], [14, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [14, 13], [14, 33]]], 0, 0], "hPosition", ["subexpr", "readonly", [["get", "hPosition", ["loc", [null, [15, 24], [15, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 14], [15, 34]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [16, 28], [16, 41]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 18], [16, 42]]], 0, 0], "vPosition", ["subexpr", "readonly", [["get", "vPosition", ["loc", [null, [17, 24], [17, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 14], [17, 34]]], 0, 0], "top", ["subexpr", "readonly", [["get", "top", ["loc", [null, [18, 18], [18, 21]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 8], [18, 22]]], 0, 0], "left", ["subexpr", "readonly", [["get", "left", ["loc", [null, [19, 19], [19, 23]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 9], [19, 24]]], 0, 0], "right", ["subexpr", "readonly", [["get", "right", ["loc", [null, [20, 20], [20, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 10], [20, 26]]], 0, 0], "width", ["subexpr", "readonly", [["get", "width", ["loc", [null, [21, 20], [21, 25]]], 0, 0, 0, 0]], [], ["loc", [null, [21, 10], [21, 26]]], 0, 0]], ["loc", [null, [13, 10], [22, 3]]], 0, 0]], ["loc", [null, [1, 8], [23, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [23, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-select-options", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 4,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-options.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("   ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "paper-progress-circular", ["loc", [null, [3, 3], [3, 30]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-options.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "loadingMessage", ["loc", [null, [2, 8], [2, 22]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [2, 2], [4, 9]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 10,
                  "column": 6
                },
                "end": {
                  "line": 19,
                  "column": 6
                }
              },
              "moduleName": "workshop/templates/components/paper-select-options.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "option", ["loc", [null, [18, 16], [18, 22]]], 0, 0, 0, 0], ["get", "select", ["loc", [null, [18, 23], [18, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 8], [18, 31]]], 0, 0]],
            locals: ["option"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 2
              },
              "end": {
                "line": 21,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-options.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("md-optgroup");
            dom.setAttribute(el1, "class", "ember-power-select-group");
            dom.setAttribute(el1, "role", "option");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("label");
            dom.setAttribute(el2, "class", "ember-power-select-group-name");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createAttrMorph(element0, 'aria-disabled');
            morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
            morphs[2] = dom.createMorphAt(element0, 3, 3);
            return morphs;
          },
          statements: [["attribute", "aria-disabled", ["subexpr", "ember-power-select-true-string-if-present", [["get", "opt.disabled", ["loc", [null, [8, 108], [8, 120]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [8, 122]]], 0, 0], 0, 0, 0, 0], ["content", "opt.groupName", ["loc", [null, [9, 51], [9, 68]]], 0, 0, 0, 0], ["block", "component", [["get", "optionsComponent", ["loc", [null, [10, 19], [10, 35]]], 0, 0, 0, 0]], ["options", ["subexpr", "readonly", [["get", "opt.options", ["loc", [null, [11, 26], [11, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 16], [11, 38]]], 0, 0], "select", ["subexpr", "readonly", [["get", "select", ["loc", [null, [12, 25], [12, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [12, 15], [12, 32]]], 0, 0], "groupIndex", ["subexpr", "concat", [["get", "groupIndex", ["loc", [null, [13, 27], [13, 37]]], 0, 0, 0, 0], ["get", "index", ["loc", [null, [13, 38], [13, 43]]], 0, 0, 0, 0], "."], [], ["loc", [null, [13, 19], [13, 48]]], 0, 0], "optionsComponent", ["subexpr", "readonly", [["get", "optionsComponent", ["loc", [null, [14, 35], [14, 51]]], 0, 0, 0, 0]], [], ["loc", [null, [14, 25], [14, 52]]], 0, 0], "menuParent", ["subexpr", "@mut", [["get", "menuParent", ["loc", [null, [15, 19], [15, 29]]], 0, 0, 0, 0]], [], [], 0, 0], "role", "group", "class", "ember-power-select-options"], 0, null, ["loc", [null, [10, 6], [19, 20]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 22,
                  "column": 4
                },
                "end": {
                  "line": 30,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-select-options.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "opt", ["loc", [null, [29, 14], [29, 17]]], 0, 0, 0, 0], ["get", "select", ["loc", [null, [29, 18], [29, 24]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 6], [29, 26]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 2
              },
              "end": {
                "line": 31,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-options.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "paper-option", [], ["parentComponent", ["subexpr", "@mut", [["get", "menuParent", ["loc", [null, [22, 36], [22, 46]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "ember-power-select-option", "aria-selected", ["subexpr", "ember-power-select-is-selected", [["get", "opt", ["loc", [null, [23, 52], [23, 55]]], 0, 0, 0, 0], ["get", "select.selected", ["loc", [null, [23, 56], [23, 71]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 20], [23, 72]]], 0, 0], "selected", ["subexpr", "if", [["subexpr", "ember-power-select-is-selected", [["get", "opt", ["loc", [null, [24, 51], [24, 54]]], 0, 0, 0, 0], ["get", "select.selected", ["loc", [null, [24, 55], [24, 70]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 19], [24, 71]]], 0, 0], "selected", null], [], ["loc", [null, [24, 15], [24, 93]]], 0, 0], "aria-disabled", ["subexpr", "ember-power-select-true-string-if-present", [["get", "opt.disabled", ["loc", [null, [25, 63], [25, 75]]], 0, 0, 0, 0]], [], ["loc", [null, [25, 20], [25, 76]]], 0, 0], "aria-current", ["subexpr", "eq", [["get", "opt", ["loc", [null, [26, 23], [26, 26]]], 0, 0, 0, 0], ["get", "select.highlighted", ["loc", [null, [26, 27], [26, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [26, 19], [26, 46]]], 0, 0], "data-option-index", ["subexpr", "concat", [["get", "groupIndex", ["loc", [null, [27, 32], [27, 42]]], 0, 0, 0, 0], ["get", "index", ["loc", [null, [27, 43], [27, 48]]], 0, 0, 0, 0]], [], ["loc", [null, [27, 24], [27, 49]]], 0, 0], "role", "option"], 0, null, ["loc", [null, [22, 4], [30, 21]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 0
            },
            "end": {
              "line": 32,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-options.hbs"
        },
        isEmpty: false,
        arity: 2,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "opt.groupName", ["loc", [null, [7, 8], [7, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [7, 2], [31, 9]]]]],
        locals: ["opt", "index"],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 32,
            "column": 9
          }
        },
        "moduleName": "workshop/templates/components/paper-select-options.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "select.loading", ["loc", [null, [1, 6], [1, 20]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [5, 7]]]], ["block", "each", [["get", "options", ["loc", [null, [6, 8], [6, 15]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [6, 0], [32, 9]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-select-search", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-search.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("md-select-header");
          dom.setAttribute(el1, "class", "ember-power-select-search md-searchbox");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("input");
          dom.setAttribute(el2, "type", "search");
          dom.setAttribute(el2, "autocomplete", "off");
          dom.setAttribute(el2, "autocorrect", "off");
          dom.setAttribute(el2, "autocapitalize", "off");
          dom.setAttribute(el2, "spellcheck", "false");
          dom.setAttribute(el2, "role", "combobox");
          dom.setAttribute(el2, "class", "ember-power-select-search-input md-searchinput");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(7);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'aria-controls');
          morphs[2] = dom.createAttrMorph(element0, 'placeholder');
          morphs[3] = dom.createAttrMorph(element0, 'oninput');
          morphs[4] = dom.createAttrMorph(element0, 'onfocus');
          morphs[5] = dom.createAttrMorph(element0, 'onblur');
          morphs[6] = dom.createAttrMorph(element0, 'onkeydown');
          return morphs;
        },
        statements: [["attribute", "value", ["get", "select.searchText", ["loc", [null, [7, 14], [7, 31]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "aria-controls", ["get", "listboxId", ["loc", [null, [8, 22], [8, 31]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "placeholder", ["get", "searchPlaceholder", ["loc", [null, [9, 20], [9, 37]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "oninput", ["get", "onInput", ["loc", [null, [10, 16], [10, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onfocus", ["get", "onFocus", ["loc", [null, [11, 16], [11, 23]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onblur", ["get", "onBlur", ["loc", [null, [12, 15], [12, 21]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "onkeydown", ["subexpr", "action", ["onKeydown"], [], ["loc", [null, [null, null], [13, 38]]], 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 7
          }
        },
        "moduleName": "workshop/templates/components/paper-select-search.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "searchEnabled", ["loc", [null, [1, 6], [1, 19]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [15, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-select-trigger", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 2
              },
              "end": {
                "line": 4,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "component", [["get", "selectedItemComponent", ["loc", [null, [3, 16], [3, 37]]], 0, 0, 0, 0]], ["option", ["subexpr", "readonly", [["get", "select.selected", ["loc", [null, [3, 55], [3, 70]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 45], [3, 71]]], 0, 0], "select", ["subexpr", "readonly", [["get", "select", ["loc", [null, [3, 89], [3, 95]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 79], [3, 96]]], 0, 0]], ["loc", [null, [3, 4], [3, 98]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 2
              },
              "end": {
                "line": 6,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "ember-power-select-selected-item");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["inline", "yield", [["get", "select.selected", ["loc", [null, [5, 59], [5, 74]]], 0, 0, 0, 0], ["get", "select", ["loc", [null, [5, 75], [5, 81]]], 0, 0, 0, 0]], [], ["loc", [null, [5, 51], [5, 83]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 2
              },
              "end": {
                "line": 9,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "ember-power-select-clear-btn");
            var el2 = dom.createTextNode("×");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'onmousedown');
            return morphs;
          },
          statements: [["attribute", "onmousedown", ["subexpr", "action", ["clear"], [], ["loc", [null, [null, null], [8, 77]]], 0, 0], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 10,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "selectedItemComponent", ["loc", [null, [2, 8], [2, 29]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [2, 2], [6, 9]]]], ["block", "if", [["subexpr", "and", [["get", "allowClear", ["loc", [null, [7, 13], [7, 23]]], 0, 0, 0, 0], ["subexpr", "not", [["get", "select.disabled", ["loc", [null, [7, 29], [7, 44]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 24], [7, 45]]], 0, 0]], [], ["loc", [null, [7, 8], [7, 46]]], 0, 0]], [], 2, null, ["loc", [null, [7, 2], [9, 9]]]]],
        locals: [],
        templates: [child0, child1, child2]
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 0
              },
              "end": {
                "line": 12,
                "column": 0
              }
            },
            "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "ember-power-select-placeholder");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["content", "placeholder", ["loc", [null, [11, 47], [11, 62]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 12,
                  "column": 0
                },
                "end": {
                  "line": 14,
                  "column": 0
                }
              },
              "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("  ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1, "class", "ember-power-select-placeholder");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
              return morphs;
            },
            statements: [["content", "label", ["loc", [null, [13, 47], [13, 56]]], 0, 0, 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 0
              },
              "end": {
                "line": 14,
                "column": 0
              }
            },
            "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "if", [["get", "label", ["loc", [null, [12, 10], [12, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [12, 0], [14, 0]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "placeholder", ["loc", [null, [10, 10], [10, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [10, 0], [14, 0]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 55
          }
        },
        "moduleName": "workshop/templates/components/paper-select-trigger.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1, "class", "md-select-icon");
        dom.setAttribute(el1, "aria-hidden", "true");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "select.selected", ["loc", [null, [1, 6], [1, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [14, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 2
              },
              "end": {
                "line": 16,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("label");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createAttrMorph(element1, 'for');
            morphs[1] = dom.createAttrMorph(element1, 'class');
            morphs[2] = dom.createMorphAt(element1, 0, 0);
            return morphs;
          },
          statements: [["attribute", "for", ["subexpr", "concat", ["ember-basic-dropdown-trigger-", ["get", "publicAPI.uniqueId", ["loc", [null, [15, 56], [15, 74]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [15, 76]]], 0, 0], 0, 0, 0, 0], ["attribute", "class", ["concat", [["subexpr", "if", [["get", "required", ["loc", [null, [15, 89], [15, 97]]], 0, 0, 0, 0], "md-required"], [], ["loc", [null, [15, 84], [15, 113]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "label", ["loc", [null, [15, 115], [15, 124]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 30,
                  "column": 4
                },
                "end": {
                  "line": 48,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-select.hbs"
            },
            isEmpty: false,
            arity: 2,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "yield", [["get", "opt", ["loc", [null, [47, 14], [47, 17]]], 0, 0, 0, 0], ["get", "term", ["loc", [null, [47, 18], [47, 22]]], 0, 0, 0, 0]], [], ["loc", [null, [47, 6], [47, 24]]], 0, 0]],
            locals: ["opt", "term"],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 18,
                "column": 2
              },
              "end": {
                "line": 49,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "component", [["get", "triggerComponent", ["loc", [null, [30, 17], [30, 33]]], 0, 0, 0, 0]], ["allowClear", ["subexpr", "readonly", [["get", "allowClear", ["loc", [null, [31, 27], [31, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [31, 17], [31, 38]]], 0, 0], "buildSelection", ["subexpr", "readonly", [["get", "buildSelection", ["loc", [null, [32, 31], [32, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [32, 21], [32, 46]]], 0, 0], "extra", ["subexpr", "readonly", [["get", "extra", ["loc", [null, [33, 22], [33, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [33, 12], [33, 28]]], 0, 0], "listboxId", ["subexpr", "readonly", [["get", "optionsId", ["loc", [null, [34, 26], [34, 35]]], 0, 0, 0, 0]], [], ["loc", [null, [34, 16], [34, 36]]], 0, 0], "onFocus", ["subexpr", "action", ["onFocus"], [], ["loc", [null, [35, 14], [35, 32]]], 0, 0], "activate", ["subexpr", "action", ["activate"], [], ["loc", [null, [36, 15], [36, 34]]], 0, 0], "onBlur", ["subexpr", "action", ["deactivate"], [], ["loc", [null, [37, 13], [37, 34]]], 0, 0], "onInput", ["subexpr", "action", ["onInput"], [], ["loc", [null, [38, 14], [38, 32]]], 0, 0], "placeholder", ["subexpr", "readonly", [["get", "placeholder", ["loc", [null, [39, 28], [39, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [39, 18], [39, 40]]], 0, 0], "label", ["subexpr", "readonly", [["get", "label", ["loc", [null, [40, 22], [40, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [40, 12], [40, 28]]], 0, 0], "onKeydown", ["subexpr", "action", ["onKeydown"], [], ["loc", [null, [41, 16], [41, 36]]], 0, 0], "searchEnabled", ["subexpr", "readonly", [["get", "searchEnabled", ["loc", [null, [42, 30], [42, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [42, 20], [42, 44]]], 0, 0], "searchField", ["subexpr", "readonly", [["get", "searchField", ["loc", [null, [43, 28], [43, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [43, 18], [43, 40]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [44, 23], [44, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [44, 13], [44, 33]]], 0, 0], "selectedItemComponent", ["subexpr", "readonly", [["get", "selectedItemComponent", ["loc", [null, [45, 38], [45, 59]]], 0, 0, 0, 0]], [], ["loc", [null, [45, 28], [45, 60]]], 0, 0]], 0, null, ["loc", [null, [30, 4], [48, 18]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      var child2 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 53,
                  "column": 6
                },
                "end": {
                  "line": 55,
                  "column": 6
                }
              },
              "moduleName": "workshop/templates/components/paper-select.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "md-char-counter");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
              return morphs;
            },
            statements: [["content", "renderCharCount", ["loc", [null, [54, 37], [54, 56]]], 0, 0, 0, 0]],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 59,
                    "column": 8
                  },
                  "end": {
                    "line": 64,
                    "column": 8
                  }
                },
                "moduleName": "workshop/templates/components/paper-select.hbs"
              },
              isEmpty: false,
              arity: 2,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("          ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                dom.setAttribute(el1, "class", "paper-input-error ng-enter ng-enter-active");
                dom.setAttribute(el1, "ng-message", "");
                var el2 = dom.createTextNode("\n            ");
                dom.appendChild(el1, el2);
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var element0 = dom.childAt(fragment, [1]);
                var morphs = new Array(2);
                morphs[0] = dom.createAttrMorph(element0, 'id');
                morphs[1] = dom.createMorphAt(element0, 1, 1);
                return morphs;
              },
              statements: [["attribute", "id", ["concat", ["error-", ["get", "inputElementId", ["loc", [null, [60, 27], [60, 41]]], 0, 0, 0, 0], "-", ["get", "index", ["loc", [null, [60, 46], [60, 51]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "error.message", ["loc", [null, [62, 12], [62, 29]]], 0, 0, 0, 0]],
              locals: ["error", "index"],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 57,
                  "column": 4
                },
                "end": {
                  "line": 66,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-select.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1, "class", "md-input-messages-animation md-auto-hide");
              dom.setAttribute(el1, "ng-messages", "");
              var el2 = dom.createTextNode("\n");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("      ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
              return morphs;
            },
            statements: [["block", "each", [["get", "validationErrorMessages", ["loc", [null, [59, 16], [59, 39]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [59, 8], [64, 17]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 51,
                "column": 2
              },
              "end": {
                "line": 67,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "md-errors-spacer");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "if", [["get", "maxlength", ["loc", [null, [53, 12], [53, 21]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [53, 6], [55, 13]]]], ["block", "if", [["get", "isInvalidAndTouched", ["loc", [null, [57, 10], [57, 29]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [57, 4], [66, 11]]]]],
          locals: [],
          templates: [child0, child1]
        };
      })();
      var child3 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 84,
                  "column": 4
                },
                "end": {
                  "line": 89,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-select.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "component", [["get", "searchMessageComponent", ["loc", [null, [85, 18], [85, 40]]], 0, 0, 0, 0]], ["searchMessage", ["subexpr", "readonly", [["get", "searchMessage", ["loc", [null, [86, 32], [86, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [86, 22], [86, 46]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [87, 25], [87, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [87, 15], [87, 35]]], 0, 0]], ["loc", [null, [85, 6], [88, 8]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 90,
                      "column": 6
                    },
                    "end": {
                      "line": 92,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-select.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("        ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                  return morphs;
                },
                statements: [["inline", "yield", [], ["to", "inverse"], ["loc", [null, [91, 8], [91, 30]]], 0, 0]],
                locals: [],
                templates: []
              };
            })();
            var child1 = (function () {
              var child0 = (function () {
                return {
                  meta: {
                    "revision": "Ember@2.8.3",
                    "loc": {
                      "source": null,
                      "start": {
                        "line": 92,
                        "column": 6
                      },
                      "end": {
                        "line": 98,
                        "column": 6
                      }
                    },
                    "moduleName": "workshop/templates/components/paper-select.hbs"
                  },
                  isEmpty: false,
                  arity: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("        ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("md-content");
                    dom.setAttribute(el1, "class", "ember-power-select-options");
                    dom.setAttribute(el1, "role", "listbox");
                    var el2 = dom.createTextNode("\n          ");
                    dom.appendChild(el1, el2);
                    var el2 = dom.createElement("md-option");
                    dom.setAttribute(el2, "class", "ember-power-select-option ember-power-select-option--no-matches-message");
                    dom.setAttribute(el2, "role", "option");
                    var el3 = dom.createTextNode("\n            ");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createComment("");
                    dom.appendChild(el2, el3);
                    var el3 = dom.createTextNode("\n          ");
                    dom.appendChild(el2, el3);
                    dom.appendChild(el1, el2);
                    var el2 = dom.createTextNode("\n        ");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n      ");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
                    return morphs;
                  },
                  statements: [["content", "noMatchesMessage", ["loc", [null, [95, 12], [95, 32]]], 0, 0, 0, 0]],
                  locals: [],
                  templates: []
                };
              })();
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 92,
                      "column": 6
                    },
                    "end": {
                      "line": 98,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-select.hbs"
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                  dom.insertBoundary(fragment, 0);
                  dom.insertBoundary(fragment, null);
                  return morphs;
                },
                statements: [["block", "if", [["get", "noMatchesMessage", ["loc", [null, [92, 16], [92, 32]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [92, 6], [98, 6]]]]],
                locals: [],
                templates: [child0]
              };
            })();
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 89,
                    "column": 4
                  },
                  "end": {
                    "line": 99,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/components/paper-select.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                dom.insertBoundary(fragment, null);
                return morphs;
              },
              statements: [["block", "if", [["subexpr", "hasBlock", ["inverse"], [], ["loc", [null, [90, 12], [90, 32]]], 0, 0]], [], 0, 1, ["loc", [null, [90, 6], [98, 13]]]]],
              locals: [],
              templates: [child0, child1]
            };
          })();
          var child1 = (function () {
            var child0 = (function () {
              return {
                meta: {
                  "revision": "Ember@2.8.3",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 100,
                      "column": 6
                    },
                    "end": {
                      "line": 112,
                      "column": 6
                    }
                  },
                  "moduleName": "workshop/templates/components/paper-select.hbs"
                },
                isEmpty: false,
                arity: 2,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("        ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                  var morphs = new Array(1);
                  morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                  return morphs;
                },
                statements: [["inline", "yield", [["get", "option", ["loc", [null, [111, 16], [111, 22]]], 0, 0, 0, 0], ["get", "term", ["loc", [null, [111, 23], [111, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [111, 8], [111, 29]]], 0, 0]],
                locals: ["option", "term"],
                templates: []
              };
            })();
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 99,
                    "column": 4
                  },
                  "end": {
                    "line": 113,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/components/paper-select.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("    ");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                dom.insertBoundary(fragment, 0);
                return morphs;
              },
              statements: [["block", "component", [["get", "optionsComponent", ["loc", [null, [100, 19], [100, 35]]], 0, 0, 0, 0]], ["class", "ember-power-select-options", "groupIndex", "", "loadingMessage", ["subexpr", "readonly", [["get", "loadingMessage", ["loc", [null, [103, 33], [103, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [103, 23], [103, 48]]], 0, 0], "id", ["subexpr", "readonly", [["get", "optionsId", ["loc", [null, [104, 21], [104, 30]]], 0, 0, 0, 0]], [], ["loc", [null, [104, 11], [104, 31]]], 0, 0], "options", ["subexpr", "readonly", [["get", "publicAPI.results", ["loc", [null, [105, 26], [105, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [105, 16], [105, 44]]], 0, 0], "searchEnabled", ["subexpr", "readonly", [["get", "searchEnabled", ["loc", [null, [106, 32], [106, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [106, 22], [106, 46]]], 0, 0], "optionsComponent", ["subexpr", "readonly", [["get", "optionsComponent", ["loc", [null, [107, 35], [107, 51]]], 0, 0, 0, 0]], [], ["loc", [null, [107, 25], [107, 52]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [108, 25], [108, 34]]], 0, 0, 0, 0]], [], ["loc", [null, [108, 15], [108, 35]]], 0, 0], "menuParent", ["subexpr", "@mut", [["get", "content.menu", ["loc", [null, [109, 19], [109, 31]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [100, 6], [112, 20]]]]],
              locals: [],
              templates: [child0]
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 89,
                  "column": 4
                },
                "end": {
                  "line": 113,
                  "column": 4
                }
              },
              "moduleName": "workshop/templates/components/paper-select.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "if", [["get", "mustShowNoMessages", ["loc", [null, [89, 14], [89, 32]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [89, 4], [113, 4]]]]],
            locals: [],
            templates: [child0, child1]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 69,
                "column": 2
              },
              "end": {
                "line": 115,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/components/paper-select.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
            morphs[2] = dom.createMorphAt(fragment, 5, 5, contextualElement);
            return morphs;
          },
          statements: [["inline", "component", [["get", "beforeOptionsComponent", ["loc", [null, [74, 16], [74, 38]]], 0, 0, 0, 0]], ["extra", ["subexpr", "readonly", [["get", "extra", ["loc", [null, [75, 22], [75, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [75, 12], [75, 28]]], 0, 0], "listboxId", ["subexpr", "readonly", [["get", "optionsId", ["loc", [null, [76, 26], [76, 35]]], 0, 0, 0, 0]], [], ["loc", [null, [76, 16], [76, 36]]], 0, 0], "onInput", ["subexpr", "action", ["onInput"], [], ["loc", [null, [77, 14], [77, 32]]], 0, 0], "onKeydown", ["subexpr", "action", ["onKeydown"], [], ["loc", [null, [78, 16], [78, 36]]], 0, 0], "searchEnabled", ["subexpr", "readonly", [["get", "searchEnabled", ["loc", [null, [79, 30], [79, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [79, 20], [79, 44]]], 0, 0], "onFocus", ["subexpr", "action", ["onFocus"], [], ["loc", [null, [80, 14], [80, 32]]], 0, 0], "onBlur", ["subexpr", "action", ["deactivate"], [], ["loc", [null, [81, 13], [81, 34]]], 0, 0], "searchPlaceholder", ["subexpr", "readonly", [["get", "searchPlaceholder", ["loc", [null, [82, 34], [82, 51]]], 0, 0, 0, 0]], [], ["loc", [null, [82, 24], [82, 52]]], 0, 0], "select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [83, 23], [83, 32]]], 0, 0, 0, 0]], [], ["loc", [null, [83, 13], [83, 33]]], 0, 0]], ["loc", [null, [74, 4], [83, 35]]], 0, 0], ["block", "if", [["get", "mustShowSearchMessage", ["loc", [null, [84, 10], [84, 31]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [84, 4], [113, 11]]]], ["inline", "component", [["get", "afterOptionsComponent", ["loc", [null, [114, 16], [114, 37]]], 0, 0, 0, 0]], ["select", ["subexpr", "readonly", [["get", "publicAPI", ["loc", [null, [114, 55], [114, 64]]], 0, 0, 0, 0]], [], ["loc", [null, [114, 45], [114, 65]]], 0, 0], "extra", ["subexpr", "readonly", [["get", "extra", ["loc", [null, [114, 82], [114, 87]]], 0, 0, 0, 0]], [], ["loc", [null, [114, 72], [114, 88]]], 0, 0]], ["loc", [null, [114, 4], [114, 90]]], 0, 0]],
          locals: ["content"],
          templates: [child0, child1]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 116,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[2] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          morphs[3] = dom.createMorphAt(fragment, 7, 7, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "shouldShowLabel", ["loc", [null, [14, 8], [14, 23]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 2], [16, 9]]]], ["block", "menu.trigger", [], ["ariaDescribedBy", ["subexpr", "readonly", [["get", "ariaDescribedBy", ["loc", [null, [19, 30], [19, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 20], [19, 46]]], 0, 0], "ariaInvalid", ["subexpr", "readonly", [["get", "ariaInvalid", ["loc", [null, [20, 26], [20, 37]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 16], [20, 38]]], 0, 0], "ariaLabel", ["subexpr", "readonly", [["get", "ariaLabel", ["loc", [null, [21, 24], [21, 33]]], 0, 0, 0, 0]], [], ["loc", [null, [21, 14], [21, 34]]], 0, 0], "ariaLabelledBy", ["subexpr", "readonly", [["get", "ariaLabelledBy", ["loc", [null, [22, 29], [22, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [22, 19], [22, 44]]], 0, 0], "ariaRequired", ["subexpr", "readonly", [["get", "required", ["loc", [null, [23, 27], [23, 35]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 17], [23, 36]]], 0, 0], "class", ["subexpr", "readonly", [["get", "concatenatedTriggerClasses", ["loc", [null, [24, 20], [24, 46]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 10], [24, 47]]], 0, 0], "onKeydown", ["subexpr", "action", ["onTriggerKeydown"], [], ["loc", [null, [25, 14], [25, 41]]], 0, 0], "onFocus", ["subexpr", "action", ["onTriggerFocus"], [], ["loc", [null, [26, 12], [26, 37]]], 0, 0], "onBlur", ["subexpr", "action", ["deactivate"], [], ["loc", [null, [27, 11], [27, 32]]], 0, 0], "tabindex", ["subexpr", "readonly", [["get", "tabindex", ["loc", [null, [28, 23], [28, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 13], [28, 32]]], 0, 0], "required", ["subexpr", "readonly", [["get", "required", ["loc", [null, [29, 23], [29, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 13], [29, 32]]], 0, 0]], 1, null, ["loc", [null, [18, 2], [49, 19]]]], ["block", "unless", [["get", "hideAllMessages", ["loc", [null, [51, 12], [51, 27]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [51, 2], [67, 13]]]], ["block", "menu.content", [], ["class", ["subexpr", "readonly", [["get", "concatenatedDropdownClasses", ["loc", [null, [70, 20], [70, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [70, 10], [70, 48]]], 0, 0], "to", ["subexpr", "readonly", [["get", "destination", ["loc", [null, [71, 17], [71, 28]]], 0, 0, 0, 0]], [], ["loc", [null, [71, 7], [71, 29]]], 0, 0], "searchEnabled", ["subexpr", "@mut", [["get", "searchEnabled", ["loc", [null, [72, 18], [72, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "dropdown", ["subexpr", "@mut", [["get", "publicAPI", ["loc", [null, [73, 13], [73, 22]]], 0, 0, 0, 0]], [], [], 0, 0]], 3, null, ["loc", [null, [69, 2], [115, 19]]]]],
        locals: ["menu"],
        templates: [child0, child1, child2, child3]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 117,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "paper-select-menu", [], ["horizontalPosition", ["subexpr", "readonly", [["get", "horizontalPosition", ["loc", [null, [2, 31], [2, 49]]], 0, 0, 0, 0]], [], ["loc", [null, [2, 21], [2, 50]]], 0, 0], "initiallyOpened", ["subexpr", "readonly", [["get", "initiallyOpened", ["loc", [null, [3, 28], [3, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 18], [3, 44]]], 0, 0], "matchTriggerWidth", ["subexpr", "readonly", [["get", "matchTriggerWidth", ["loc", [null, [4, 30], [4, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [4, 20], [4, 48]]], 0, 0], "onClose", ["subexpr", "action", ["onClose"], [], ["loc", [null, [5, 10], [5, 28]]], 0, 0], "onOpen", ["subexpr", "action", ["onOpen"], [], ["loc", [null, [6, 9], [6, 26]]], 0, 0], "registerAPI", ["subexpr", "action", ["registerAPI"], [], ["loc", [null, [7, 14], [7, 36]]], 0, 0], "renderInPlace", ["subexpr", "readonly", [["get", "renderInPlace", ["loc", [null, [8, 26], [8, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [8, 16], [8, 40]]], 0, 0], "verticalPosition", ["subexpr", "readonly", [["get", "verticalPosition", ["loc", [null, [9, 29], [9, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [9, 19], [9, 46]]], 0, 0], "disabled", ["subexpr", "readonly", [["get", "disabled", ["loc", [null, [10, 21], [10, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [10, 11], [10, 30]]], 0, 0], "searchEnabled", ["subexpr", "@mut", [["get", "searchEnabled", ["loc", [null, [11, 16], [11, 29]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [1, 0], [116, 22]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/paper-sidenav-toggle", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 25
          }
        },
        "moduleName": "workshop/templates/components/paper-sidenav-toggle.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "action", [["get", "toggle", ["loc", [null, [1, 16], [1, 22]]], 0, 0, 0, 0]], [], ["loc", [null, [1, 8], [1, 23]]], 0, 0]], [], ["loc", [null, [1, 0], [1, 25]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-sidenav", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 8,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-sidenav.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "paper-backdrop", [], ["locked-open", ["subexpr", "@mut", [["get", "isLockedOpen", ["loc", [null, [3, 16], [3, 28]]], 0, 0, 0, 0]], [], [], 0, 0], "opaque", true, "class", "md-sidenav-backdrop", "onClick", ["subexpr", "action", ["onBackdropTap"], [], ["loc", [null, [6, 12], [6, 36]]], 0, 0]], ["loc", [null, [2, 2], [7, 4]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 0
            },
            "end": {
              "line": 19,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-sidenav.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [18, 2], [18, 11]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-sidenav.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "unless", [["get", "closed", ["loc", [null, [1, 10], [1, 16]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [8, 11]]]], ["block", "paper-sidenav-inner", [], ["class", ["subexpr", "@mut", [["get", "class", ["loc", [null, [11, 8], [11, 13]]], 0, 0, 0, 0]], [], [], 0, 0], "name", ["subexpr", "@mut", [["get", "name", ["loc", [null, [12, 7], [12, 11]]], 0, 0, 0, 0]], [], [], 0, 0], "position", ["subexpr", "@mut", [["get", "position", ["loc", [null, [13, 11], [13, 19]]], 0, 0, 0, 0]], [], [], 0, 0], "lockedOpen", ["subexpr", "@mut", [["get", "lockedOpen", ["loc", [null, [14, 13], [14, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "closed", ["subexpr", "@mut", [["get", "closed", ["loc", [null, [15, 9], [15, 15]]], 0, 0, 0, 0]], [], [], 0, 0], "closeOnClick", ["subexpr", "@mut", [["get", "closeOnClick", ["loc", [null, [16, 15], [16, 27]]], 0, 0, 0, 0]], [], [], 0, 0], "onToggle", ["subexpr", "action", ["onToggle"], [], ["loc", [null, [17, 11], [17, 30]]], 0, 0]], 1, null, ["loc", [null, [10, 0], [19, 24]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-slider", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-slider.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-slider-wrapper");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-track-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-track");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-track md-track-fill");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-track-ticks");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-thumb-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-thumb");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-focus-thumb");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-focus-ring");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-sign");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4, "class", "md-thumb-text");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-disabled-thumb");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 3]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(3);
        morphs[0] = dom.createAttrMorph(element1, 'style');
        morphs[1] = dom.createAttrMorph(element2, 'style');
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [7, 1]), 0, 0);
        return morphs;
      },
      statements: [["attribute", "style", ["get", "activeTrackStyle", ["loc", [null, [4, 52], [4, 68]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "thumbContainerStyle", ["loc", [null, [7, 44], [7, 63]]], 0, 0, 0, 0], 0, 0, 0, 0], ["content", "value", ["loc", [null, [12, 40], [12, 49]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-subheader", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 6
          }
        },
        "moduleName": "workshop/templates/components/paper-subheader.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-subheader-inner");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "class", "md-subheader-content");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]), 1, 1);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [3, 6], [3, 15]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-switch", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 13,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-switch.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "yield", ["loc", [null, [11, 4], [11, 13]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 0
            },
            "end": {
              "line": 17,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-switch.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-label");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "label", ["loc", [null, [15, 4], [15, 13]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-switch.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-switch-bar");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "md-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-bar");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "md-thumb-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "md-thumb");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 3]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        morphs[1] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["attribute", "style", ["get", "thumbContainerStyle", ["loc", [null, [4, 42], [4, 61]]], 0, 0, 0, 0], 0, 0, 0, 0], ["block", "if", [["get", "hasBlock", ["loc", [null, [9, 6], [9, 14]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [9, 0], [17, 7]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("workshop/templates/components/paper-toolbar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-toolbar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "yield", [["subexpr", "hash", [], ["tools", ["subexpr", "component", ["paper-toolbar-tools"], [], ["loc", [null, [2, 8], [2, 41]]], 0, 0]], ["loc", [null, [1, 8], [3, 1]]], 0, 0]], [], ["loc", [null, [1, 0], [3, 3]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-virtual-repeat-scroller", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 9
          }
        },
        "moduleName": "workshop/templates/components/paper-virtual-repeat-scroller.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/components/paper-virtual-repeat", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/components/paper-virtual-repeat.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-virtual-repeat-sizer");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "md-virtual-repeat-offsetter");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'style');
          morphs[1] = dom.createAttrMorph(element1, 'style');
          morphs[2] = dom.createMorphAt(element1, 1, 1);
          return morphs;
        },
        statements: [["attribute", "style", ["get", "contentStyle", ["loc", [null, [2, 47], [2, 59]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "offsetterStyle", ["loc", [null, [3, 51], [3, 65]]], 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "yield", [["get", "rawVisibleItems", ["loc", [null, [4, 12], [4, 27]]], 0, 0, 0, 0], ["get", "visibleItems", ["loc", [null, [4, 28], [4, 40]]], 0, 0, 0, 0]], [], ["loc", [null, [4, 4], [4, 42]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/paper-virtual-repeat.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "paper-virtual-repeat-scroller", [], ["onScroll", ["subexpr", "action", ["onScroll"], [], ["loc", [null, [1, 42], [1, 61]]], 0, 0]], 0, null, ["loc", [null, [1, 0], [6, 34]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/components/transition-group", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/components/transition-group.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/help", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 3,
                  "column": 2
                },
                "end": {
                  "line": 5,
                  "column": 2
                }
              },
              "moduleName": "workshop/templates/help.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("			");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "paper-icon", ["build"], [], ["loc", [null, [4, 3], [4, 25]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 1
              },
              "end": {
                "line": 6,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/help.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "link-to", ["katas", ["get", "model.slug", ["loc", [null, [3, 21], [3, 31]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [3, 2], [5, 14]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/help.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-button", [], ["iconButton", true], 0, null, ["loc", [null, [2, 1], [6, 18]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/help.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row full-height full-width");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-xs-12 full-height scroll padding-bottom");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1]), 1, 1);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "ember-wormhole", [], ["to", "toolbar-buttons"], 0, null, ["loc", [null, [1, 0], [7, 19]]]], ["inline", "format-markdown", [["get", "model.help", ["loc", [null, [11, 20], [11, 30]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 2], [11, 32]]], 0, 0], ["content", "outlet", ["loc", [null, [15, 0], [15, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("workshop/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("workshop/templates/katas", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 3,
                  "column": 2
                },
                "end": {
                  "line": 5,
                  "column": 2
                }
              },
              "moduleName": "workshop/templates/katas.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("			");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [["inline", "paper-icon", ["help"], [], ["loc", [null, [4, 3], [4, 24]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 1
              },
              "end": {
                "line": 6,
                "column": 1
              }
            },
            "moduleName": "workshop/templates/katas.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "link-to", ["help", ["get", "model.slug", ["loc", [null, [3, 20], [3, 30]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [3, 2], [5, 14]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 0
            }
          },
          "moduleName": "workshop/templates/katas.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-button", [], ["iconButton", true], 0, null, ["loc", [null, [2, 1], [6, 18]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 26,
              "column": 3
            },
            "end": {
              "line": 35,
              "column": 3
            }
          },
          "moduleName": "workshop/templates/katas.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "mocha-runner", [], ["suite", ["subexpr", "@mut", [["get", "transpiledSuite", ["loc", [null, [32, 11], [32, 26]]], 0, 0, 0, 0]], [], [], 0, 0], "code", ["subexpr", "@mut", [["get", "transpiledCode", ["loc", [null, [33, 10], [33, 24]]], 0, 0, 0, 0]], [], [], 0, 0], "onEvent", ["subexpr", "@mut", [["get", "kata.onEvent", ["loc", [null, [34, 13], [34, 25]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [31, 4], [34, 27]]], 0, 0]],
        locals: ["kata"],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 46,
                "column": 2
              },
              "end": {
                "line": 48,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/katas.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "paper-icon", ["play-arrow"], [], ["loc", [null, [47, 3], [47, 30]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 51,
                "column": 2
              },
              "end": {
                "line": 53,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/katas.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "paper-icon", [["get", "status.ICON", ["loc", [null, [52, 16], [52, 27]]], 0, 0, 0, 0]], [], ["loc", [null, [52, 3], [52, 29]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 66,
                    "column": 4
                  },
                  "end": {
                    "line": 68,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/katas.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("					");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                return morphs;
              },
              statements: [["inline", "paper-icon", ["more_vert"], [], ["loc", [null, [67, 5], [67, 31]]], 0, 0]],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 64,
                  "column": 3
                },
                "end": {
                  "line": 69,
                  "column": 3
                }
              },
              "moduleName": "workshop/templates/katas.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "paper-button", [], ["iconButton", true], 0, null, ["loc", [null, [66, 4], [68, 21]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        var child1 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 74,
                    "column": 4
                  },
                  "end": {
                    "line": 77,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/katas.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("					");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n					");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                var el2 = dom.createTextNode("Run");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                return morphs;
              },
              statements: [["inline", "paper-icon", ["play-arrow"], [], ["loc", [null, [75, 5], [75, 32]]], 0, 0]],
              locals: [],
              templates: []
            };
          })();
          var child1 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 83,
                    "column": 4
                  },
                  "end": {
                    "line": 86,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/katas.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("					");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n					");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                var el2 = dom.createTextNode("Reset");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                return morphs;
              },
              statements: [["inline", "paper-icon", ["settings_backup_restore"], [], ["loc", [null, [84, 5], [84, 45]]], 0, 0]],
              locals: [],
              templates: []
            };
          })();
          var child2 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.3",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 89,
                    "column": 4
                  },
                  "end": {
                    "line": 92,
                    "column": 4
                  }
                },
                "moduleName": "workshop/templates/katas.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("					");
                dom.appendChild(el0, el1);
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n					");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                var el2 = dom.createTextNode("Solve");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var morphs = new Array(1);
                morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                return morphs;
              },
              statements: [["inline", "paper-icon", ["help_outline"], [], ["loc", [null, [90, 5], [90, 34]]], 0, 0]],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 72,
                  "column": 3
                },
                "end": {
                  "line": 93,
                  "column": 3
                }
              },
              "moduleName": "workshop/templates/katas.hbs"
            },
            isEmpty: false,
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("				");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n\n");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(4);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
              morphs[2] = dom.createMorphAt(fragment, 5, 5, contextualElement);
              morphs[3] = dom.createMorphAt(fragment, 7, 7, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "content.menu-item", [], ["onClick", ["subexpr", "action", ["run"], [], ["loc", [null, [74, 33], [74, 47]]], 0, 0]], 0, null, ["loc", [null, [74, 4], [77, 26]]]], ["content", "paper-divider", ["loc", [null, [80, 4], [80, 21]]], 0, 0, 0, 0], ["block", "content.menu-item", [], ["onClick", ["subexpr", "action", ["changeCode", ["get", "model.code", ["loc", [null, [83, 54], [83, 64]]], 0, 0, 0, 0]], [], ["loc", [null, [83, 33], [83, 65]]], 0, 0]], 1, null, ["loc", [null, [83, 4], [86, 26]]]], ["block", "content.menu-item", [], ["onClick", ["subexpr", "action", ["changeCode", ["get", "model.solution", ["loc", [null, [89, 54], [89, 68]]], 0, 0, 0, 0]], [], ["loc", [null, [89, 33], [89, 69]]], 0, 0]], 2, null, ["loc", [null, [89, 4], [92, 26]]]]],
            locals: ["content"],
            templates: [child0, child1, child2]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.3",
            "loc": {
              "source": null,
              "start": {
                "line": 62,
                "column": 2
              },
              "end": {
                "line": 94,
                "column": 2
              }
            },
            "moduleName": "workshop/templates/katas.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "menu.trigger", [], [], 0, null, ["loc", [null, [64, 3], [69, 20]]]], ["block", "menu.content", [], ["width", 4], 1, null, ["loc", [null, [72, 3], [93, 20]]]]],
          locals: ["menu"],
          templates: [child0, child1]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.3",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 1
            },
            "end": {
              "line": 95,
              "column": 1
            }
          },
          "moduleName": "workshop/templates/katas.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h2");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("		");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "flex");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[2] = dom.createMorphAt(dom.childAt(fragment, [6]), 0, 0);
          morphs[3] = dom.createMorphAt(fragment, 11, 11, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "paper-button", [], ["iconButton", true, "onClick", ["subexpr", "action", ["run"], [], ["loc", [null, [46, 42], [46, 56]]], 0, 0]], 0, null, ["loc", [null, [46, 2], [48, 19]]]], ["block", "paper-button", [], ["iconButton", true], 1, null, ["loc", [null, [51, 2], [53, 19]]]], ["content", "status.DESC", ["loc", [null, [56, 6], [56, 21]]], 0, 0, 0, 0], ["block", "paper-menu", [], ["position", "target-right target"], 2, null, ["loc", [null, [62, 2], [94, 17]]]]],
        locals: [],
        templates: [child0, child1, child2]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 99,
            "column": 0
          }
        },
        "moduleName": "workshop/templates/katas.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row full-height full-width");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-xs-12 col-md-6 full-height");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row full-height");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1, 1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(element1, 1, 1);
        morphs[2] = dom.createMorphAt(element1, 3, 3);
        morphs[3] = dom.createMorphAt(element1, 5, 5);
        morphs[4] = dom.createMorphAt(element1, 7, 7);
        morphs[5] = dom.createMorphAt(element0, 3, 3);
        morphs[6] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "ember-wormhole", [], ["to", "toolbar-buttons"], 0, null, ["loc", [null, [1, 0], [7, 19]]]], ["inline", "kata-description", [], ["kata", ["subexpr", "@mut", [["get", "model.readme", ["loc", [null, [12, 27], [12, 39]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "col-xs-12 half-height scroll"], ["loc", [null, [12, 3], [12, 78]]], 0, 0], ["inline", "babel-transpiler", [], ["code", ["subexpr", "@mut", [["get", "code", ["loc", [null, [15, 9], [15, 13]]], 0, 0, 0, 0]], [], [], 0, 0], "options", ["subexpr", "@mut", [["get", "options", ["loc", [null, [16, 12], [16, 19]]], 0, 0, 0, 0]], [], [], 0, 0], "onTranspile", ["subexpr", "action", [["subexpr", "mut", [["get", "transpiledCode", ["loc", [null, [17, 29], [17, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [17, 24], [17, 44]]], 0, 0]], [], ["loc", [null, [17, 16], [17, 45]]], 0, 0], "onError", ["subexpr", "action", ["onError"], [], ["loc", [null, [18, 12], [18, 30]]], 0, 0]], ["loc", [null, [14, 3], [18, 32]]], 0, 0], ["inline", "babel-transpiler", [], ["code", ["subexpr", "@mut", [["get", "model.suite", ["loc", [null, [21, 9], [21, 20]]], 0, 0, 0, 0]], [], [], 0, 0], "options", ["subexpr", "@mut", [["get", "options", ["loc", [null, [22, 12], [22, 19]]], 0, 0, 0, 0]], [], [], 0, 0], "onTranspile", ["subexpr", "action", [["subexpr", "mut", [["get", "transpiledSuite", ["loc", [null, [23, 29], [23, 44]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 24], [23, 45]]], 0, 0]], [], ["loc", [null, [23, 16], [23, 46]]], 0, 0], "onError", ["subexpr", "action", ["onError"], [], ["loc", [null, [24, 12], [24, 30]]], 0, 0]], ["loc", [null, [20, 3], [24, 32]]], 0, 0], ["block", "kata-output", [], ["class", "col-xs-12 half-height scroll", "onStart", ["subexpr", "action", ["onStart"], [], ["loc", [null, [28, 12], [28, 30]]], 0, 0], "onEnd", ["subexpr", "action", ["onEnd"], [], ["loc", [null, [29, 10], [29, 26]]], 0, 0]], 1, null, ["loc", [null, [26, 3], [35, 19]]]], ["block", "codemirror-editor", [], ["code", ["subexpr", "@mut", [["get", "code", ["loc", [null, [40, 7], [40, 11]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "col-xs-12 col-md-6 full-height scroll", "onChange", ["subexpr", "action", ["onChange"], [], ["loc", [null, [42, 11], [42, 30]]], 0, 0]], 2, null, ["loc", [null, [39, 1], [95, 23]]]], ["content", "outlet", ["loc", [null, [98, 0], [98, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define('workshop/utils/grid-layout', ['exports', 'ember-paper/utils/grid-layout'], function (exports, _emberPaperUtilsGridLayout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperUtilsGridLayout['default'];
    }
  });
});
define('workshop/utils/send-action', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = sendSafeAction;

	function sendSafeAction(context, action) {
		var func = context.get(action);

		for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			args[_key - 2] = arguments[_key];
		}

		if (_ember['default'].typeOf(func) === 'function') {
			return func.call.apply(func, [context].concat(args));
		}

		if (_ember['default'].typeOf(func) === 'string') {
			return context.sendAction.apply(context, [action].concat(args));
		}
	}
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('workshop/config/environment', ['ember'], function(Ember) {
  var prefix = 'workshop';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("workshop/app")["default"].create({"babel":{"presets":["es2017"],"plugins":["transform-decorators-legacy"]},"name":"workshop","version":"0.0.0+68d9c9e4"});
}

/* jshint ignore:end */
//# sourceMappingURL=workshop.map
