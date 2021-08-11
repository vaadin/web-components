/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/text-field/theme/lumo/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-email-field',
  css`
    :host([dir='rtl']) [part='input-field'] ::slotted(input) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
    }

    :host([dir='rtl']) [part='input-field'] ::slotted(input:placeholder-shown) {
      --_lumo-text-field-overflow-mask-image: none;
    }
  `,
  { moduleId: 'lumo-email-field', include: ['lumo-input-field-shared-styles'] }
);
