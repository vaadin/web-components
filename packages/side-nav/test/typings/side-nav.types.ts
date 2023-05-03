import '../../vaadin-side-nav.js';
import '../../vaadin-side-nav-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { PolylitMixinClass } from '@vaadin/component-base/src/polylit-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SideNav } from '../../src/vaadin-side-nav';

const assertType = <TExpected>(actual: TExpected) => actual;

const sideNav: SideNav = document.createElement('vaadin-side-nav');

// Mixins
assertType<ElementMixinClass>(sideNav);
assertType<PolylitMixinClass>(sideNav);
assertType<ThemableMixinClass>(sideNav);
