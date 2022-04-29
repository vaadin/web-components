import '../../vaadin-dialog.js';
import { DirectiveResult } from 'lit/directive.js';
import {
  DialogLitRenderer,
  DialogOpenedChangedEvent,
  DialogRenderer,
  dialogRenderer,
  DialogResizeDimensions,
  DialogResizeEvent,
} from '../../vaadin-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assertType<DialogOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dialog.addEventListener('resize', (event) => {
  assertType<DialogResizeEvent>(event);
  assertType<DialogResizeDimensions>(event.detail);
});

// Properties
assertType<string | null | undefined>(dialog.headerTitle);
assertType<DialogRenderer | null | undefined>(dialog.renderer);
assertType<DialogRenderer | null | undefined>(dialog.headerRenderer);
assertType<DialogRenderer | null | undefined>(dialog.footerRenderer);
assertType<() => void>(dialog.requestContentUpdate);

assertType<(renderer: DialogLitRenderer, value?: unknown) => DirectiveResult>(dialogRenderer);
