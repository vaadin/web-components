import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { PositionMixinClass } from '../../src/vaadin-overlay-position-mixin.js';
import { PositionMixin } from '../../src/vaadin-overlay-position-mixin.js';
import type {
  OverlayCloseEvent,
  OverlayClosingEvent,
  OverlayEscapePressEvent,
  OverlayOpenedChangedEvent,
  OverlayOpenEvent,
  OverlayOutsideClickEvent,
} from '../../vaadin-overlay.js';
import { Overlay } from '../../vaadin-overlay.js';

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

class CustomOverlay extends PositionMixin(Overlay) {
  static get is() {
    return 'custom-overlay';
  }
}

customElements.define('custom-overlay', CustomOverlay);

const customOverlay = new CustomOverlay();

assertType<PositionMixinClass>(customOverlay);
assertType<boolean>(customOverlay.noHorizontalOverlap);
assertType<boolean>(customOverlay.noVerticalOverlap);
assertType<'end' | 'start'>(customOverlay.horizontalAlign);
assertType<'bottom' | 'top'>(customOverlay.verticalAlign);
assertType<HTMLElement>(customOverlay.positionTarget);
assertType<number>(customOverlay.requiredVerticalSpace);
