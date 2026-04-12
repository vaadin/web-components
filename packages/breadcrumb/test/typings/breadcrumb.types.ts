import '../../vaadin-breadcrumb-item.js';
import '../../vaadin-breadcrumb.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  Breadcrumb,
  BreadcrumbI18n,
  BreadcrumbItemDefinition,
  BreadcrumbNavigateEvent,
} from '../../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbMixinClass } from '../../src/vaadin-breadcrumb-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const breadcrumb: Breadcrumb = document.createElement('vaadin-breadcrumb');

// Properties
assertType<BreadcrumbI18n>(breadcrumb.i18n);
assertType<BreadcrumbItemDefinition[] | null | undefined>(breadcrumb.items);
assertType<unknown>(breadcrumb.location);

// Mixins
assertType<ElementMixinClass>(breadcrumb);
assertType<ThemableMixinClass>(breadcrumb);
assertType<BreadcrumbMixinClass>(breadcrumb);

// Router integration
breadcrumb.onNavigate = undefined;
breadcrumb.onNavigate = () => {};
breadcrumb.onNavigate = (event) => {
  assertType<BreadcrumbNavigateEvent>(event);
  assertType<string>(event.path);
  assertType<boolean>(event.current);
  assertType<Event>(event.originalEvent);
};
breadcrumb.onNavigate = (_event) => false;

// Location
breadcrumb.location = '/some/path';
breadcrumb.location = null;
breadcrumb.location = undefined;

// Items
breadcrumb.items = null;
breadcrumb.items = undefined;
breadcrumb.items = [
  { label: 'Home', path: '/home' },
  { label: 'Products', path: '/products', disabled: true },
  { label: 'Current' },
];

// I18n
assertType<BreadcrumbI18n>({});
assertType<BreadcrumbI18n>({ overflow: 'Show more' });

const breadcrumbItem: BreadcrumbItem = document.createElement('vaadin-breadcrumb-item');

// Item properties
assertType<string | null | undefined>(breadcrumbItem.path);
assertType<boolean>(breadcrumbItem.current);
assertType<boolean>(breadcrumbItem.disabled);

// Item mixins
assertType<DisabledMixinClass>(breadcrumbItem);
assertType<ElementMixinClass>(breadcrumbItem);
assertType<ThemableMixinClass>(breadcrumbItem);
