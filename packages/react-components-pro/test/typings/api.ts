import React, { type HTMLAttributes } from 'react';
import { GridColumn, type GridColumnElement } from '../../../react-components/src/GridColumn.js';
import { GridColumnGroup } from '../../../react-components/src/GridColumnGroup.js';
import { GridFilterColumn } from '../../../react-components/src/GridFilterColumn.js';
import { GridSelectionColumn } from '../../../react-components/src/GridSelectionColumn.js';
import { GridSortColumn } from '../../../react-components/src/GridSortColumn.js';
import { GridTreeColumn } from '../../../react-components/src/GridTreeColumn.js';
import { ChartSeries, type ChartSeriesElement } from '../../src/ChartSeries.js';
import { GridProEditColumn } from '../../src/GridProEditColumn.js';

const assertOmitted = <C, T>(prop: keyof Omit<C, keyof T>) => prop;

const gridColumnProps = React.createElement(GridColumn, {}).props;
const gridColumnGroupProps = React.createElement(GridColumnGroup, {}).props;
const gridTreeColumnProps = React.createElement(GridTreeColumn, {}).props;
const gridSortColumnProps = React.createElement(GridSortColumn, {}).props;
const gridFilterColumnProps = React.createElement(GridFilterColumn, {}).props;
const gridSelectionColumnProps = React.createElement(GridSelectionColumn, {}).props;
const gridProEditColumnProps = React.createElement(GridProEditColumn, {}).props;

type AllColumnsProps = typeof gridColumnGroupProps &
  typeof gridColumnProps &
  typeof gridTreeColumnProps &
  typeof gridSortColumnProps &
  typeof gridFilterColumnProps &
  typeof gridSelectionColumnProps &
  typeof gridProEditColumnProps;

// Some omitted HTMLAttributes properties
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('style');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('aria-label');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('contentEditable');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('translate');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('draggable');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('role');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('onClick');

const chartSeriesProps = React.createElement(ChartSeries, {}).props;
type ChartSeriesProps = typeof chartSeriesProps;

assertOmitted<HTMLAttributes<ChartSeriesElement>, ChartSeriesProps>('style');
assertOmitted<HTMLAttributes<ChartSeriesElement>, ChartSeriesProps>('contentEditable');
assertOmitted<HTMLAttributes<ChartSeriesElement>, ChartSeriesProps>('onClick');
