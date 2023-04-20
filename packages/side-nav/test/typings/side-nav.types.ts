import '../../vaadin-side-nav.js';
import '../../vaadin-side-nav-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { PolylitMixinClass } from '@vaadin/component-base/src/polylit-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SideNav } from '../../src/vaadin-side-nav';
import type { SideNavItem } from '../../src/vaadin-side-nav-item';

const assertType = <TExpected>(actual: TExpected) => actual;

const sideNav: SideNav = document.createElement('vaadin-side-nav');

// Properties
assertType<boolean>(sideNav.collapsed);
assertType<boolean>(sideNav.collapsible);
assertType<(event: Event) => void>(sideNav.toggleCollapsed);

// Mixins
assertType<ElementMixinClass>(sideNav);
assertType<PolylitMixinClass>(sideNav);
assertType<ThemableMixinClass>(sideNav);

const sideNavItem: SideNavItem = document.createElement('vaadin-side-nav-item');

// Item properties
assertType<string>(sideNavItem.path);
assertType<boolean>(sideNavItem.active);
assertType<boolean>(sideNavItem.expanded);
assertType<(event: MouseEvent) => void>(sideNavItem.toggleExpanded);

// Item mixins
assertType<ElementMixinClass>(sideNavItem);
assertType<PolylitMixinClass>(sideNavItem);
assertType<ThemableMixinClass>(sideNavItem);
