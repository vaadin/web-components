import {
  AvatarGroup,
  type AvatarGroupI18n,
  type AvatarGroupItem,
} from '../../packages/react-components/src/AvatarGroup.js';
import { useState } from 'react';

interface EditableAvatarItem extends AvatarGroupItem {
  id: string;
  enabled: boolean;
}

const initialPeopleData: EditableAvatarItem[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    abbr: 'AW',
    img: 'https://randomuser.me/api/portraits/women/1.jpg',
    colorIndex: 0,
    enabled: true,
  },
  {
    id: '2',
    name: 'Bob The Builder',
    abbr: 'BB',
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    colorIndex: 1,
    enabled: true,
  },
  {
    id: '3',
    name: 'Charlie Chaplin',
    abbr: 'CC',
    img: 'https://randomuser.me/api/portraits/men/2.jpg',
    colorIndex: 2,
    enabled: true,
  },
  {
    id: '4',
    name: 'Diana Prince',
    abbr: 'DP',
    img: 'https://randomuser.me/api/portraits/women/2.jpg',
    colorIndex: 3,
    enabled: false,
  },
  {
    id: '5',
    name: 'Edward Scissorhands',
    abbr: 'ES',
    img: 'https://randomuser.me/api/portraits/men/3.jpg',
    colorIndex: 4,
    enabled: false,
  },
  {
    id: '6',
    name: 'Fiona Gallagher',
    abbr: 'FG',
    img: 'https://randomuser.me/api/portraits/women/3.jpg',
    colorIndex: 5,
    enabled: false,
  },
];

const defaultI18n: AvatarGroupI18n = {
  anonymous: 'Anonymous',
  activeUsers: {
    one: 'Currently one active user',
    many: 'Currently {count} active users',
  },
  joined: '{user} joined',
  left: '{user} left',
};

export default function AvatarGroupPage() {
  const [people, setPeople] = useState<EditableAvatarItem[]>(initialPeopleData);
  const [maxItemsVisible, setMaxItemsVisible] = useState<number | undefined>(3);
  const [i18nConf, setI18nConf] = useState<AvatarGroupI18n>(defaultI18n);

  const avatarGroupItems: AvatarGroupItem[] = people.filter((p) => p.enabled).map(({ id, enabled, ...item }) => item);

  const handlePersonPropertyChange = (
    personId: string,
    prop: keyof Omit<EditableAvatarItem, 'id' | 'enabled'>,
    value: string | number | undefined,
  ) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) => (person.id === personId ? { ...person, [prop]: value } : person)),
    );
  };

  const handlePersonEnabledChange = (personId: string, checked: boolean) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) => (person.id === personId ? { ...person, enabled: checked } : person)),
    );
  };

  const handleI18nChange = (key: keyof AvatarGroupI18n, value: string | { one?: string; many?: string }) => {
    if (key === 'activeUsers') {
      setI18nConf((prevI18n) => ({
        ...prevI18n,
        activeUsers: { ...prevI18n.activeUsers, ...(value as object) },
      }));
    } else {
      // Type assertion for other keys, assuming they are strings based on AvatarGroupI18n structure
      setI18nConf((prevI18n) => ({ ...prevI18n, [key]: value as string }));
    }
  };

  const handleNumberInputChange = (
    setter: (value: number | undefined) => void,
    currentValue: number | undefined,
    eventValue: string,
    nonNegative: boolean = false,
  ) => {
    if (eventValue === '') {
      setter(undefined);
    } else {
      const num = parseInt(eventValue, 10);
      if (!isNaN(num)) {
        setter(nonNegative ? Math.max(0, num) : num);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>AvatarGroup</h1>
        <AvatarGroup items={avatarGroupItems} maxItemsVisible={maxItemsVisible} i18n={i18nConf} />
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          Max Items Visible:
          <input
            type="number"
            value={maxItemsVisible ?? ''}
            onChange={(e) => handleNumberInputChange(setMaxItemsVisible, maxItemsVisible, e.target.value, true)}
            placeholder="Default (show all)"
            min="0"
            style={{ marginTop: '4px' }}
          />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="i18n-anonymous">
            <code>anonymous</code>:
          </label>
          <input
            id="i18n-anonymous"
            type="text"
            value={i18nConf.anonymous}
            onChange={(e) => handleI18nChange('anonymous', e.target.value)}
          />

          <label htmlFor="i18n-activeUsers-one">
            <code>activeUsers.one</code>:
          </label>
          <input
            id="i18n-activeUsers-one"
            type="text"
            value={i18nConf.activeUsers?.one}
            onChange={(e) => handleI18nChange('activeUsers', { one: e.target.value })}
          />

          <label htmlFor="i18n-activeUsers-many">
            <code>activeUsers.many</code>:
          </label>
          <input
            id="i18n-activeUsers-many"
            type="text"
            value={i18nConf.activeUsers?.many}
            onChange={(e) => handleI18nChange('activeUsers', { many: e.target.value })}
          />

          <label htmlFor="i18n-joined">
            <code>joined</code>:
          </label>
          <input
            id="i18n-joined"
            type="text"
            value={i18nConf.joined}
            onChange={(e) => handleI18nChange('joined', e.target.value)}
          />

          <label htmlFor="i18n-left">
            <code>left</code>:
          </label>
          <input
            id="i18n-left"
            type="text"
            value={i18nConf.left}
            onChange={(e) => handleI18nChange('left', e.target.value)}
          />
        </div>
      </div>

      {/* Items section */}
      <div>
        <h2>Items</h2>
        {people.map((person) => (
          <div
            key={person.id}
            style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', width: 'calc(100% - 22px)' }}
          >
            <label>
              <input
                type="checkbox"
                checked={person.enabled}
                onChange={(e) => handlePersonEnabledChange(person.id, e.target.checked)}
              />
              Include <strong>{person.name || 'Unnamed'}</strong>
            </label>
            <div
              style={{
                marginLeft: '20px',
                marginTop: '8px',
                display: person.enabled ? 'grid' : 'none',
                gridTemplateColumns: 'auto 1fr',
                gap: '8px',
              }}
            >
              <label htmlFor={`name-${person.id}`}>Name:</label>
              <input
                id={`name-${person.id}`}
                type="text"
                value={person.name || ''}
                onChange={(e) => handlePersonPropertyChange(person.id, 'name', e.target.value)}
              />

              <label htmlFor={`abbr-${person.id}`}>Abbr:</label>
              <input
                id={`abbr-${person.id}`}
                type="text"
                value={person.abbr || ''}
                onChange={(e) => handlePersonPropertyChange(person.id, 'abbr', e.target.value)}
              />

              <label htmlFor={`img-${person.id}`}>Image URL:</label>
              <input
                id={`img-${person.id}`}
                type="text"
                value={person.img || ''}
                onChange={(e) => handlePersonPropertyChange(person.id, 'img', e.target.value)}
              />

              <label htmlFor={`colorIndex-${person.id}`}>Color Index:</label>
              <input
                id={`colorIndex-${person.id}`}
                type="number"
                value={person.colorIndex ?? ''}
                onChange={(e) =>
                  handleNumberInputChange(
                    (val) => handlePersonPropertyChange(person.id, 'colorIndex', val),
                    person.colorIndex,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
