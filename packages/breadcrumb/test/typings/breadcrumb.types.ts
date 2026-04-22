import '../../vaadin-breadcrumb.js';
import '../../vaadin-breadcrumb-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Breadcrumb, BreadcrumbItemData } from '../../src/vaadin-breadcrumb.js';
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

// BreadcrumbItemData shape: text is required, path is optional.
const dataWithPath: BreadcrumbItemData = { text: 'Home', path: '/' };
const dataWithoutPath: BreadcrumbItemData = { text: 'Quarterly' };
assertType<string>(dataWithPath.text);
assertType<string | undefined>(dataWithPath.path);
assertType<string>(dataWithoutPath.text);
assertType<string | undefined>(dataWithoutPath.path);

// `items` accepts BreadcrumbItemData[], null, and undefined.
breadcrumb.items = [{ text: 'Home', path: '/' }, { text: 'Reports', path: '/reports' }, { text: 'Quarterly' }];
breadcrumb.items = null;
breadcrumb.items = undefined;
assertType<BreadcrumbItemData[] | null | undefined>(breadcrumb.items);
