import { useState, useEffect } from 'react';
import {
  ContextMenu,
  type ContextMenuItem,
  type ContextMenuItemSelectedEvent,
} from '../../packages/react-components/src/ContextMenu.js';
import { Icon } from '../../packages/react-components/src/Icon.js';
import { RadioGroup } from '../../packages/react-components/src/RadioGroup.js';
import { RadioButton } from '../../packages/react-components/src/RadioButton.js';
import '@vaadin/icons';

function createItem(iconName: string, text: string) {
  return (
    <>
      <Icon
        icon={iconName}
        style={{
          color: 'var(--lumo-secondary-text-color)',
          marginInlineEnd: 'var(--lumo-space-s)',
          padding: 'var(--lumo-space-xs)',
        }}
      />
      {text}
    </>
  );
}

const initialItemSets: Record<string, ContextMenuItem[]> = {
  basic: [{ text: 'View' }, { text: 'Edit' }, { text: 'Delete' }],
  dividers: [{ text: 'View' }, { component: 'hr' }, { text: 'Edit' }, { text: 'Delete' }],
  checkable: [
    { text: 'Option 1', checked: true },
    { text: 'Option 2', checked: false },
    { text: 'Option 3', checked: false },
  ],
  hierarchical: [
    {
      text: 'File',
      children: [
        { text: 'New' },
        {
          text: 'Open',
          children: [{ text: 'Document' }, { text: 'Spreadsheet' }],
        },
      ],
    },
    {
      text: 'Edit',
      children: [{ text: 'Copy' }, { text: 'Paste' }],
    },
    { component: 'hr' },
    { text: 'Share' },
  ],
  customComponents: [
    { component: createItem('vaadin:user', 'User profile') },
    {
      component: createItem('vaadin:cog', 'Settings'),
    },
    { component: 'hr' },
    {
      component: createItem('vaadin:sign-out', 'Logout'),
    },
  ],
  disabled: [{ text: 'Enabled Action' }, { text: 'Disabled Action', disabled: true }, { text: 'Another Enabled' }],
  styled: [
    { text: 'Normal Item' },
    { text: 'Warning Item', className: 'custom-warning-item' },
    { text: 'Error Item', className: 'custom-error-item' },
  ],
};

type ItemSetType = keyof typeof initialItemSets;
type OpenOnType = 'contextmenu' | 'click';

export default function ContextMenuPage() {
  const [itemSetType, setItemSetType] = useState<ItemSetType>('basic');
  const [items, setItems] = useState<ContextMenuItem[]>(initialItemSets.basic);
  const [openOn, setOpenOn] = useState<OpenOnType>('contextmenu');
  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  useEffect(() => {
    setItems(initialItemSets[itemSetType]);
  }, [itemSetType]);

  const handleItemSelected = (e: ContextMenuItemSelectedEvent) => {
    const selectedItem = e.detail.value;
    logEvent(`item-selected: ${selectedItem.text || selectedItem.component?.toString() || 'Custom Component'}`);

    if (itemSetType === 'checkable') {
      // Radio-button like behavior: only one item can be checked.
      const updateCheckedState = (currentItems: ContextMenuItem[]): ContextMenuItem[] => {
        return currentItems.map((item) => {
          const newItem = { ...item };
          if (item === selectedItem) {
            newItem.checked = true; // Check the selected item
          } else if (item.checked) {
            newItem.checked = false; // Uncheck previously checked item
          }
          if (item.children) {
            newItem.children = updateCheckedState(item.children);
          }
          return newItem;
        });
      };
      setItems((prevItems) => updateCheckedState(prevItems));
    }
  };

  return (
    <>
      <style>{`
        .custom-warning-item {
          color: orange !important;
        }
        .custom-error-item {
          color: var(--lumo-error-text-color) !important;
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Demo component section */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h1>ContextMenu</h1>
          <ContextMenu items={items} openOn={openOn} onItemSelected={handleItemSelected}>
            <div
              style={{
                padding: '20px',
                border: '2px dashed #ccc',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                margin: '20px',
                userSelect: 'none',
              }}
            >
              Right-click (or long-press / click, depending on mode) on this area.
            </div>
          </ContextMenu>
        </div>

        {/* Configuration section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <h2>Configuration</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px 20px',
              alignItems: 'center',
            }}
          >
            <label htmlFor="itemset-select" style={{ fontWeight: 500 }}>
              Item Set:
            </label>
            <select
              id="itemset-select"
              value={itemSetType}
              onChange={(e) => setItemSetType(e.target.value as ItemSetType)}
            >
              {Object.keys(initialItemSets).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>

            <label style={{ fontWeight: 500 }}>Open On:</label>
            <RadioGroup value={openOn} onValueChanged={(e) => setOpenOn(e.detail.value as OpenOnType)}>
              <RadioButton value="contextmenu" label="Context Menu (Right-click/Long-press)" />
              <RadioButton value="click" label="Click" />
            </RadioGroup>
          </div>
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
              whiteSpace: 'pre-wrap',
            }}
          >
            {eventLog.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
