import { GridFilter, GridSorter } from '@vaadin/vaadin-grid/@types/interfaces'

export type CrudDataProviderCallback = (
  items: Array<CrudItem>,
  size?: number
) => void;

export type CrudDataProviderParams = {
  page: number;
  pageSize: number;
  filters: Array<GridFilter>;
  sortOrders: Array<GridSorter>;
};

export type CrudDataProvider = (
  params: CrudDataProviderParams,
  callback: CrudDataProviderCallback
) => void;

export type CrudEditorPosition = '' | 'bottom' | 'aside';

export type CrudItem = unknown;

export interface CrudI18n {
  newItem: string;
  editItem: string;
  saveItem: string;
  cancel: string;
  deleteItem: string;
  editLabel: string;
  confirm: {
    delete: {
      title: string;
      content: string;
      button: {
        confirm: string;
        dismiss: string;
      }
    },
    cancel: {
      title: string;
      content: string;
      button: {
        confirm: string;
        dismiss: string;
      }
    }
  }
}
