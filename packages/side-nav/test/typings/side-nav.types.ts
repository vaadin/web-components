import '../../vaadin-side-nav.js';
import '../../vaadin-side-nav-item.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { NavigateEvent, SideNav, SideNavCollapsedChangedEvent, SideNavI18n } from '../../src/vaadin-side-nav';
import type { SideNavChildrenMixinClass } from '../../src/vaadin-side-nav-children-mixin.js';
import type { SideNavItem, SideNavItemExpandedChangedEvent } from '../../src/vaadin-side-nav-item';

const assertType = <TExpected>(actual: TExpected) => actual;

const sideNav: SideNav = document.createElement('vaadin-side-nav');

// Properties
assertType<boolean>(sideNav.collapsed);
assertType<boolean>(sideNav.collapsible);
assertType<SideNavI18n>(sideNav.i18n);

// Mixins
assertType<ElementMixinClass>(sideNav);
assertType<I18nMixinClass<SideNavI18n>>(sideNav);
assertType<ThemableMixinClass>(sideNav);
assertType<SideNavChildrenMixinClass>(sideNav);

// Events
sideNav.addEventListener('collapsed-changed', (event) => {
  assertType<SideNavCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

// Router integration
sideNav.onNavigate = undefined;
sideNav.onNavigate = () => false;
sideNav.onNavigate = (event) => {
  assertType<NavigateEvent>(event);
  assertType<string | null | undefined>(event.path);
  assertType<string | null | undefined>(event.target);
  assertType<boolean>(event.current);
  assertType<boolean>(event.expanded);
  assertType<string[]>(event.pathAliases);
  assertType<MouseEvent>(event.originalEvent);
};

assertType<any>(sideNav.location);
assertType<boolean>(sideNav.noAutoExpand);

const sideNavItem: SideNavItem = document.createElement('vaadin-side-nav-item');

// Item properties
assertType<string | null | undefined>(sideNavItem.path);
assertType<boolean>(sideNavItem.current);
assertType<boolean>(sideNavItem.disabled);
assertType<boolean>(sideNavItem.expanded);
assertType<SideNavI18n>(sideNavItem.i18n);

// Item mixins
assertType<DisabledMixinClass>(sideNavItem);
assertType<ElementMixinClass>(sideNavItem);
assertType<ThemableMixinClass>(sideNavItem);
assertType<SideNavChildrenMixinClass>(sideNavItem);

// Item Events
sideNavItem.addEventListener('expanded-changed', (event) => {
  assertType<SideNavItemExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

// I18n
assertType<SideNavI18n>({});
assertType<SideNavI18n>({ toggle: 'toggle' });
