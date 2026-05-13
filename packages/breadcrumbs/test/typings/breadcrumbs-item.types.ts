import '../../vaadin-breadcrumbs-item.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const item = document.createElement('vaadin-breadcrumbs-item');

// Properties
assertType<string | null | undefined>(item.path);
assertType<boolean>(item.current);
assertType<boolean>(item.disabled);

// Mixins
assertType<DisabledMixinClass>(item);
assertType<FocusMixinClass>(item);
