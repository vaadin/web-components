import '../../vaadin-card.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const card = document.createElement('vaadin-card');

// Properties
assertType<string>(card.cardTitle);
assertType<number | null | undefined>(card.titleHeadingLevel);

// Mixins
assertType<ElementMixinClass>(card);
assertType<ThemableMixinClass>(card);
