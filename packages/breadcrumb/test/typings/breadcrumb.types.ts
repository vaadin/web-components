import '../../vaadin-breadcrumb.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { BreadcrumbMixinClass } from '../../src/vaadin-breadcrumb-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const element = document.createElement('vaadin-breadcrumb');

// Mixins
assertType<ElementMixinClass>(element);
assertType<ThemableMixinClass>(element);
assertType<BreadcrumbMixinClass>(element);
