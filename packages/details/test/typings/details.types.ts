import '../../vaadin-details.js';
import type { DetailsOpenedChangedEvent } from '../../vaadin-details.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const details = document.createElement('vaadin-details');

details.addEventListener('opened-changed', (event) => {
  assertType<DetailsOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
