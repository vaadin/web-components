import { Select } from '../../packages/react-components/src/Select.js';
import type { SelectItem } from '../../packages/react-components/src/Select.js';
import { ListBox } from '../../packages/react-components/src/ListBox.js';
import { Item } from '../../packages/react-components/src/Item.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';
import { useEffect, useState } from 'react';
import type { SelectInvalidChangedEvent, SelectValidatedEvent } from '@vaadin/select';

const items: SelectItem[] = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { component: 'hr' },
  { label: 'Option 3', value: 'opt3', disabled: true },
  { label: 'Option 4', value: 'opt4' },
];

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  pictureUrl: string;
}

const peopleForCustomRendering: Person[] = [
  {
    id: 'p1',
    firstName: 'Alice',
    lastName: 'Smith',
    profession: 'Engineer',
    pictureUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
  },
  {
    id: 'p2',
    firstName: 'Bob',
    lastName: 'Johnson',
    profession: 'Designer',
    pictureUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: 'p3',
    firstName: 'Carol',
    lastName: 'Williams',
    profession: 'Manager',
    pictureUrl: 'https://randomuser.me/api/portraits/women/85.jpg',
  },
];

export default function SelectPage() {
  const [value, setValue] = useState('');
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
  const [useCustomRenderer, setUseCustomRenderer] = useState(false);
  const [useItemLabelInCustomRenderer, setUseItemLabelInCustomRenderer] = useState(true);
  const [usePrefix, setUsePrefix] = useState(false);

  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  useEffect(() => {
    setValue('');
  }, [useCustomRenderer]);

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>Select</h1>
        <Select
          label={label}
          placeholder={placeholder}
          items={useCustomRenderer ? undefined : items}
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
          onInvalidChanged={(e: SelectInvalidChangedEvent) => {
            setInvalid(e.detail.value);
            logEvent(`invalid-changed: ${e.detail.value}`);
          }}
          onValidated={(e: CustomEvent) => {
            const detail = (e as SelectValidatedEvent).detail;
            logEvent(`validated (valid=${detail.valid})`);
          }}
          helperText={helperText}
          errorMessage={errorMessage}
          readonly={readonly}
          disabled={disabled}
          required={required}
        >
          {usePrefix ? (
            <div slot="prefix" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🔍</span>
            </div>
          ) : null}
          {useTooltip ? <Tooltip slot="tooltip" text="This is a tooltip" /> : null}
          {useCustomRenderer ? (
            <ListBox>
              {peopleForCustomRendering.map((person) => (
                <Item
                  value={person.id}
                  key={person.id}
                  label={useItemLabelInCustomRenderer ? `${person.firstName} ${person.lastName}` : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={person.pictureUrl}
                      alt={`Portrait of ${person.firstName} ${person.lastName}`}
                      style={{
                        width: 'var(--lumo-size-m)',
                        height: 'var(--lumo-size-m)',
                        borderRadius: '50%',
                        marginRight: 'var(--lumo-space-s)',
                      }}
                    />
                    <div>
                      {person.firstName} {person.lastName}
                      <div
                        style={{
                          fontSize: 'var(--lumo-font-size-s)',
                          color: 'var(--lumo-secondary-text-color)',
                        }}
                      >
                        {person.profession}
                      </div>
                    </div>
                  </div>
                </Item>
              ))}
            </ListBox>
          ) : null}
        </Select>

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
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use tooltip
        </label>
        <label>
          <input
            type="checkbox"
            checked={useCustomRenderer}
            onChange={() => setUseCustomRenderer(!useCustomRenderer)}
          />{' '}
          Use Custom Renderer
        </label>
        <label style={{ opacity: useCustomRenderer ? 1 : 0.5 }}>
          <input
            type="checkbox"
            checked={useItemLabelInCustomRenderer}
            onChange={() => setUseItemLabelInCustomRenderer(!useItemLabelInCustomRenderer)}
            disabled={!useCustomRenderer}
          />{' '}
          Use Item Label in Custom Renderer
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
