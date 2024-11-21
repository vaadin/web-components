/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { type ForwardedRef, forwardRef, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import { flushSync } from 'react-dom';
import type { GridDefaultItem } from '@vaadin/react-components/Grid.js';
import type { GridColumnProps } from '@vaadin/react-components/GridColumn.js';
import {
  GridProEditColumn as _GridProEditColumn,
  type GridProEditColumnElement,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import { useModelRenderer } from '@vaadin/react-components/renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from '@vaadin/react-components/renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from '@vaadin/react-components/GridColumn.js';
import useMergedRefs from '@vaadin/react-components/utils/useMergedRefs.js';

export * from './generated/GridProEditColumn.js';

type GridColumnRenderer<TItem> = GridColumnProps<TItem>['renderer'];
type GridColumnHeaderFooterRenderer<TItem> = GridColumnProps<TItem>['footerRenderer'];

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
    children?: GridColumnRenderer<TItem>;
    editModeRenderer?: GridColumnRenderer<TItem>;
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: GridColumnHeaderFooterRenderer<TItem>;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: GridColumnHeaderFooterRenderer<TItem>;
    renderer?: GridColumnRenderer<TItem>;
  }>;

type GridProEditColumnElementInternals<TItem> = {
  _clearCellContent(cell: HTMLElement & { [SKIP_CLEARING_CELL_CONTENT]?: boolean }): void;
  _renderEditor(cell: HTMLElement & { [SKIP_CLEARING_CELL_CONTENT]?: boolean }, model: { item: TItem }): void;
  _removeEditor(cell: HTMLElement & { [SKIP_CLEARING_CELL_CONTENT]?: boolean }, model: { item: TItem }): void;
};

const SKIP_CLEARING_CELL_CONTENT = Symbol();

function GridProEditColumn<TItem = GridDefaultItem>(
  { children, footer, header, ...props }: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnElement<TItem>>,
): ReactElement | null {
  const [editedItem, setEditedItem] = useState<TItem | null>(null);

  const [editModePortals, editModeRenderer] = useModelRenderer(props.editModeRenderer, {
    // The web component implementation currently requires the editor to be rendered synchronously.
    renderMode: 'sync',
    shouldRenderPortal: (_root, _column, model) => editedItem === model.item,
  });
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderMode: 'microtask',
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderMode: 'microtask',
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? children, {
    renderMode: 'microtask',
    shouldRenderPortal: (_root, _column, model) => editedItem !== model.item,
  });

  const innerRef = useRef<GridProEditColumnElement<TItem> & GridProEditColumnElementInternals<TItem>>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  useLayoutEffect(() => {
    innerRef.current!._clearCellContent = function (cell) {
      // Clearing cell content in _renderEditor and _removeEditor is decided
      // based on whether the content was rendered by a React renderer or not.
      if (!cell[SKIP_CLEARING_CELL_CONTENT]) {
        Object.getPrototypeOf(this)._clearCellContent.call(this, cell);
      }
    };
  }, []);

  useLayoutEffect(() => {
    innerRef.current!._renderEditor = function (cell, model) {
      // Manually clear the cell content only if it was rendered by the default grid renderer.
      // For content rendered by a React renderer, clearing is handled by removing the portal.
      if (!bodyRenderer) {
        this._clearCellContent(cell);
      }

      // Ensure the corresponding bodyRenderer portal is removed and the editModeRenderer portal
      // is added instead.
      flushSync(() => {
        setEditedItem(model.item);
      });

      cell[SKIP_CLEARING_CELL_CONTENT] = true;
      Object.getPrototypeOf(this)._renderEditor.call(this, cell, model);
      cell[SKIP_CLEARING_CELL_CONTENT] = false;
    };
  }, [bodyRenderer]);

  useLayoutEffect(() => {
    innerRef.current!._removeEditor = function (cell, model) {
      // Manually clear the cell content only if it was rendered by the default grid renderer.
      // For content rendered by a React renderer, clearing is handled by removing the portal.
      if (!editModeRenderer) {
        this._clearCellContent(cell);
      }

      // Ensure the editModeRenderer portal is removed and the corresponding bodyRenderer portal
      // is added again. Please note the bodyRenderer portal will be added synchronously even though
      // the renderer has renderMode set to microtask. It's because the portal already has content
      // from the previous render cycle and we just show it again.
      flushSync(() => {
        setEditedItem((editedItem) => {
          return editedItem === model.item ? null : editedItem;
        });
      });

      cell[SKIP_CLEARING_CELL_CONTENT] = true;
      Object.getPrototypeOf(this)._removeEditor.call(this, cell, model);
      cell[SKIP_CLEARING_CELL_CONTENT] = false;
    };
  }, [editModeRenderer]);

  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={editModeRenderer}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={finalRef}
      renderer={bodyRenderer}
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
