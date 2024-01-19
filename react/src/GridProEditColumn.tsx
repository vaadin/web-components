import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  createElement,
} from 'react';
import type { GridBodyRenderer, GridDefaultItem } from './generated/Grid.js';
import type { GridColumnElement } from './generated/GridColumn.js';
import {
  GridProEditColumn as _GridProEditColumn,
  type GridProEditColumnElement,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridProEditColumn.js';

export type GridProEditColumnProps<TItem> = Partial<
  Omit<
    _GridProEditColumnProps<TItem>,
    | 'children'
    | 'editModeRenderer'
    | 'footerRenderer'
    | 'header'
    | 'headerRenderer'
    | 'renderer'
    | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    editModeRenderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    header?: ReactNode;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

type ReactBodyRenderer<TItem> = ComponentType<GridBodyReactRendererProps<TItem>> & {
  __wrapperRenderer?: ReactBodyRenderer<TItem>;
};

type EditColumnRendererRoot = HTMLElement & { __editColumnRenderer?: GridBodyRenderer };

type ClearFunction = (arg0: HTMLElement & { _content: EditColumnRendererRoot }) => void;

/**
 * Wraps a React renderer function to render empty when requested
 *
 * @returns
 */
function editColumnReactRenderer<TItem>(reactBodyRenderer?: ReactBodyRenderer<TItem> | null) {
  if (!reactBodyRenderer) {
    return undefined;
  }

  reactBodyRenderer.__wrapperRenderer ||= function GridProEditColumnRenderer(props) {
    // If the model has __renderEmpty set, return null, otherwise call the original renderer
    return '__renderEmpty' in props.model ? null : createElement(reactBodyRenderer, props);
  };

  return reactBodyRenderer.__wrapperRenderer;
}

/**
 * Wraps a Grid body renderer function to make it request empty render before
 * the GridPro edit column clears cell content.
 */
function editColumnRenderer(bodyRenderer?: (GridBodyRenderer & { __wrapperRenderer?: GridBodyRenderer }) | null) {
  if (!bodyRenderer) {
    return undefined;
  }

  bodyRenderer.__wrapperRenderer ||= (
    root: EditColumnRendererRoot,
    column: GridColumnElement & {
      __originalClearCellContent?: ClearFunction;
      _clearCellContent?: ClearFunction;
    },
    model,
  ) => {
    // Patch the column's _clearCellContent function which is called internally by grid-pro
    // when switching from edit mode to view mode and vice versa
    if (!column.__originalClearCellContent) {
      column.__originalClearCellContent = column._clearCellContent;

      column._clearCellContent = (cell) => {
        const cellRoot = cell._content;
        // Call the original renderer with __renderEmpty set to true to clear the content it manages
        cellRoot.__editColumnRenderer?.(cellRoot, column, Object.assign({}, model, { __renderEmpty: true }));
        // Call the original clearCellContent function to manually clear the cell content
        column.__originalClearCellContent?.(cell);
      };
    }

    // Update the cell content's renderer reference so that the correct one is used
    // to render empty when the cell is cleared
    root.__editColumnRenderer = bodyRenderer;

    // Call the original renderer
    bodyRenderer(root, column, model);
  };

  return bodyRenderer.__wrapperRenderer;
}

function GridProEditColumn<TItem = GridDefaultItem>(
  { children, footer, header, ...props }: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnElement<TItem>>,
): ReactElement | null {
  const [editModePortals, editModeRenderer] = useModelRenderer(editColumnReactRenderer(props.editModeRenderer), {
    renderSync: true,
  });
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(editColumnReactRenderer(props.renderer ?? children), {
    renderSync: true,
  });

  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={editColumnRenderer(editModeRenderer)}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={editColumnRenderer(bodyRenderer)}
    >
      {editModePortals}
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridProEditColumn>
  );
}

const ForwardedGridProEditColumn = forwardRef(GridProEditColumn) as <TItem = GridDefaultItem>(
  props: GridProEditColumnProps<TItem> & RefAttributes<GridProEditColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridProEditColumn as GridProEditColumn };
