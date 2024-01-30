import { Grid, type GridDataProvider } from '../../packages/react-components/src/Grid.js';
import { GridSelectionColumn } from '../../packages/react-components/src/GridSelectionColumn.js';
import { GridTreeColumn } from '../../packages/react-components/src/GridTreeColumn.js';
import { GridColumn, GridColumnElement } from '../../packages/react-components/src/GridColumn.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';

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
