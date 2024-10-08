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
  typeConstraints?: string[];
}>;

export const genericElements = new Map<string, GenericElementInfo>([
  ['ComboBox', { numberOfGenerics: 1 }],
  ['ComboBoxLight', { numberOfGenerics: 1 }],
  ['Crud', { numberOfGenerics: 1 }],
  ['Dashboard', { numberOfGenerics: 1, typeConstraints: ['DashboardItem'] }],
  ['Grid', { numberOfGenerics: 1 }],
  ['GridColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridFilterColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridPro', { numberOfGenerics: 1 }],
  ['GridProEditColumn', { numberOfGenerics: 1 }],
  ['GridSelectionColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridSortColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridTreeColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['MultiSelectComboBox', { numberOfGenerics: 1 }],
  ['VirtualList', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
]);

export type EventSettings = Readonly<{
  remove?: readonly string[];
  makeUnknown?: readonly string[];
}>;

export const eventSettings = new Map<string, EventSettings>([
  ['AppLayout', { remove: ['close-overlay-drawer'] }],
  ['Checkbox', { remove: ['value-changed'] }],
  ['ComboBox', { remove: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['ComboBoxLight', { remove: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['CrudEdit', { makeUnknown: ['edit'] }],
  ['Grid', { makeUnknown: ['size-changed', 'data-provider-changed'] }],
  [
    'GridPro',
    { makeUnknown: ['size-changed', 'data-provider-changed', 'enter-next-row-changed', 'single-cell-edit-changed'] },
  ],
  ['GridProEditColumn', { makeUnknown: ['editor-type-changed'] }],
  [
    'MultiSelectComboBox',
    {
      remove: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'],
    },
  ],
  ['RadioButton', { remove: ['value-changed'] }],
]);

export const elementsWithMissingEntrypoint = new Set<string>([]);

export const elementToClassNamingConventionViolations = new Map<string, string>([['vaadin-tabsheet', 'TabSheet']]);
