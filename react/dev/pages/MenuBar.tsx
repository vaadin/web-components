import { MenuBar, type MenuBarItem } from '../../src/MenuBar.js';
import { Tooltip } from '../../src/Tooltip.js';
import { Icon } from '../../src/Icon.js';
import '@vaadin/icons';

const iconStyle = {
  width: 'var(--lumo-icon-size-m)',
  height: 'var(--lumo-icon-size-m)',
  marginRight: 'var(--lumo-space-s)',
};

const items: MenuBarItem[] = [
  { text: 'View', tooltip: 'Options for how to view the content' },
  { text: 'Edit' },
  {
    text: 'Share',
    children: [
      {
        text: 'On social media',
        children: [{ text: 'Facebook' }, { text: 'Twitter' }, { text: 'Instagram' }],
      },
      { text: 'By email' },
      { text: 'Get link' },
    ],
  },
  {
    text: 'Move',
    tooltip: 'Move to a different folder or trash.',
    children: [
      {
        checked: true,
        component: (
          <>
            <Icon icon="vaadin:folder" style={iconStyle} />
            <span>To folder</span>
          </>
        ),
      },
      {
        component: (
          <>
            <Icon icon="vaadin:trash" style={iconStyle} />
            <span>To trash</span>
          </>
        ),
      },
    ],
  },
  { text: 'Duplicate', tooltip: 'Create a duplicate' },
];

export default function () {
  return (
    <MenuBar items={items}>
      <Tooltip slot="tooltip" hover-delay="500" hide-delay="500" />
    </MenuBar>
  );
}
