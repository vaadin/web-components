import '../../vaadin-form-layout.js';
import '../../vaadin-form-item.js';
import '../../vaadin-form-row.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { FormRow } from '../../vaadin-form-row.js';

const assertType = <TExpected>(value: TExpected) => value;

const layout = document.createElement('vaadin-form-layout');
const responsiveSteps = layout.responsiveSteps[0];
const labelsPosition = responsiveSteps.labelsPosition;

// Properties
assertType<boolean>(layout.autoResponsive);
assertType<string>(layout.columnWidth);
assertType<number>(layout.maxColumns);
assertType<boolean>(layout.autoRows);
assertType<boolean>(layout.expandColumns);

assertType<string | 0 | undefined>(responsiveSteps.minWidth);
assertType<number | undefined>(responsiveSteps.columns);
assertType<'aside' | 'top' | undefined>(labelsPosition);

// Mixins
assertType<ResizeMixinClass>(layout);
assertType<ElementMixinClass>(layout);
assertType<ThemableMixinClass>(layout);

const row = document.createElement('vaadin-form-row');
assertType<FormRow>(row);
