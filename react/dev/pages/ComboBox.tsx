import React, { useState, useEffect, useCallback } from 'react';
import { ComboBox } from '../../packages/react-components/src/ComboBox.js';
import type {
  ComboBoxValueChangedEvent,
  ComboBoxCustomValueSetEvent,
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxValidatedEvent,
  ComboBoxOpenedChangedEvent,
} from '@vaadin/combo-box';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';
import { Icon } from '../../packages/react-components/src/Icon.js';
import '@vaadin/icons';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  pictureUrl: string;
  displayName: string;
}

const peopleForRenderer: Person[] = [
  {
    id: 'p1',
    firstName: 'Alice',
    lastName: 'Smith',
    profession: 'Engineer',
    pictureUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
    displayName: 'Alice Smith',
  },
  {
    id: 'p2',
    firstName: 'Bob',
    lastName: 'Johnson',
    profession: 'Designer',
    pictureUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    displayName: 'Bob Johnson',
  },
  {
    id: 'p3',
    firstName: 'Carol',
    lastName: 'Williams',
    profession: 'Manager',
    pictureUrl: 'https://randomuser.me/api/portraits/women/85.jpg',
    displayName: 'Carol Williams',
  },
];

const initialStringItems: string[] = ['Chrome', 'Edge', 'Firefox', 'Safari', 'Opera', 'Vivaldi'];
const initialObjectItems: { label: string; value: string; category: string }[] = [
  { label: 'Apple', value: 'apple', category: 'Fruit' },
  { label: 'Banana', value: 'banana', category: 'Fruit' },
  { label: 'Orange', value: 'orange', category: 'Fruit' },
  { label: 'Carrot', value: 'carrot', category: 'Vegetable' },
  { label: 'Broccoli', value: 'broccoli', category: 'Vegetable' },
  { label: 'Tomato', value: 'tomato', category: 'Fruit' },
];

