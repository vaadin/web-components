export interface MissingEvents {
  all?: boolean;
  some?: readonly string[];
}

export const genericElements = new Map<string, number>([
  ['ComboBox', 1],
  ['ComboBoxLight', 1],
  ['Crud', 1],
  ['Grid', 1],
  ['GridPro', 1],
]);

export const elementsWithEventIssues = new Map<string, MissingEvents>([
  ['AccordionPanel', { all: true }],
  ['AppLayout', { some: ['close-overlay-drawer'] }],
  ['Checkbox', { some: ['value-changed'] }],
  ['ComboBox', { some: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['ComboBoxLight', { some: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['Grid', { some: ['size-changed', 'data-provider-changed'] }],
  [
    'GridPro',
    { some: ['size-changed', 'data-provider-changed', 'enter-next-row-changed', 'single-cell-edit-changed'] },
  ],
  ['GridProEditColumn', { some: ['editor-type-changed'] }],
  [
    'LoginForm',
    { some: ['action-changed', 'disabled-changed', 'error-changed', 'no-forgot-password-changed', 'i18n-changed'] },
  ],
  [
    'LoginOverlay',
    {
      some: [
        'description-changed',
        'action-changed',
        'disabled-changed',
        'error-changed',
        'no-forgot-password-changed',
        'i18n-changed',
      ],
    },
  ],
  ['RadioButton', { some: ['value-changed'] }],
]);
