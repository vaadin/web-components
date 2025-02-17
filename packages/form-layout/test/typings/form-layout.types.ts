import '../../vaadin-form-layout.js';
import '../../vaadin-form-item.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const layout = document.createElement('vaadin-form-layout');
const responsiveSteps = layout.responsiveSteps[0];
const labelsPosition = responsiveSteps.labelsPosition;

// Properties
assertType<boolean>(layout.autoResponsive);
assertType<string>(layout.columnWidth);
assertType<number>(layout.maxColumns);

assertType<string | 0 | undefined>(responsiveSteps.minWidth);
assertType<number | undefined>(responsiveSteps.columns);
assertType<'aside' | 'top' | undefined>(labelsPosition);

// Mixins
assertType<ResizeMixinClass>(layout);
assertType<ElementMixinClass>(layout);
assertType<ThemableMixinClass>(layout);
