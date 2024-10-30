/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-lit-input-container.js';
import './vaadin-lit-combo-box-item.js';
import './vaadin-lit-combo-box-overlay.js';
import './vaadin-lit-combo-box-scroller.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

/**
 * LitElement based version of `<vaadin-combo-box>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class ComboBox extends ComboBoxDataProviderMixin(
  ComboBoxMixin(PatternMixin(InputControlMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))))),
) {
  static get is() {
    return 'vaadin-combo-box';
  }

  static get styles() {
    return [
      inputFieldShared,
      css`
        :host([opened]) {
          pointer-events: auto;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * @protected
       */
      _positionTarget: {
        type: Object,
      },
    };
  }

  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div id="toggleButton" part="toggle-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-combo-box-overlay
        id="overlay"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this._positionTarget}"
        no-vertical-overlap
      ></vaadin-combo-box-overlay>

      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setShouldShow((target) => !target.opened);

    this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]');
    this._toggleElement = this.$.toggleButton;
  }

  /**
   * Override the method from `InputControlMixin`
   * to stop event propagation to prevent `ComboBoxMixin`
   * from handling this click event also on its own.
   *
   * @param {Event} event
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();
    super._onClearButtonClick(event);
  }

  /**
   * @param {Event} event
   * @protected
   */
  _onHostClick(event) {
    const path = event.composedPath();

    // Open dropdown only when clicking on the label or input field
    if (path.includes(this._labelNode) || path.includes(this._positionTarget)) {
      super._onHostClick(event);
    }
  }
}

defineCustomElement(ComboBox);

export { ComboBox };
