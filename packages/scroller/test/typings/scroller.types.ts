import '../../vaadin-scroller.js';
import { Scroller } from '../../vaadin-scroller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const scroller = document.createElement('vaadin-scroller');

assertType<Scroller>(scroller);

assertType<number>(scroller.tabindex);
