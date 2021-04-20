import '../../vaadin-accordion';
import { AccordionItemsChangedEvent, AccordionOpenedChangedEvent } from '../../vaadin-accordion';
import { AccordionPanelElement } from '../../vaadin-accordion-panel';

const assertType = <TExpected>(actual: TExpected) => actual;

const accordion = document.createElement('vaadin-accordion');

/* Event detail */
accordion.addEventListener('opened-changed', (event) => {
  assertType<AccordionOpenedChangedEvent>(event);
  assertType<number | null>(event.detail.value);
});

accordion.addEventListener('items-changed', (event) => {
  assertType<AccordionItemsChangedEvent>(event);
  assertType<AccordionPanelElement[]>(event.detail.value);
});

const panel = document.createElement('vaadin-accordion-panel');

panel.addEventListener('opened-changed', (event) => {
  assertType<boolean>(event.detail.value);
});
