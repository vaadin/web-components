import { BoardRow } from '../../src/BoardRow.js';
import { Item } from '../../src/Item.js';
import { ListBox } from '../../src/ListBox.js';
import { RadioButton } from '../../src/RadioButton.js';
import { RadioGroup } from '../../src/RadioGroup.js';
import { RichTextEditor } from '../../src/RichTextEditor.js';
import { Select } from '../../src/Select.js';

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
      <Select
        label="Select"
        value="2"
        items={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
        renderer={SelectListBox}
      />
    </BoardRow>
  );
}
