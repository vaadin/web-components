import { useState } from 'react';
import { BoardRow } from '../../src/BoardRow.js';
import { Checkbox } from '../../src/Checkbox.js';
import { CheckboxGroup } from '../../src/CheckboxGroup.js';
import { ComboBox } from '../../src/ComboBox.js';
import { ConfirmDialog } from '../../src/ConfirmDialog.js';
import { MultiSelectComboBox } from '../../src/MultiSelectComboBox.js';

function CheckboxesWithListener() {
  const [checked, setChecked] = useState('first');

  return (
    <CheckboxGroup
      label="Checkboxes With Listener"
      value={[checked]}
      onValueChanged={({ detail: { value } }) => setChecked(value[0])}
    >
      <Checkbox value="first">First One</Checkbox>
      <Checkbox value="second">Second One</Checkbox>
      <Checkbox value="third">Third One</Checkbox>
      <Checkbox value="fourth">Fourth One</Checkbox>
    </CheckboxGroup>
  );
}

export default function Row2() {
  return (
    <BoardRow>
      <CheckboxesWithListener />
      <CheckboxGroup label="CheckboxGroup">
        <Checkbox value="accept_terms" label="Accept Terms"></Checkbox>
      </CheckboxGroup>
      <ComboBox label="ComboBox" items={['foo', 'bar']}></ComboBox>
      <MultiSelectComboBox label="MultiSelectComboBox" items={['foo', 'bar', 'baz']}></MultiSelectComboBox>
      <ConfirmDialog></ConfirmDialog>
    </BoardRow>
  );
}
