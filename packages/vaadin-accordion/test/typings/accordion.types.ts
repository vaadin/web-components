import '../../src/vaadin-accordion';
import { AccordionPanelElement } from '../../src/vaadin-accordion-panel';

const assert = <T>(value: T) => value;

const accordion = document.createElement('vaadin-accordion');

accordion.addEventListener('opened-changed', (event) => {
  assert<number | null>(event.detail.value);
});

accordion.addEventListener('items-changed', (event) => {
  assert<AccordionPanelElement[]>(event.detail.value);
});

const panel = document.createElement('vaadin-accordion-panel');

panel.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});
