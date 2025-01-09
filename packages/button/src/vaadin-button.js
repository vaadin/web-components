/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { buttonStyles, buttonTemplate } from './vaadin-button-base.js';
import { ButtonMixin } from './vaadin-button-mixin.js';

registerStyles('vaadin-button', buttonStyles, { moduleId: 'vaadin-button-styles' });

/**
 * `<vaadin-button>` is an accessible and customizable button that allows users to perform actions.
 *
 * ```html
 * <vaadin-button>Press me</vaadin-button>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the button.
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * The following attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the button is pressed down, either with mouse, touch or the keyboard.
 * `disabled`   | Set when the button is disabled.
 * `focus-ring` | Set when the button is focused using the keyboard.
 * `focused`    | Set when the button is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Button extends ButtonMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-button';
  }

  static get template() {
    return buttonTemplate(html);
  }

  constructor() {
    super();
    [
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'click',
      'dblclick',
      'keydown',
      'keyup',
      'pointerstart',
      'pointerend',
    ].forEach((eventType) => {
      this.addEventListener(
        eventType,
        (event) => {
          if (this.disabled) {
            if (['mousedown', 'touchstart'].includes(event.type)) {
              this.focus();
            }

            if (this.__shouldSuppressEventWhenDisabled(event)) {
              event.preventDefault();
              event.stopImmediatePropagation();
            }
          }
        },
        { capture: true },
      );
    });
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  _disabledChanged(disabled) {
    this._setAriaDisabled(disabled);
  }

  _tabindexChanged(_tabindex) {
    // NO-OP
  }

  /**
   * @protected
   */
  __shouldSuppressEventWhenDisabled(event) {
    if (event.type === 'keydown' && event.key === 'Tab') {
      return false;
    }

    return true;
  }
}

defineCustomElement(Button);

export { Button };
