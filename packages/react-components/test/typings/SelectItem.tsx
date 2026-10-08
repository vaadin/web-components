import { SelectItem, type SelectItemData } from '@vaadin/react-components';
import type { SelectItem as SelectItemType } from '@vaadin/react-components/Select.js';

// `SelectItem` must resolve to the React component and work in value/JSX position.
const element = <SelectItem value="x">x</SelectItem>;

// `SelectItemData` must still work in type position (unaffected by the collision fix).
const items: SelectItemData[] = [];

// The deprecated `SelectItem` type is intentionally no longer exported from the barrel;
// `SelectItem` now refers only to the component, so using it as a type must fail to compile.
// @ts-expect-error — `SelectItem` is a value (the component) in the barrel, not a type.
let deprecated: SelectItem[];

// Escape hatch: the deprecated type is still importable directly from the Select.js subpath.
let stillWorks: SelectItemType[] = [];
