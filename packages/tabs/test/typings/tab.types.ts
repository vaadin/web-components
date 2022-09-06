import '../../vaadin-tab.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';

const tab = document.createElement('vaadin-tab');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<ControllerMixinClass>(tab);
assertType<ItemMixinClass>(tab);
