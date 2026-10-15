import '../../vaadin-progress-bar.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ProgressMixinClass } from '../../src/vaadin-progress-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const progressBar = document.createElement('vaadin-progress-bar');

// Properties
assertType<number | null | undefined>(progressBar.value);
assertType<number>(progressBar.min);
assertType<number>(progressBar.max);
assertType<boolean>(progressBar.indeterminate);

// Mixins
assertType<ProgressMixinClass>(progressBar);
assertType<ElementMixinClass>(progressBar);
assertType<ThemableMixinClass>(progressBar);
