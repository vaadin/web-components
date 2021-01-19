export type FormLayoutLabelsPosition = 'aside' | 'top';

export type FormLayoutResponsiveStep = {
  minWidth?: string | 0;
  columns: number;
  labelsPosition?: FormLayoutLabelsPosition;
};
