import {
  ConfirmDialog,
  type ConfirmDialogOpenedChangedEvent,
} from '../../packages/react-components/src/ConfirmDialog.js';
import { Button } from '../../packages/react-components/src/Button.js';
import { TextField } from '../../packages/react-components/src/TextField.js';
import { Checkbox } from '../../packages/react-components/src/Checkbox.js';
import { useState } from 'react';

export default function ConfirmDialogPage() {
  const [opened, setOpened] = useState(false);
  const [header, setHeader] = useState('Confirm Action');
  const [message, setMessage] = useState('Are you sure you want to perform this action?');
  const [cancelButtonVisible, setCancelButtonVisible] = useState(true);
  const [rejectButtonVisible, setRejectButtonVisible] = useState(true);
  const [rejectText, setRejectText] = useState('Discard');
  const [confirmText, setConfirmText] = useState('Confirm');
  const [confirmTheme, setConfirmTheme] = useState(''); // e.g., "primary error"
  const [noCloseOnEsc, setNoCloseOnEsc] = useState(false);

  const [status, setStatus] = useState<string>('');
  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  const handleOpenedChanged = (e: ConfirmDialogOpenedChangedEvent) => {
    setOpened(e.detail.value);
    logEvent(`opened-changed: ${e.detail.value}`);
    if (e.detail.value) {
      // Reset status when dialog is opened
      setStatus('');
    }
  };

  const handleConfirm = () => {
    setStatus('Confirmed');
    logEvent('confirm');
  };

  const handleCancel = () => {
    setStatus('Canceled');
    logEvent('cancel');
  };

  const handleReject = () => {
    setStatus('Rejected');
    logEvent('reject');
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>ConfirmDialog</h1>
        <Button onClick={() => setOpened(true)}>Open ConfirmDialog</Button>
        <ConfirmDialog
          opened={opened}
          onOpenedChanged={handleOpenedChanged}
          header={header}
          cancelButtonVisible={cancelButtonVisible}
          rejectButtonVisible={rejectButtonVisible}
          rejectText={rejectText}
          confirmText={confirmText}
          confirmTheme={confirmTheme}
          noCloseOnEsc={noCloseOnEsc}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onReject={handleReject}
        >
          {message}
        </ConfirmDialog>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <TextField label="Header" value={header} onValueChanged={(e) => setHeader(e.detail.value)} />
        <TextField label="Message (Content)" value={message} onValueChanged={(e) => setMessage(e.detail.value)} />
        <TextField label="Confirm Text" value={confirmText} onValueChanged={(e) => setConfirmText(e.detail.value)} />
        <TextField label="Reject Text" value={rejectText} onValueChanged={(e) => setRejectText(e.detail.value)} />
        <TextField
          label="Confirm Theme (e.g. primary, error, success)"
          value={confirmTheme}
          onValueChanged={(e) => setConfirmTheme(e.detail.value)}
          helperText="Space-separated theme names like 'primary error'"
        />
        <Checkbox
          label="Cancel Button Visible"
          checked={cancelButtonVisible}
          onCheckedChanged={(e) => setCancelButtonVisible(e.detail.value)}
        />
        <Checkbox
          label="Reject Button Visible"
          checked={rejectButtonVisible}
          onCheckedChanged={(e) => setRejectButtonVisible(e.detail.value)}
        />
        <Checkbox
          label="No Close on Esc"
          checked={noCloseOnEsc}
          onCheckedChanged={(e) => setNoCloseOnEsc(e.detail.value)}
        />

        <h3>Status</h3>
        <div>Current Status: {status || 'N/A'}</div>
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
