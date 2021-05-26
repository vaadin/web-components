import '../../vaadin-virtual-list.js';

import {
  VirtualListElement,
  VirtualListItem,
  VirtualListItemModel,
  VirtualListRenderer
} from '../../vaadin-virtual-list.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const virtualList = document.createElement('vaadin-virtual-list');

assertType<VirtualListElement>(virtualList);

assertType<VirtualListItem>(1);
virtualList.items = [1, 2, 3];

virtualList.renderer = (root, virtualList, model) => {
  assertType<HTMLElement>(root);
  assertType<VirtualListElement>(virtualList);
  assertType<VirtualListItemModel>(model);
};

assertType<VirtualListRenderer>(virtualList.renderer);

assertType<void>(virtualList.scrollToIndex(3));

assertType<number>(virtualList.firstVisibleIndex);
assertType<number>(virtualList.lastVisibleIndex);
