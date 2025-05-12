import type { TimePickerElement } from '../../packages/react-components/src/TimePicker.js';
import { TimePicker } from '../../packages/react-components/src/TimePicker.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';
import { useState } from 'react';

export default function TimePickerPage() {
  const [value, setValue] = useState('12:30');
  const [opened, setOpened] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [helperText, setHelperText] = useState('Helper text');
  const [errorMessage, setErrorMessage] = useState('Error message');
  const [readonly, setReadonly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState('Label');
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [required, setRequired] = useState(false);
  const [useTooltip, setUseTooltip] = useState(false);
  const [clearButtonVisible, setClearButtonVisible] = useState(false);
  const [usePrefix, setUsePrefix] = useState(false);
  const [step, setStep] = useState(3600); // Default: 1 hour (3600 seconds)
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false);

  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>Time Picker</h1>
        <TimePicker
          label={label}
          placeholder={placeholder}
          value={value}
          opened={opened}
          onOpenedChanged={(e) => {
            setOpened(e.detail.value);
            logEvent(`opened-changed: ${e.detail.value}`);
          }}
          onValueChanged={(e) => {
            setValue(e.detail.value);
            logEvent(`value-changed: ${e.detail.value}`);
          }}
          onChange={(e) => {
            logEvent(`change: ${e.target.value}`);
          }}
          invalid={invalid}
          onInvalidChanged={(e) => {
            setInvalid(e.detail.value);
            logEvent(`invalid-changed: ${e.detail.value}`);
          }}
          onValidated={(e) => {
            const field = e.target as TimePickerElement;
            logEvent(`validated (valid=${!field.invalid})`);
          }}
          helperText={helperText}
          errorMessage={errorMessage}
          readonly={readonly}
          disabled={disabled}
          required={required}
          clearButtonVisible={clearButtonVisible}
          step={step}
          min={min || undefined}
          max={max || undefined}
          autoOpenDisabled={autoOpenDisabled}
        >
          {usePrefix ? (
            <div slot="prefix" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🕒</span>
            </div>
          ) : null}
          {useTooltip ? <Tooltip slot="tooltip" text="This is a tooltip" /> : null}
        </TimePicker>

        <div>Selected Value: {value}</div>
        <button onClick={() => setValue('')} style={{ marginTop: '10px' }}>
          Clear Value
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
          Min Time: <input type="text" value={min} onChange={(e) => setMin(e.target.value)} placeholder="e.g. 08:00" />
        </label>
        <label>
          Max Time: <input type="text" value={max} onChange={(e) => setMax(e.target.value)} placeholder="e.g. 18:00" />
        </label>
        <label>
          Step (seconds):
          <select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            <option value="1">1 second</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="900">15 minutes</option>
            <option value="1800">30 minutes</option>
            <option value="3600">1 hour</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={opened} onChange={() => setOpened(!opened)} /> Opened
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
          <input type="checkbox" checked={required} onChange={() => setRequired(!required)} /> Required
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
          <input type="checkbox" checked={autoOpenDisabled} onChange={() => setAutoOpenDisabled(!autoOpenDisabled)} />{' '}
          Auto Open Disabled
        </label>
        <label>
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use Tooltip
        </label>
        <label>
          <input type="checkbox" checked={usePrefix} onChange={() => setUsePrefix(!usePrefix)} /> Use Prefix
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
