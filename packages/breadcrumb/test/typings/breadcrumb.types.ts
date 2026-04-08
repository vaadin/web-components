import '../../vaadin-breadcrumb.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { BreadcrumbMixinClass } from '../../src/vaadin-breadcrumb-mixin.js';
const assertType = <TExpected>(value: TExpected) => value;

const breadcrumb = document.createElement('vaadin-breadcrumb');

// Mixins
assertType<ElementMixinClass>(breadcrumb);
assertType<ThemableMixinClass>(breadcrumb);
assertType<BreadcrumbMixinClass>(breadcrumb);

// Properties
assertType<string | undefined>(breadcrumb.label);

const item = document.createElement('vaadin-breadcrumb-item');

// Properties
assertType<string | null | undefined>(item.path);
assertType<boolean>(item.disabled);
