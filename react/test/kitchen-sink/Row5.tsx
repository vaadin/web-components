import type { CSSProperties } from 'react';
import { TextField } from '../../src/TextField.js';
import { BoardRow } from '../../src/BoardRow.js';
import { Grid, type GridDataProvider } from '../../src/Grid.js';
import { GridColumn } from '../../src/GridColumn.js';
import { GridColumnGroup } from '../../src/GridColumnGroup.js';
import { GridFilterColumn } from '../../src/GridFilterColumn.js';
import { GridPro } from '../../src/GridPro.js';
import { GridProEditColumn } from '../../src/GridProEditColumn.js';
import { GridSortColumn } from '../../src/GridSortColumn.js';
import { GridTreeColumn } from '../../src/GridTreeColumn.js';
import type { GridBodyReactRendererProps } from '../../src/renderers/grid.js';
import { crudData, type CrudDataItem } from './data.js';

type TreeGridDataItem = {
  id: number;
  size: number;
  name: string;
  children?: TreeGridDataItem[];
};

const treeGridData: TreeGridDataItem[] = [
  {
    id: 1,
    size: 20,
    name: 'Branch 1',
    children: [
      { id: 2, size: 5, name: 'Leaf 1' },
      { id: 3, size: 10, name: 'Leaf 2' },
    ],
  },
  {
    id: 4,
    size: 15,
    name: 'Branch 2',
    children: [
      { id: 5, size: 5, name: 'Leaf 1' },
      { id: 6, size: 10, name: 'Leaf 2' },
    ],
  },
  ...Array.from(new Array(1000)).map((_, index) => ({
    id: index + 10,
    size: index + 10,
    name: `Leaf ${index + 10}`,
  })),
];

function NameRenderer({ item: { name } }: GridBodyReactRendererProps<TreeGridDataItem>) {
  const [typePart, numberPart] = name.split(' ');
  return (
    <>
      <b>{typePart}</b>: {numberPart}
    </>
  );
}

const TreeGridDataProvider: GridDataProvider<TreeGridDataItem> = (params, callback) => {
  const items = params.parentItem ? params.parentItem.children || [] : treeGridData;
  const offset = params.page * params.pageSize;
  callback(items.slice(offset, offset + params.pageSize), items.length);
};

const displayColor: CSSProperties = { color: 'blueviolet' };

function Display({ item: { name } }: GridBodyReactRendererProps<CrudDataItem>) {
  return <div style={displayColor}>{name}</div>;
}

export default function Row5() {
  return (
    <BoardRow>
      <Grid dataProvider={TreeGridDataProvider} itemHasChildrenPath="children">
        <GridTreeColumn path="id"></GridTreeColumn>
        <GridColumnGroup>
          <GridSortColumn path="size"></GridSortColumn>
          <GridFilterColumn path="name" renderer={NameRenderer}></GridFilterColumn>
        </GridColumnGroup>
      </Grid>
      <GridPro<CrudDataItem> items={crudData}>
        <GridColumn<CrudDataItem> renderer={Display}></GridColumn>
        <GridColumn<CrudDataItem> path="size"></GridColumn>
        <GridProEditColumn<CrudDataItem>
          path="name"
          editModeRenderer={({ item }) => {
            console.log(item);
            return <TextField value={item.name} />;
          }}
        ></GridProEditColumn>
        <GridProEditColumn<CrudDataItem> path="name" editorType="text"></GridProEditColumn>
      </GridPro>
    </BoardRow>
  );
}