export default function ComboBoxPage() {
  const [label, setLabel] = useState('Label');
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [helperText, setHelperText] = useState('Helper text');
  const [errorMessage, setErrorMessage] = useState('Error: Invalid input');
  const [value, setValue] = useState<string>('');
  const [invalid, setInvalid] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [clearButtonVisible, setClearButtonVisible] = useState(false);
  const [allowCustomValue, setAllowCustomValue] = useState(false);
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [allowedCharPattern, setAllowedCharPattern] = useState('');
  const [theme, setTheme] = useState('');
  const [overlayWidth, setOverlayWidth] = useState('');

  const [itemMode, setItemMode] = useState<'strings' | 'objects' | 'customRenderer'>('strings');
  const [itemLabelPath, setItemLabelPath] = useState('label');
  const [itemValuePath, setItemValuePath] = useState('value');

  const [currentBaseItems, setCurrentBaseItems] = useState<any[]>(initialStringItems);
  const [itemsToRender, setItemsToRender] = useState<any[]>(initialStringItems);
  const [filter, setFilter] = useState('');

  const [useTooltip, setUseTooltip] = useState(false);
  const [usePrefix, setUsePrefix] = useState(false);
  const [useClassNameGenerator, setUseClassNameGenerator] = useState(false);

  const [eventLog, setEventLog] = useState<string[]>([]);
  const logEvent = useCallback((event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    let newBaseItems: any[];
    switch (itemMode) {
      case 'objects':
        newBaseItems = [...initialObjectItems];
        setItemLabelPath('label');
        setItemValuePath('value');
        break;
      case 'customRenderer':
        newBaseItems = [...peopleForRenderer];
        setItemLabelPath('displayName');
        setItemValuePath('id');
        break;
      case 'strings':
      default:
        newBaseItems = [...initialStringItems];
        break;
    }
    setCurrentBaseItems(newBaseItems);
    setItemsToRender([...newBaseItems]);
    setValue('');
    setFilter('');
  }, [itemMode]);

  useEffect(() => {
    if (!filter) {
      setItemsToRender([...currentBaseItems]);
      return;
    }

    const lowerCaseFilter = filter.toLowerCase();
    let filteredList;

    if (itemMode === 'strings') {
      filteredList = currentBaseItems.filter((item) => String(item).toLowerCase().includes(lowerCaseFilter));
    } else if (itemMode === 'objects') {
      filteredList = currentBaseItems.filter((item) =>
        String(item[itemLabelPath]).toLowerCase().includes(lowerCaseFilter),
      );
    } else if (itemMode === 'customRenderer') {
      filteredList = currentBaseItems.filter((person: Person) =>
        `${person.firstName} ${person.lastName} ${person.profession}`.toLowerCase().includes(lowerCaseFilter),
      );
    } else {
      filteredList = [...currentBaseItems];
    }
    setItemsToRender(filteredList);
  }, [currentBaseItems, filter, itemLabelPath]);

  const customItemRenderer = useCallback(({ item: person }: { item: Person }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--lumo-space-xs) 0' }}>
        <img
          src={person.pictureUrl}
          alt={`Portrait of ${person.firstName} ${person.lastName}`}
          style={{
            height: 'var(--lumo-size-m)',
            width: 'var(--lumo-size-m)',
            marginRight: 'var(--lumo-space-s)',
            borderRadius: '50%',
          }}
        />
        <div>
          {person.firstName} {person.lastName}
          <div style={{ fontSize: 'var(--lumo-font-size-s)', color: 'var(--lumo-secondary-text-color)' }}>
            {person.profession}
          </div>
        </div>
      </div>
    );
  }, []);

  const itemClassNameGenerator = useCallback(
    (item: any): string => {
      if (!useClassNameGenerator) return '';
      if (itemMode === 'strings' && typeof item === 'string') {
        if (item.toLowerCase().includes('firefox')) return 'firefox-item';
        if (item.toLowerCase().includes('chrome')) return 'chrome-item';
      } else if (itemMode === 'objects' && item && item.category === 'Fruit') {
        return 'fruit-item';
      } else if (itemMode === 'customRenderer' && item && (item as Person).profession === 'Engineer') {
        return 'engineer-item';
      }
      return '';
    },
    [itemMode, useClassNameGenerator],
  );

  const comboBoxStyle: React.CSSProperties & { [key: string]: string | number } = {};
  if (overlayWidth) {
    comboBoxStyle['--vaadin-combo-box-overlay-width'] = overlayWidth;
  }

  useEffect(() => {
    if (useClassNameGenerator) {
      const dynamicStyles = `
        .firefox-item { color: orange; font-weight: bold; }
        .chrome-item { color: green; }
        .fruit-item { background-color: #f0fff0; }
        .engineer-item { border-left: 3px solid blue; padding-left: 5px;}
      `;
      let styleSheet = document.getElementById('combo-box-page-dynamic-styles');
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'combo-box-page-dynamic-styles';
        document.head.appendChild(styleSheet);
      }
      styleSheet.innerHTML = dynamicStyles; // Use innerHTML or textContent
    } else {
      const styleSheet = document.getElementById('combo-box-page-dynamic-styles');
      if (styleSheet) {
        styleSheet.innerHTML = ''; // Clear styles if generator is turned off
      }
    }
  }, [useClassNameGenerator]);

  useEffect(() => {
    console.log('itemLabelPath', itemLabelPath);
  }, [itemLabelPath]);

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>ComboBox</h1>
        <ComboBox
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          errorMessage={errorMessage}
          value={value}
          onOpenedChanged={(e: ComboBoxOpenedChangedEvent) => {
            logEvent(`opened-changed: ${e.detail.value}`);
          }}
          onValueChanged={(e: ComboBoxValueChangedEvent) => {
            setValue(e.detail.value || '');
            logEvent(`value-changed: "${e.detail.value}"`);
          }}
          onChange={(e) => {
            logEvent(`change event: ${e.target.value}`);
          }}
          invalid={invalid}
          onInvalidChanged={(e: ComboBoxInvalidChangedEvent) => {
            setInvalid(e.detail.value);
            logEvent(`invalid-changed: ${e.detail.value}`);
          }}
          onValidated={(e: ComboBoxValidatedEvent) => {
            logEvent(`validated (valid=${e.detail.valid})`);
          }}
          readonly={readonly}
          disabled={disabled}
          clearButtonVisible={clearButtonVisible}
          allowCustomValue={allowCustomValue}
          onCustomValueSet={(e: ComboBoxCustomValueSetEvent) => {
            const customValue = e.detail;
            logEvent(`custom-value-set: "${customValue}"`);
            if (allowCustomValue && customValue) {
              if (itemMode === 'strings' && !currentBaseItems.includes(customValue)) {
                const newBase = [...currentBaseItems, customValue];
                setCurrentBaseItems(newBase);
              } else {
                logEvent('Custom value not added to non-string or existing items list.');
              }
            }
          }}
          autoOpenDisabled={autoOpenDisabled}
          required={required}
          allowedCharPattern={allowedCharPattern || undefined}
          itemLabelPath={itemMode !== 'strings' ? itemLabelPath : ''}
          itemValuePath={itemMode !== 'strings' ? itemValuePath : ''}
          filteredItems={itemsToRender}
          onFilterChanged={(e: ComboBoxFilterChangedEvent) => {
            logEvent(`filter-changed: "${e.detail.value}"`);
            setFilter(e.detail.value);
          }}
          renderer={itemMode === 'customRenderer' ? customItemRenderer : undefined}
          itemClassNameGenerator={useClassNameGenerator ? itemClassNameGenerator : undefined}
          theme={theme}
          style={comboBoxStyle}
        >
          {usePrefix && <Icon slot="prefix" icon="vaadin:search" />}
          {useTooltip && <Tooltip slot="tooltip" text="This is a tooltip for the ComboBox" />}
        </ComboBox>

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
          Allowed Char Pattern:{' '}
          <input
            type="text"
            value={allowedCharPattern}
            onChange={(e) => setAllowedCharPattern(e.target.value)}
            placeholder="e.g. [A-Z]"
          />
        </label>
        <label>
          Theme:{' '}
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. small align-right"
          />
        </label>
        <label>
          Overlay Width:{' '}
          <input
            type="text"
            value={overlayWidth}
            onChange={(e) => setOverlayWidth(e.target.value)}
            placeholder="e.g. 350px"
          />
        </label>

        <label>
          <input type="checkbox" checked={invalid} onChange={() => setInvalid(!invalid)} /> Invalid (prop)
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
          <input type="checkbox" checked={allowCustomValue} onChange={() => setAllowCustomValue(!allowCustomValue)} />{' '}
          Allow Custom Value
        </label>
        <label>
          <input type="checkbox" checked={autoOpenDisabled} onChange={() => setAutoOpenDisabled(!autoOpenDisabled)} />{' '}
          Auto Open Disabled
        </label>
        <label>
          <input type="checkbox" checked={required} onChange={() => setRequired(!required)} /> Required
        </label>
        <label>
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use Tooltip
        </label>
        <label>
          <input type="checkbox" checked={usePrefix} onChange={() => setUsePrefix(!usePrefix)} /> Use Prefix Icon
        </label>
        <label>
          <input
            type="checkbox"
            checked={useClassNameGenerator}
            onChange={() => setUseClassNameGenerator(!useClassNameGenerator)}
          />{' '}
          Use Item ClassName Generator
        </label>

        <h4>Item Mode</h4>
        <label>
          <input
            type="radio"
            name="itemMode"
            value="strings"
            checked={itemMode === 'strings'}
            onChange={() => setItemMode('strings')}
          />{' '}
          String Items
        </label>
        <label>
          <input
            type="radio"
            name="itemMode"
            value="objects"
            checked={itemMode === 'objects'}
            onChange={() => setItemMode('objects')}
          />{' '}
          Object Items
        </label>
        <label>
          <input
            type="radio"
            name="itemMode"
            value="customRenderer"
            checked={itemMode === 'customRenderer'}
            onChange={() => setItemMode('customRenderer')}
          />{' '}
          Custom Renderer (People)
        </label>

        {(itemMode === 'objects' || itemMode === 'customRenderer') && (
          <>
            <label>
              Item Label Path:{' '}
              <input
                type="text"
                value={itemLabelPath}
                onChange={(e) => setItemLabelPath(e.target.value)}
                disabled={itemMode !== 'objects' && itemMode !== 'customRenderer'}
              />
            </label>
            <label>
              Item Value Path:{' '}
              <input
                type="text"
                value={itemValuePath}
                onChange={(e) => setItemValuePath(e.target.value)}
                disabled={itemMode !== 'objects' && itemMode !== 'customRenderer'}
              />
            </label>
          </>
        )}
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
