import { BoardRow } from '../../src/BoardRow.js';
import { CustomField } from '../../src/CustomField.js';
import { DatePicker } from '../../src/DatePicker.js';
import { DateTimePicker } from '../../src/DateTimePicker.js';
import { Details } from '../../src/Details.js';
import { FormItem } from '../../src/FormItem.js';
import { FormLayout } from '../../src/FormLayout.js';
import { IntegerField } from '../../src/IntegerField.js';
import { NumberField } from '../../src/NumberField.js';
import { PasswordField } from '../../src/PasswordField.js';
import { TextField } from '../../src/TextField.js';
import { TimePicker } from '../../src/TimePicker.js';

export default function Row4() {
  return (
    <BoardRow>
      <CustomField label="Custom field">
        <TextField placeholder="Text"></TextField>
        <NumberField placeholder="Number"></NumberField>
        <IntegerField placeholder="Integer"></IntegerField>
        <PasswordField placeholder="Password"></PasswordField>
      </CustomField>
      <Details opened>
        <label slot="summary">Details</label>
        <p>Details content</p>
      </Details>
      <FormLayout>
        <FormItem>
          <label slot="label">Form item</label>
          <output>value</output>
        </FormItem>
        <DatePicker label="DatePicker"></DatePicker>
        <TimePicker label="TimePicker"></TimePicker>
        <DateTimePicker label="DateTimePicker"></DateTimePicker>
      </FormLayout>
    </BoardRow>
  );
}
