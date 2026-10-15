import '../../vaadin-board.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;

const board = document.createElement('vaadin-board');

// Methods
assertType<() => void>(board.redraw);

// Mixins
assertType<ElementMixinClass>(board);
