import { Breadcrumbs } from '../../packages/react-components/src/Breadcrumbs.js';
import { BreadcrumbsItem } from '../../packages/react-components/src/BreadcrumbsItem.js';
import { useState } from 'react';

const items = [
  { path: '/', label: 'Home' },
  { path: '/docs', label: 'Docs' },
  { path: '/docs/components', label: 'Components' },
  { label: 'Breadcrumbs' },
];

export default function BreadcrumbsPage() {
  const [theme, setTheme] = useState('');

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
        <h1>Breadcrumbs</h1>
        <Breadcrumbs theme={theme || undefined}>
          {items.map((item, index) => (
            <BreadcrumbsItem key={index} path={item.path}>
              {item.label}
            </BreadcrumbsItem>
          ))}
        </Breadcrumbs>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label>
          Theme:{' '}
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">(default)</option>
            <option value="slash">slash</option>
          </select>
        </label>
      </div>
    </div>
  );
}
