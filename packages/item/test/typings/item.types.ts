import '../../vaadin-item.js';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ItemMixinClass } from '../../src/vaadin-item-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const item = document.createElement('vaadin-item');

// Properties
assertType<string>(item.value);
assertType<string | undefined>(item.label);
assertType<boolean>(item.selected);
assertType<boolean>(item.disabled);

// Mixins
assertType<ActiveMixinClass>(item);
assertType<DisabledMixinClass>(item);
assertType<FocusMixinClass>(item);
assertType<ItemMixinClass>(item);
assertType<DirMixinClass>(item);
assertType<ThemableMixinClass>(item);
