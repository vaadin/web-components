declare function A11yMixin<T extends new (...args: any[]) => {}>(base: T): T & A11yMixinConstructor;

interface A11yMixinConstructor {
  new (...args: any[]): A11yMixin;
}

interface A11yMixin {
  _a11yUpdateHeaderRows(): void;

  _a11yUpdateFooterRows(): void;

  _a11yUpdateRowRowindex(row: HTMLElement, index: number): void;

  _a11yUpdateRowSelected(row: HTMLElement, selected: boolean): void;

  _a11yUpdateRowLevel(row: HTMLElement, level: number): void;

  _a11yUpdateRowDetailsOpened(row: HTMLElement, detailsOpened: boolean): void;

  _a11ySetRowDetailsCell(row: HTMLElement, detailsCell: HTMLElement): void;

  _a11yUpdateCellColspan(cell: any, colspan: number): void;

  _a11yUpdateSorters(): void;
}

export { A11yMixin, A11yMixinConstructor };
