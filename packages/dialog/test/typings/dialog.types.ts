import '../../vaadin-dialog.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { DialogDraggableMixinClass } from '../../src/vaadin-dialog-draggable-mixin.js';
import type { DialogResizableMixinClass } from '../../src/vaadin-dialog-resizable-mixin.js';
import type {
  Dialog,
  DialogOpenedChangedEvent,
  DialogRenderer,
  DialogResizeDimensions,
  DialogResizeEvent,
} from '../../vaadin-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-dialog');

// Mixins
assertType<ElementMixinClass>(dialog);
assertType<OverlayClassMixinClass>(dialog);
assertType<ThemePropertyMixinClass>(dialog);
assertType<DialogDraggableMixinClass>(dialog);
assertType<DialogResizableMixinClass>(dialog);

// Events
dialog.addEventListener('opened-changed', (event) => {
  assertType<DialogOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dialog.addEventListener('resize', (event) => {
  assertType<DialogResizeEvent>(event);
  assertType<DialogResizeDimensions>(event.detail);
});

// Properties
assertType<boolean>(dialog.opened);
assertType<boolean>(dialog.modeless);
assertType<boolean>(dialog.draggable);
assertType<boolean>(dialog.resizable);
assertType<boolean>(dialog.noCloseOnEsc);
assertType<boolean>(dialog.noCloseOnOutsideClick);
assertType<string>(dialog.overlayClass);
assertType<string | null | undefined>(dialog.headerTitle);
assertType<DialogRenderer | null | undefined>(dialog.renderer);
assertType<DialogRenderer | null | undefined>(dialog.headerRenderer);
assertType<DialogRenderer | null | undefined>(dialog.footerRenderer);
assertType<() => void>(dialog.requestContentUpdate);

const renderer: DialogRenderer = (root, owner) => {
  assertType<HTMLElement>(root);
  assertType<Dialog>(owner);
};

dialog.renderer = renderer;
