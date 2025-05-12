import '@vaadin/icons';
import { useMemo, useRef, useState } from 'react';
import { DatePicker, type DatePickerElement } from '../../packages/react-components/src/DatePicker.js';
import { Icon } from '../../packages/react-components/src/Icon.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';

export default function DatePickerPage() {
  const [label, setLabel] = useState('Label');
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [value, setValue] = useState('');
  const [helperText, setHelperText] = useState('Helper text');
  const [errorMessage, setErrorMessage] = useState('Error message');
  const [minDate, setMinDate] = useState(''); // YYYY-MM-DD
  const [maxDate, setMaxDate] = useState(''); // YYYY-MM-DD
  const [initialPos, setInitialPos] = useState(''); // YYYY-MM-DD
  const [todayLabel, setTodayLabel] = useState('Today');
  const [cancelLabel, setCancelLabel] = useState('Cancel');

  const [invalid, setInvalid] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false);
  const [clearButtonVisible, setClearButtonVisible] = useState(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0); // 0 = Sunday, 1 = Monday

  const [usePrefix, setUsePrefix] = useState(false);
  const [useTooltip, setUseTooltip] = useState(false);
  const [theme, setTheme] = useState('');

  const [eventLog, setEventLog] = useState<string[]>([]);
  const datePickerRef = useRef<DatePickerElement>(null);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  const i18n = useMemo(
    () => ({
      firstDayOfWeek: firstDayOfWeek,
      today: todayLabel,
      cancel: cancelLabel,
    }),
    [firstDayOfWeek, todayLabel, cancelLabel],
  );

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>DatePicker</h1>
        <DatePicker
          ref={datePickerRef}
          label={label}
          placeholder={placeholder}
          value={value}
          onValueChanged={(e) => {
            setValue(e.detail.value);
            logEvent(`value-changed: ${e.detail.value}`);
          }}
          onChange={(e: Event) => {
            const target = e.target as HTMLInputElement;
            logEvent(`change: ${target.value}`);
          }}
          onInput={(e: Event) => {
            const target = e.target as HTMLInputElement;
            logEvent(`input: ${target.value}`);
          }}
          min={minDate}
          max={maxDate}
          initialPosition={initialPos}
          helperText={helperText}
          errorMessage={errorMessage}
          invalid={invalid}
          onInvalidChanged={(e: CustomEvent<{ value: boolean }>) => {
            setInvalid(e.detail.value);
            logEvent(`invalid-changed: ${e.detail.value}`);
          }}
          onValidated={(e: CustomEvent<{ valid: boolean }>) => {
            logEvent(`validated (valid=${e.detail.valid})`);
          }}
          readonly={readonly}
          disabled={disabled}
          required={required}
          autoOpenDisabled={autoOpenDisabled}
          clearButtonVisible={clearButtonVisible}
          showWeekNumbers={showWeekNumbers}
          theme={theme}
          i18n={i18n}
        >
          {usePrefix ? <Icon slot="prefix" icon="vaadin:calendar" /> : null}
          {useTooltip ? <Tooltip slot="tooltip" text="This is a tooltip for the DatePicker" /> : null}
        </DatePicker>

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
          Min Date (YYYY-MM-DD): <input type="text" value={minDate} onChange={(e) => setMinDate(e.target.value)} />
        </label>
        <label>
          Max Date (YYYY-MM-DD): <input type="text" value={maxDate} onChange={(e) => setMaxDate(e.target.value)} />
        </label>
        <label>
          Initial Position (YYYY-MM-DD):{' '}
          <input type="text" value={initialPos} onChange={(e) => setInitialPos(e.target.value)} />
        </label>
        <label>
          Theme:{' '}
          <input
            type="text"
            value={theme}
            placeholder="e.g. small helper-above-field"
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        <label>
          First Day of Week (0=Sun, 1=Mon):{' '}
          <input
            type="number"
            value={firstDayOfWeek}
            min="0"
            max="6"
            onChange={(e) => setFirstDayOfWeek(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          Today Label: <input type="text" value={todayLabel} onChange={(e) => setTodayLabel(e.target.value)} />
        </label>
        <label>
          Cancel Label: <input type="text" value={cancelLabel} onChange={(e) => setCancelLabel(e.target.value)} />
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
          <input type="checkbox" checked={autoOpenDisabled} onChange={() => setAutoOpenDisabled(!autoOpenDisabled)} />{' '}
          Auto Open Disabled
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
          <input type="checkbox" checked={showWeekNumbers} onChange={() => setShowWeekNumbers(!showWeekNumbers)} /> Show
          Week Numbers
        </label>
        <label>
          <input type="checkbox" checked={usePrefix} onChange={() => setUsePrefix(!usePrefix)} /> Use Prefix Icon
        </label>
        <label>
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use Tooltip
        </label>
      </div>

      {/* Event log section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Event Log</h2>
        <div
          style={{
            height: '400px',
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
