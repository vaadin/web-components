import { Grid, type GridDataProvider } from '../../src/Grid.js';
import { GridSelectionColumn } from '../../src/GridSelectionColumn.js';
import { GridTreeColumn } from '../../src/GridTreeColumn.js';
import { GridColumn, GridColumnElement } from '../../src/GridColumn.js';
import { Tooltip } from '../../src/Tooltip.js';

type Item = {
  name: string;
  children: boolean;
};

const dataProvider: GridDataProvider<Item> = ({ parentItem, page, pageSize }, cb) => {
  const levelSize = parentItem ? 5 : 100;

  const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
    const indexInLevel = page * pageSize + i;

    return {
      name: `${parentItem ? parentItem.name + '-' : ''}${indexInLevel}`,
      children: true,
    };
  });

  cb(pageItems, levelSize);
};

const tooltipGenerator = ({ column, item }: Record<string, unknown>) => {
  const columnPath = (column as GridColumnElement)?.path;
  const itemName = (item as Item)?.name;
  return columnPath && itemName ? `Tooltip ${columnPath} ${itemName}` : '';
};

export default function () {
  return (
    <Grid itemIdPath="name" dataProvider={dataProvider}>
      <GridSelectionColumn frozen autoSelect dragSelect />
      <GridTreeColumn frozen path="name" width="200px" />
      <GridColumn path="name" width="200px" />
      <GridColumn path="name" width="200px" />
      <GridColumn path="name" width="200px" />

      <Tooltip slot="tooltip" hoverDelay={500} hideDelay={500} generator={tooltipGenerator} />
    </Grid>
  );
}
