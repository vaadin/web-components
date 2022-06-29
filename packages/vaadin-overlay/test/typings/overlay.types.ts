import '../../vaadin-overlay.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  OverlayCloseEvent,
  OverlayClosingEvent,
  OverlayEscapePressEvent,
  OverlayOpenedChangedEvent,
  OverlayOpenEvent,
  OverlayOutsideClickEvent,
} from '../../vaadin-overlay.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const overlay = document.createElement('vaadin-overlay');

assertType<boolean>(overlay.restoreFocusOnClose);
assertType<HTMLElement | undefined>(overlay.restoreFocusNode);
assertType<DirMixinClass>(overlay);
assertType<ThemableMixinClass>(overlay);
assertType<ControllerMixinClass>(overlay);

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

overlay.addEventListener('vaadin-overlay-closing', (event) => {
  assertType<OverlayClosingEvent>(event);
});

overlay.addEventListener('vaadin-overlay-escape-press', (event) => {
  assertType<OverlayEscapePressEvent>(event);
  assertType<KeyboardEvent>(event.detail.sourceEvent);
});

overlay.addEventListener('vaadin-overlay-outside-click', (event) => {
  assertType<OverlayOutsideClickEvent>(event);
  assertType<MouseEvent>(event.detail.sourceEvent);
});
