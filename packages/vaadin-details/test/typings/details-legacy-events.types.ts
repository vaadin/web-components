import '../../vaadin-details.js';
import { DetailsOpenedChanged } from '../../vaadin-details.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const details = document.createElement('vaadin-details');

details.addEventListener('opened-changed', (event) => {
  assertType<DetailsOpenedChanged>(event);
});
