import { BoardRow } from '../../packages/react-components-pro/src/BoardRow.js';
import { TabSheet, TabSheetTab } from '../../packages/react-components/src/TabSheet.js';

export default function Row10() {
  return (
    <BoardRow>
      <TabSheet>
        <div slot="prefix">Prefix</div>
        <div slot="suffix">Suffix</div>

        <TabSheetTab label="Tab 1">
          <div>Panel 1</div>
        </TabSheetTab>

        <TabSheetTab label="Tab 2">
          <div>Panel 2</div>
        </TabSheetTab>

        <TabSheetTab label="Tab 3">
          <div>Panel 3</div>
        </TabSheetTab>
      </TabSheet>
    </BoardRow>
  );
}
