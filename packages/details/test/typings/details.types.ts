import '../../vaadin-details.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { CollapsibleMixinClass } from '../../src/collapsible-mixin.js';
import type { DetailsOpenedChangedEvent } from '../../vaadin-details.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const details = document.createElement('vaadin-details');

details.addEventListener('opened-changed', (event) => {
  assertType<DetailsOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

// Mixins
assertType<CollapsibleMixinClass>(details);
assertType<DelegateFocusMixinClass>(details);
assertType<DelegateStateMixinClass>(details);
assertType<DisabledMixinClass>(details);
assertType<ElementMixinClass>(details);
assertType<FocusMixinClass>(details);
assertType<TabindexMixinClass>(details);
assertType<ThemableMixinClass>(details);
