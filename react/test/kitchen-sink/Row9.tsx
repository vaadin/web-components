import { BoardRow } from '../../src/BoardRow.js';
import { SplitLayout } from '../../src/SplitLayout.js';
import { TextArea } from '../../src/TextArea.js';
import { Tooltip } from '../../src/Tooltip.js';
import { Upload } from '../../src/Upload.js';
import { VirtualList } from '../../src/VirtualList.js';

export default function Row9() {
  return (
    <BoardRow>
      <SplitLayout>
        <TextArea label="Text Area"></TextArea>
        <Tooltip text="Tooltip">Tooltip content</Tooltip>
      </SplitLayout>
      <Upload></Upload>
      <VirtualList></VirtualList>
    </BoardRow>
  );
}
