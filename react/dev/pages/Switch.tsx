import { Switch } from '../../packages/react-components/src/Switch.js';
import { useState } from 'react';
import type { SwitchCheckedChangedEvent } from '@vaadin/switch';

export default function SwitchPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [label, setLabel] = useState('Notifications');
  const [helperText, setHelperText] = useState('');
  const [theme, setTheme] = useState('');
  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}
    >
      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>Switch</h1>
        <Switch
          checked={checked}
          disabled={disabled}
          readonly={readonly}
          label={label}
          helperText={helperText || undefined}
          theme={theme || undefined}
          onCheckedChanged={(e: SwitchCheckedChangedEvent) => {
            setChecked(e.detail.value);
            logEvent(`checked-changed: ${e.detail.value}`);
          }}
        />
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label>
          Label: <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          Helper text: <input value={helperText} onChange={(e) => setHelperText(e.target.value)} />
        </label>
        <label>
          Theme: <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. small" />
        </label>
        <label>
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} /> Checked
        </label>
        <label>
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} /> Disabled
        </label>
        <label>
          <input type="checkbox" checked={readonly} onChange={(e) => setReadonly(e.target.checked)} /> Readonly
        </label>
      </div>

      {/* Event Log section */}
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
          {eventLog.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
