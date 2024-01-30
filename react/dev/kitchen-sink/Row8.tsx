import { BoardRow } from '../../packages/react-components-pro/src/BoardRow.js';
import { Item } from '../../packages/react-components/src/Item.js';
import { ListBox } from '../../packages/react-components/src/ListBox.js';
import { RadioButton } from '../../packages/react-components/src/RadioButton.js';
import { RadioGroup } from '../../packages/react-components/src/RadioGroup.js';
import { RichTextEditor } from '../../packages/react-components-pro/src/RichTextEditor.js';
import { Select } from '../../packages/react-components/src/Select.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';

function SelectListBox() {
  return (
    <ListBox>
      <Item value="1">One</Item>
      <Item value="2">Two</Item>
    </ListBox>
  );
}

export default function Row8() {
  return (
    <BoardRow>
      <RadioGroup>
        <RadioButton>
          <label slot="label">One</label>
        </RadioButton>
        <RadioButton>
          <label slot="label">Two</label>
        </RadioButton>
      </RadioGroup>
      <RichTextEditor></RichTextEditor>
      <Select label="Select" value="2">
        {SelectListBox}
        <span slot="prefix">+</span>
        <Tooltip slot="tooltip" text="Select tooltip"></Tooltip>
      </Select>
    </BoardRow>
  );
}
