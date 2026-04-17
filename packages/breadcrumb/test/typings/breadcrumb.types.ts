import '../../vaadin-breadcrumb.js';
import '../../vaadin-breadcrumb-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { Breadcrumb, BreadcrumbI18n } from '../../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbItemMixinClass } from '../../src/vaadin-breadcrumb-item-mixin.js';
import type {
  BreadcrumbItemData,
  BreadcrumbMixinClass,
  BreadcrumbNavigateDetail,
} from '../../src/vaadin-breadcrumb-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const breadcrumb: Breadcrumb = document.createElement('vaadin-breadcrumb');

// Properties
assertType<BreadcrumbItemData[] | null | undefined>(breadcrumb.items);
assertType<((detail: BreadcrumbNavigateDetail) => boolean | undefined) | null | undefined>(breadcrumb.onNavigate);
assertType<any>(breadcrumb.location);
assertType<BreadcrumbI18n>(breadcrumb.i18n);

// Mixins
assertType<ElementMixinClass>(breadcrumb);
assertType<I18nMixinClass<BreadcrumbI18n>>(breadcrumb);
assertType<ThemableMixinClass>(breadcrumb);
assertType<BreadcrumbMixinClass>(breadcrumb);

// Events
breadcrumb.addEventListener('navigate', (event) => {
  assertType<CustomEvent<BreadcrumbNavigateDetail>>(event);
  assertType<string>(event.detail.path);
  assertType<boolean>(event.detail.current);
  assertType<Event>(event.detail.originalEvent);
});

// onNavigate callback
breadcrumb.onNavigate = null;
breadcrumb.onNavigate = undefined;
breadcrumb.onNavigate = (detail) => {
  assertType<BreadcrumbNavigateDetail>(detail);
  assertType<string>(detail.path);
  assertType<boolean>(detail.current);
  assertType<Event>(detail.originalEvent);
  return undefined;
};
breadcrumb.onNavigate = () => false;

// Items
breadcrumb.items = null;
breadcrumb.items = undefined;
breadcrumb.items = [
  { text: 'Home', path: '/', current: false },
  { text: 'Products', path: '/products' },
  { text: 'Shoes' },
];

// I18n
assertType<BreadcrumbI18n>({});
assertType<BreadcrumbI18n>({ navigationLabel: 'Breadcrumb' });
assertType<BreadcrumbI18n>({ overflow: 'Show more' });
assertType<BreadcrumbI18n>({ navigationLabel: 'Breadcrumb', overflow: 'Show more' });

const item: BreadcrumbItem = document.createElement('vaadin-breadcrumb-item');

// Item properties
assertType<string | undefined>(item.path);
assertType<boolean>(item.current);

// Item mixins
assertType<ElementMixinClass>(item);
assertType<ThemableMixinClass>(item);
assertType<BreadcrumbItemMixinClass>(item);
