import '../../vaadin-badge.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Badge } from '../../vaadin-badge.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const badge = document.createElement('vaadin-badge');

// Mixins
assertType<ElementMixinClass>(badge);
assertType<ThemableMixinClass>(badge);

// Element
assertType<Badge>(badge);
