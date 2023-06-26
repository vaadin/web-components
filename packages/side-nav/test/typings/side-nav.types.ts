import '../../vaadin-side-nav.js';
import '../../vaadin-side-nav-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { PolylitMixinClass } from '@vaadin/component-base/src/polylit-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SideNav, SideNavCollapsedChangedEvent } from '../../src/vaadin-side-nav';
import type { SideNavItem, SideNavItemExpandedChangedEvent } from '../../src/vaadin-side-nav-item';

const assertType = <TExpected>(actual: TExpected) => actual;

const sideNav: SideNav = document.createElement('vaadin-side-nav');

// Properties
assertType<boolean>(sideNav.collapsed);
assertType<boolean>(sideNav.collapsible);

// Mixins
assertType<ElementMixinClass>(sideNav);
assertType<PolylitMixinClass>(sideNav);
assertType<ThemableMixinClass>(sideNav);

// Events
sideNav.addEventListener('collapsed-changed', (event) => {
  assertType<SideNavCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

const sideNavItem: SideNavItem = document.createElement('vaadin-side-nav-item');

// Item properties
assertType<string | null | undefined>(sideNavItem.path);
assertType<boolean>(sideNavItem.current);
assertType<boolean>(sideNavItem.expanded);

// Item mixins
assertType<ElementMixinClass>(sideNavItem);
assertType<PolylitMixinClass>(sideNavItem);
assertType<ThemableMixinClass>(sideNavItem);

// Item Events
sideNavItem.addEventListener('expanded-changed', (event) => {
  assertType<SideNavItemExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
