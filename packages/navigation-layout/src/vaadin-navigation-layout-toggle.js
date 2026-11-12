/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-navigation-layout-toggle>` is a button that toggles the `collapsed`
 * state of the closest ancestor `<vaadin-navigation-layout>`.
 *
 * ```html
 * <vaadin-navigation-layout>
 *   <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
 * </vaadin-navigation-layout>
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `focus-ring` | Set when the element is focused using the keyboard
 * `focused`    | Set when the element is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-navigation-layout-toggle
 * @extends HTMLElement
 */
class NavigationLayoutToggle extends ButtonMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-navigation-layout-toggle';
  }

  static get styles() {
    return [
      buttonStyles,
      css`
        :host {
          display: var(--vaadin-navigation-layout-toggle-display, inline-flex);
          padding: var(
            --vaadin-side-nav-item-padding,
            var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
          );
          border: var(--vaadin-side-nav-item-border-width, 0) solid transparent;
          justify-content: start;
          white-space: nowrap;
          box-sizing: content-box;
          overflow: clip;
          transition: 0.1s width;
          interpolate-size: allow-keywords;
          color: var(--vaadin-text-color-secondary);
        }

        :host::before {
          content: '\\2003' / '';
          width: var(--vaadin-icon-size, 1lh);
          height: var(--vaadin-icon-size, 1lh);
          background: currentColor;
          mask: var(--_vaadin-icon-panel-close) center / var(--vaadin-icon-visual-size, 100%) no-repeat;
          flex: none;
        }

        :host(:dir(rtl))::before {
          scale: -1 1;
        }

        @media (any-hover: hover) {
          :host(:hover) {
            color: var(--vaadin-text-color);
          }
        }

        @container style(--vaadin-navigation-layout-collapsed: 1) {
          :host {
            width: var(--vaadin-icon-size, 1lh);
          }

          :host::before {
            mask-image: var(--_vaadin-icon-panel-open);
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.setAttribute('aria-pressed', 'false');

    this.addEventListener('click', () => {
      this.dispatchEvent(
        /** @internal to not document it in CEM */
        new CustomEvent('navigation-layout-toggle-click', { bubbles: true, composed: true }),
      );
      if (this.closest('vaadin-navigation-layout').hasAttribute('collapsed')) {
        this.setAttribute('aria-pressed', 'true');
      } else {
        this.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /** @protected */
  render() {
    /* TODO tooltip */
    return html`<slot>Collapse Sidebar</slot>`;
  }
}

defineCustomElement(NavigationLayoutToggle);

export { NavigationLayoutToggle };
