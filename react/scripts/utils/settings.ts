export interface MissingEvents {
  all?: boolean;
  some?: readonly string[];
}

export enum NonGenericInterface {
  EVENT_MAP,
}

export type GenericElementInfo = Readonly<{
  numberOfGenerics: number;
  nonGenericInterfaces?: readonly NonGenericInterface[];
}>;

export const genericElements = new Map<string, GenericElementInfo>([
  ['ComboBox', { numberOfGenerics: 1 }],
  ['ComboBoxLight', { numberOfGenerics: 1 }],
  ['Crud', { numberOfGenerics: 1 }],
  ['Grid', { numberOfGenerics: 1 }],
  ['GridColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridFilterColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridPro', { numberOfGenerics: 1 }],
  ['GridProEditColumn', { numberOfGenerics: 1 }],
  ['GridSelectionColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridSortColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridTreeColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['VirtualList', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
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
