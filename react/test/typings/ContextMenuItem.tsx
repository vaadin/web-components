import { ContextMenuItem, ContextMenuListBox, type ContextMenuItemData } from '@vaadin/react-components';
import type { ContextMenuItem as ContextMenuItemType } from '@vaadin/react-components/ContextMenu.js';

// `ContextMenuItem` and `ContextMenuListBox` must resolve to the React components and work in JSX position.
const element = (
  <ContextMenuListBox>
    <ContextMenuItem>Open</ContextMenuItem>
  </ContextMenuListBox>
);

// `ContextMenuItemData` must still work in type position and refer to the React-flavored variant,
// whose `component` property accepts a `ReactElement` (the raw web component type only allows `Node`).
const items: ContextMenuItemData[] = [{ text: 'View', component: <b>View</b> }];

// The deprecated `ContextMenuItem` type is intentionally no longer exported from the barrel;
// `ContextMenuItem` now refers only to the component, so using it as a type must fail to compile.
// @ts-expect-error — `ContextMenuItem` is a value (the component) in the barrel, not a type.
let deprecated: ContextMenuItem[];

// Escape hatch: the deprecated type is still importable directly from the ContextMenu.js subpath.
let stillWorks: ContextMenuItemType[] = [];
