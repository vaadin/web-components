import { ContextMenu } from '../../packages/react-components/src/ContextMenu.js';
import { Icon } from '../../packages/react-components/src/Icon.js';
import '@vaadin/icons';

const items = [
  {
    component: (
      <>
        <Icon
          icon="vaadin:user"
          style={{
            color: 'var(--lumo-secondary-text-color)',
            marginInlineEnd: 'var(--lumo-space-s)',
            padding: 'var(--lumo-space-xs)',
          }}
        />
        <span>Menu Item 1</span>
      </>
    ),
  },
  { component: 'hr' },
  {
    text: 'Menu Item 2',
    children: [
      { text: 'Menu Item 2-1' },
      {
        text: 'Menu Item 2-2',
        children: [
          { text: 'Menu Item 2-2-1' },
          { text: 'Menu Item 2-2-2', disabled: true },
          { component: 'hr' },
          { text: 'Menu Item 2-2-3' },
        ],
      },
    ],
  },
  { text: 'Menu Item 3', disabled: true },
];

export default function () {
  return (
    <ContextMenu items={items}>
      <div style={{ padding: '10px' }}>Right click me</div>
    </ContextMenu>
  );
}
