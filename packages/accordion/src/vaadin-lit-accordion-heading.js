/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { accordionHeading } from './vaadin-accordion-heading-styles.js';

/**
 * LitElement based version of `<vaadin-accordion-heading>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class AccordionHeading extends ActiveMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-accordion-heading';
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }

  static get styles() {
    return accordionHeading;
  }

  static get properties() {
    return {
      /**
       * When true, the element is opened.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <button id="button" part="content" ?disabled="${this.disabled}" aria-expanded="${this.opened ? 'true' : 'false'}">
        <span part="toggle" aria-hidden="true"></span>
        <slot></slot>
      </button>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "heading".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'heading');
    }
  }
}

defineCustomElement(AccordionHeading);

export { AccordionHeading };
