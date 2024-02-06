import { BoardRow } from '../../packages/react-components/src/BoardRow.js';
import { CustomField } from '../../packages/react-components/src/CustomField.js';
import { DatePicker } from '../../packages/react-components/src/DatePicker.js';
import { DateTimePicker } from '../../packages/react-components/src/DateTimePicker.js';
import { Details } from '../../packages/react-components/src/Details.js';
import { DetailsSummary } from '../../packages/react-components/src/DetailsSummary.js';
import { FormItem } from '../../packages/react-components/src/FormItem.js';
import { FormLayout } from '../../packages/react-components/src/FormLayout.js';
import { IntegerField } from '../../packages/react-components/src/IntegerField.js';
import { NumberField } from '../../packages/react-components/src/NumberField.js';
import { PasswordField } from '../../packages/react-components/src/PasswordField.js';
import { TextField } from '../../packages/react-components/src/TextField.js';
import { TimePicker } from '../../packages/react-components/src/TimePicker.js';

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
        <DetailsSummary slot="summary">Details</DetailsSummary>
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
