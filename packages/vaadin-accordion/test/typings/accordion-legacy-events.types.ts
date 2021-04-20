import '../../vaadin-accordion';
import { AccordionItemsChanged, AccordionOpenedChanged } from '../../vaadin-accordion';

const assertType = <TExpected>(actual: TExpected) => actual;

const accordion = document.createElement('vaadin-accordion');

accordion.addEventListener('opened-changed', (event) => {
  assertType<AccordionOpenedChanged>(event);
});

accordion.addEventListener('items-changed', (event) => {
  assertType<AccordionItemsChanged>(event);
});
