import '../../vaadin-virtual-list.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import type { VirtualList, VirtualListItemModel, VirtualListRenderer } from '../../vaadin-virtual-list.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const genericVirtualList = document.createElement('vaadin-virtual-list');

assertType<VirtualList>(genericVirtualList);

assertType<ThemableMixinClass>(genericVirtualList);
assertType<ElementMixinClass>(genericVirtualList);
assertType<ControllerMixinClass>(genericVirtualList);

genericVirtualList.items = [1, 2, 3];

interface TestVirtualListItem {
  testProperty: string;
}

const virtualList = genericVirtualList as VirtualList<TestVirtualListItem>;

assertType<VirtualList<TestVirtualListItem>>(virtualList);

virtualList.items = [{ testProperty: '1' }, { testProperty: '2' }, { testProperty: '3' }];

assertType<TestVirtualListItem[]>(virtualList.items);

virtualList.renderer = (root, virtualList, model) => {
  assertType<HTMLElement>(root);
  assertType<VirtualList>(virtualList);
  assertType<VirtualListItemModel<TestVirtualListItem>>(model);
  assertType<number>(model.index);
  assertType<boolean | undefined>(model.selected);
  assertType<TestVirtualListItem>(model.item);
};

assertType<VirtualListRenderer<TestVirtualListItem>>(virtualList.renderer);

assertType<(index: number) => void>(virtualList.scrollToIndex);

assertType<number>(virtualList.firstVisibleIndex);
assertType<number>(virtualList.lastVisibleIndex);

assertType<'none' | 'single' | 'multi'>(virtualList.selectionMode);
assertType<TestVirtualListItem[]>(virtualList.selectedItems);
assertType<string | null | undefined>(virtualList.itemIdPath);

assertType<((item: TestVirtualListItem) => string) | undefined>(virtualList.itemAccessibleNameGenerator);

virtualList.addEventListener('selected-items-changed', (event) => {
  assertType<CustomEvent<{ value: TestVirtualListItem[] }>>(event);
  assertType<TestVirtualListItem[]>(event.detail.value);
});
