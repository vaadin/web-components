import '../../vaadin-virtual-list.js';

import { VirtualListElement, VirtualListItemModel, VirtualListRenderer } from '../../vaadin-virtual-list.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const genericVirtualList = document.createElement('vaadin-virtual-list');

assertType<VirtualListElement>(genericVirtualList);

genericVirtualList.items = [1, 2, 3];

interface TestVirtualListItem {
  testProperty: string;
}

const virtualList = genericVirtualList as VirtualListElement<TestVirtualListItem>;

assertType<VirtualListElement<TestVirtualListItem>>(virtualList);

virtualList.items = [{ testProperty: '1' }, { testProperty: '2' }, { testProperty: '3' }];

assertType<Array<TestVirtualListItem>>(virtualList.items);

virtualList.renderer = (root, virtualList, model) => {
  assertType<HTMLElement>(root);
  assertType<VirtualListElement>(virtualList);
  assertType<VirtualListItemModel<TestVirtualListItem>>(model);
  assertType<number>(model.index);
  assertType<TestVirtualListItem>(model.item);
};

assertType<VirtualListRenderer<TestVirtualListItem>>(virtualList.renderer);

assertType<void>(virtualList.scrollToIndex(3));

assertType<number>(virtualList.firstVisibleIndex);
assertType<number>(virtualList.lastVisibleIndex);
