import '../../vaadin-master-detail-layout.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const layout = document.createElement('vaadin-master-detail-layout');

// Mixins
assertType<ElementMixinClass>(layout);
assertType<ThemableMixinClass>(layout);

// Properties
assertType<string | null | undefined>(layout.detailSize);
assertType<string | null | undefined>(layout.detailMinSize);
assertType<string | null | undefined>(layout.masterSize);
assertType<string | null | undefined>(layout.masterMinSize);
assertType<'horizontal' | 'vertical'>(layout.orientation);
assertType<boolean>(layout.forceOverlay);
assertType<string | null | undefined>(layout.stackThreshold);
assertType<boolean>(layout.noAnimation);
