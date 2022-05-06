import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { FieldHighlighter } from '../../src/vaadin-field-highlighter.js';

/* Hide caret */
registerStyles(
  'vaadin-combo-box vaadin-date-picker vaadin-text-field',
  css`
    :host([focus-ring]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);

registerStyles(
  'vaadin-text-area',
  css`
    :host([focus-ring]) ::slotted(textarea) {
      caret-color: transparent;
    }
  `,
);

registerStyles(
  'vaadin-user-tags-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
  { moduleId: 'not-animated-user-tags-overlay' },
);

const users = [
  { id: 'a', name: 'User', colorIndex: 0, fieldIndex: 2 },
  { id: 'b', name: 'Moderator', colorIndex: 1, fieldIndex: 1 },
  { id: 'c', name: 'Admin', colorIndex: 2, fieldIndex: 0 },
];

export const setUsers = (field) => {
  FieldHighlighter.init(field);
  FieldHighlighter.setUsers(field, users);
  // Mimic focus to show highlight and badges
  field.dispatchEvent(new CustomEvent('mouseenter'));
};
