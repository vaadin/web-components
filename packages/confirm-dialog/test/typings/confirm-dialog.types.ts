import '../../vaadin-confirm-dialog.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { ConfirmDialogOpenedChangedEvent } from '../../vaadin-confirm-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-confirm-dialog');

// Mixins
assertType<ElementMixinClass>(dialog);
assertType<ThemePropertyMixinClass>(dialog);

// Properties
assertType<boolean>(dialog.opened);
assertType<boolean>(dialog.noCloseOnEsc);
assertType<boolean>(dialog.cancelButtonVisible);
assertType<boolean>(dialog.rejectButtonVisible);
assertType<string>(dialog.header);
assertType<string | null | undefined>(dialog.message);
assertType<string>(dialog.confirmText);
assertType<string>(dialog.confirmTheme);
assertType<string>(dialog.cancelText);
assertType<string>(dialog.cancelTheme);
assertType<string>(dialog.rejectText);
assertType<string>(dialog.rejectTheme);
assertType<string>(dialog.overlayClass);

// Events
dialog.addEventListener('opened-changed', (event) => {
  assertType<ConfirmDialogOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dialog.addEventListener('confirm', (event) => {
  assertType<Event>(event);
});

dialog.addEventListener('cancel', (event) => {
  assertType<Event>(event);
});

dialog.addEventListener('reject', (event) => {
  assertType<Event>(event);
});
