import '../../vaadin-side-nav.js';
import '../../vaadin-side-nav-item.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { PolylitMixinClass } from '@vaadin/component-base/src/polylit-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SideNav, SideNavCollapsedChangedEvent, SideNavI18n } from '../../src/vaadin-side-nav';
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
assertType<PolylitMixinClass>(sideNav);
assertType<ThemableMixinClass>(sideNav);
assertType<SideNavChildrenMixinClass>(sideNav);

// Events
sideNav.addEventListener('collapsed-changed', (event) => {
  assertType<SideNavCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

const sideNavItem: SideNavItem = document.createElement('vaadin-side-nav-item');

// Item properties
assertType<string | null | undefined>(sideNavItem.path);
assertType<boolean>(sideNavItem.current);
assertType<disabled>(sideNavItem.expanded);
assertType<boolean>(sideNavItem.expanded);
assertType<SideNavI18n>(sideNavItem.i18n);

// Item mixins
assertType<DisabledMixinClass>(sideNavItem);
assertType<ElementMixinClass>(sideNavItem);
assertType<PolylitMixinClass>(sideNavItem);
assertType<ThemableMixinClass>(sideNavItem);
assertType<SideNavChildrenMixinClass>(sideNavItem);

// Item Events
sideNavItem.addEventListener('expanded-changed', (event) => {
  assertType<SideNavItemExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
