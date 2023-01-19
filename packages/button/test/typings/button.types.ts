import '../../vaadin-button.js';
import type { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { TabindexMixinClass } from '@vaadin/component-base/src/tabindex-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const button = document.createElement('vaadin-button');

// Properties
assertType<boolean>(button.autofocus);
assertType<boolean>(button.disabled);

// Mixins
assertType<ActiveMixinClass>(button);
assertType<ControllerMixinClass>(button);
assertType<DisabledMixinClass>(button);
assertType<ElementMixinClass>(button);
assertType<FocusMixinClass>(button);
assertType<KeyboardMixinClass>(button);
assertType<TabindexMixinClass>(button);
assertType<ThemableMixinClass>(button);
