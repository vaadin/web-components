import '../../vaadin-master-detail-layout-detail.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const layout = document.createElement('vaadin-master-detail-layout-detail');

// Mixins
assertType<ElementMixinClass>(layout);
