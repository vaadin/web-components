import '@vaadin/icons';
import type { TextFieldInvalidChangedEvent, TextFieldValidatedEvent } from '@vaadin/text-field';
import { useState } from 'react';
import { Icon } from '../../packages/react-components/src/Icon.js';
import { TextField, type TextFieldElement } from '../../packages/react-components/src/TextField.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';

export default function TextFieldPage() {
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('Label');
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [helperText, setHelperText] = useState('Helper text');
  const [errorMessage, setErrorMessage] = useState('Error message');
  const [invalid, setInvalid] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [clearButtonVisible, setClearButtonVisible] = useState(false);
  const [required, setRequired] = useState(false);
  const [useTooltip, setUseTooltip] = useState(false);
  const [usePrefix, setUsePrefix] = useState(false);
  const [useSuffix, setUseSuffix] = useState(false);
  const [pattern, setPattern] = useState('');
  const [minlength, setMinlength] = useState<number | undefined>(undefined);
  const [maxlength, setMaxlength] = useState<number | undefined>(undefined);
  const [autoselect, setAutoselect] = useState(false);

  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>TextField</h1>
        <TextField
          label={label}
          placeholder={placeholder}
          value={value}
          onValueChanged={(e) => {
            setValue(e.detail.value);
            logEvent(`value-changed: ${e.detail.value}`);
          }}
          onChange={(e) => {
            logEvent(`change: ${(e.target as TextFieldElement).value}`);
          }}
          invalid={invalid}
          onInvalidChanged={(e: TextFieldInvalidChangedEvent) => {
            setInvalid(e.detail.value);
            logEvent(`invalid-changed: ${e.detail.value}`);
          }}
          onValidated={(e: CustomEvent) => {
            const detail = (e as TextFieldValidatedEvent).detail;
            logEvent(`validated (valid=${detail.valid})`);
          }}
          helperText={helperText}
          errorMessage={errorMessage}
          readonly={readonly}
          disabled={disabled}
          clearButtonVisible={clearButtonVisible}
          required={required}
          pattern={pattern}
          minlength={minlength}
          maxlength={maxlength}
          autoselect={autoselect}
        >
          {usePrefix ? <Icon slot="prefix" icon="vaadin:search" /> : null}
          {useSuffix ? <span slot="suffix">:)</span> : null}
          {useTooltip ? <Tooltip slot="tooltip" text="This is a tooltip" /> : null}
        </TextField>

        <div>Current Value: {value}</div>
        <button onClick={() => setValue('')} style={{ marginTop: '10px' }}>
          Clear Value Programmatically
        </button>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label>
          Label: <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          Placeholder: <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </label>
        <label>
          Helper Text: <input type="text" value={helperText} onChange={(e) => setHelperText(e.target.value)} />
        </label>
        <label>
          Error Message: <input type="text" value={errorMessage} onChange={(e) => setErrorMessage(e.target.value)} />
        </label>
        <label>
          Pattern (e.g., <code>^[A-Z].*</code>):{' '}
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </label>
        <label>
          Min Length:{' '}
          <input
            type="number"
            value={minlength ?? ''}
            onChange={(e) => setMinlength(e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </label>
        <label>
          Max Length:{' '}
          <input
            type="number"
            value={maxlength ?? ''}
            onChange={(e) => setMaxlength(e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </label>
        <label>
          <input type="checkbox" checked={invalid} onChange={() => setInvalid(!invalid)} /> Invalid
        </label>
        <label>
          <input type="checkbox" checked={readonly} onChange={() => setReadonly(!readonly)} /> Readonly
        </label>
        <label>
          <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} /> Disabled
        </label>
        <label>
          <input
            type="checkbox"
            checked={clearButtonVisible}
            onChange={() => setClearButtonVisible(!clearButtonVisible)}
          />{' '}
          Clear Button Visible
        </label>
        <label>
          <input type="checkbox" checked={required} onChange={() => setRequired(!required)} /> Required
        </label>
        <label>
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use tooltip
        </label>
        <label>
          <input type="checkbox" checked={usePrefix} onChange={() => setUsePrefix(!usePrefix)} /> Use Prefix Icon
        </label>
        <label>
          <input type="checkbox" checked={useSuffix} onChange={() => setUseSuffix(!useSuffix)} /> Use Suffix Text
        </label>
        <label>
          <input type="checkbox" checked={autoselect} onChange={() => setAutoselect(!autoselect)} /> Autoselect
        </label>
      </div>

      {/* Event log section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Event Log</h2>
        <div
          style={{
            height: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            background: '#f9f9f9',
          }}
        >
          {eventLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
