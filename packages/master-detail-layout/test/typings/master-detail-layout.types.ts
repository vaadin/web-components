import '../../vaadin-master-detail-layout.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const layout = document.createElement('vaadin-master-detail-layout');

// Mixins
assertType<ElementMixinClass>(layout);
assertType<ResizeMixinClass>(layout);
assertType<ThemableMixinClass>(layout);
