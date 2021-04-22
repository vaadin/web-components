import '../../vaadin-overlay.js';

import { OverlayOpenedChanged } from '../../vaadin-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-overlay');

overlay.addEventListener('opened-changed', (event) => {
  assertType<OverlayOpenedChanged>(event);
});
