import '../../vaadin-overlay.js';
import {
  OverlayCloseEvent,
  OverlayEscapePressEvent,
  OverlayOpenedChangedEvent,
  OverlayOpenEvent,
  OverlayOutsideClickEvent
} from '../../vaadin-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-overlay');

overlay.addEventListener('opened-changed', (event) => {
  assertType<OverlayOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

overlay.addEventListener('vaadin-overlay-open', (event) => {
  assertType<OverlayOpenEvent>(event);
});

overlay.addEventListener('vaadin-overlay-close', (event) => {
  assertType<OverlayCloseEvent>(event);
});

overlay.addEventListener('vaadin-overlay-escape-press', (event) => {
  assertType<OverlayEscapePressEvent>(event);
  assertType<KeyboardEvent>(event.detail.sourceEvent);
});

overlay.addEventListener('vaadin-overlay-outside-click', (event) => {
  assertType<OverlayOutsideClickEvent>(event);
  assertType<MouseEvent>(event.detail.sourceEvent);
});
