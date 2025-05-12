import { Accordion } from '../../packages/react-components/src/Accordion.js';
import { AccordionPanel } from '../../packages/react-components/src/AccordionPanel.js';
import { AccordionHeading } from '../../packages/react-components/src/AccordionHeading.js';
import { VerticalLayout } from '../../packages/react-components/src/VerticalLayout.js';
import { HorizontalLayout } from '../../packages/react-components/src/HorizontalLayout.js';
import { Button } from '../../packages/react-components/src/Button.js';
import { TextField } from '../../packages/react-components/src/TextField.js';
import { TextArea } from '../../packages/react-components/src/TextArea.js';
import { Checkbox } from '../../packages/react-components/src/Checkbox.js';
import { useState } from 'react';
import type { AccordionOpenedChangedEvent } from '@vaadin/accordion';

interface PanelState {
  summary: string;
  content: string;
  disabled: boolean;
  useCustomHeading: boolean;
}

const initialPanels: PanelState[] = [
  {
    summary: 'Personal Information',
    content: 'Sophia Williams\nsophia.williams@company.com\n(501) 555-9128',
    disabled: false,
    useCustomHeading: false,
  },
  {
    summary: 'Billing Address',
    content: '4027 Amber Lake Canyon\n72333-5884 Cozy Nook\nArkansas',
    disabled: false,
    useCustomHeading: false,
  },
  {
    summary: 'Payment',
    content: 'MasterCard\n1234 5678 9012 3456\nExpires 06/21',
    disabled: false,
    useCustomHeading: false,
  },
];

export default function AccordionPage() {
  const [openedIndex, setOpenedIndex] = useState<number | null>(0);
  const [panels, setPanels] = useState<PanelState[]>(initialPanels);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  const handlePanelChange = (index: number, field: string, value: any) => {
    const newPanels = [...panels];
    newPanels[index] = { ...newPanels[index], [field]: value };
    setPanels(newPanels);
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
        <h1>Accordion</h1>
        <Accordion
          opened={openedIndex}
          onOpenedChanged={(e: AccordionOpenedChangedEvent) => {
            setOpenedIndex(e.detail.value);
            logEvent(`opened-changed: ${e.detail.value}`);
          }}
        >
          {panels.map((panel, index) => (
            <AccordionPanel
              key={index}
              summary={panel.useCustomHeading ? undefined : panel.summary}
              disabled={panel.disabled}
            >
              {panel.useCustomHeading && (
                <AccordionHeading slot="summary">
                  <HorizontalLayout style={{ width: '100%', alignItems: 'center', gap: 'var(--lumo-space-s)' }}>
                    <span>{panel.summary}</span>
                    <span
                      style={{
                        fontSize: 'var(--lumo-font-size-s)',
                        color: 'var(--lumo-secondary-text-color)',
                        marginLeft: 'auto',
                      }}
                    >
                      {panel.disabled ? '(Disabled)' : openedIndex === index ? 'Open' : 'Closed'}
                    </span>
                  </HorizontalLayout>
                </AccordionHeading>
              )}
              <VerticalLayout>
                {panel.content.split('\n').map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </VerticalLayout>
            </AccordionPanel>
          ))}
        </Accordion>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label>
          Opened Index (null for all closed):{' '}
          <input
            type="number"
            value={openedIndex === null ? '' : String(openedIndex)}
            onChange={(e) => setOpenedIndex(e.target.value === '' ? null : parseInt(e.target.value, 10))}
            placeholder="e.g., 0, 1, null"
          />
        </label>
        <Button onClick={() => setOpenedIndex(null)}>Close All Panels</Button>

        {panels.map((panel, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h4>Panel {index + 1}</h4>
            <TextField
              label="Summary"
              value={panel.summary}
              onValueChanged={(e) => handlePanelChange(index, 'summary', e.detail.value)}
              style={{ width: '100%' }}
            />
            <TextArea
              label="Content (multiline)"
              value={panel.content}
              onValueChanged={(e) => handlePanelChange(index, 'content', e.detail.value)}
              style={{ width: '100%' }}
            />
            <Checkbox
              label="Disabled"
              checked={panel.disabled}
              onCheckedChanged={(e) => handlePanelChange(index, 'disabled', e.detail.value)}
            />
            <Checkbox
              label="Use Custom Heading"
              checked={panel.useCustomHeading}
              onCheckedChanged={(e) => handlePanelChange(index, 'useCustomHeading', e.detail.value)}
            />
          </div>
        ))}
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
