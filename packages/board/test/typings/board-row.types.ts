import '../../vaadin-board-row.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { BoardRowMixinClass } from '../../src/vaadin-board-row-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const row = document.createElement('vaadin-board-row');

// Methods
assertType<() => void>(row.redraw);

// Mixins
assertType<BoardRowMixinClass>(row);
assertType<ResizeMixinClass>(row);
assertType<ElementMixinClass>(row);
