import '../../vaadin-breadcrumb.js';
import '../../vaadin-breadcrumb-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Breadcrumb } from '../../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbMixinClass } from '../../src/vaadin-breadcrumb-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const breadcrumb = document.createElement('vaadin-breadcrumb');
const item = document.createElement('vaadin-breadcrumb-item');

// Type identity
assertType<Breadcrumb>(breadcrumb);
assertType<BreadcrumbItem>(item);

// Mixins on the container
assertType<ElementMixinClass>(breadcrumb);
assertType<ThemableMixinClass>(breadcrumb);
assertType<BreadcrumbMixinClass>(breadcrumb);

// Mixins on the item
assertType<ElementMixinClass>(item);
assertType<ThemableMixinClass>(item);
