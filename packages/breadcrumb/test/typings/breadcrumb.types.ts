import '../../vaadin-breadcrumb.js';
import '../../vaadin-breadcrumb-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Breadcrumb, BreadcrumbI18n, BreadcrumbItemData } from '../../src/vaadin-breadcrumb.js';
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
assertType<I18nMixinClass<BreadcrumbI18n>>(breadcrumb);
assertType<ResizeMixinClass>(breadcrumb);

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

// I18n
assertType<BreadcrumbI18n>(breadcrumb.i18n);
assertType<BreadcrumbI18n>({});
assertType<BreadcrumbI18n>({ moreItems: 'Show more' });
assertType<string | undefined>(breadcrumb.i18n.moreItems);
breadcrumb.i18n = { moreItems: 'More' };
breadcrumb.i18n = {};

// `<vaadin-breadcrumb-item>` `path` and `target` are `string | null | undefined`.
assertType<string | null | undefined>(item.path);
assertType<string | null | undefined>(item.target);
item.path = '/home';
item.path = null;
item.path = undefined;
item.target = '_blank';
item.target = null;
item.target = undefined;
