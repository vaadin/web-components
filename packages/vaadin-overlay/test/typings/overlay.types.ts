import '../../vaadin-overlay.js';
import { OverlayOpenedChangedEvent } from '../../vaadin-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-overlay');

overlay.addEventListener('opened-changed', (event) => {
  assertType<OverlayOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
