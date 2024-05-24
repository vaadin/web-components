import '../../vaadin-popover.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { PopoverPositionMixinClass } from '../../src/vaadin-popover-position-mixin.js';
import type { PopoverTargetMixinClass } from '../../src/vaadin-popover-target-mixin.js';
import type {
  PopoverOpenedChangedEvent,
  PopoverPosition,
  PopoverRenderer,
  PopoverTrigger,
} from '../../vaadin-popover.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const popover = document.createElement('vaadin-popover');

// Mixins
assertType<ElementMixinClass>(popover);
assertType<OverlayClassMixinClass>(popover);
assertType<ThemePropertyMixinClass>(popover);
assertType<PopoverPositionMixinClass>(popover);
assertType<PopoverTargetMixinClass>(popover);

// Properties
assertType<string | undefined>(popover.for);
assertType<HTMLElement | undefined>(popover.target);
assertType<PopoverPosition>(popover.position);
assertType<PopoverRenderer | null | undefined>(popover.renderer);
assertType<PopoverTrigger[] | null | undefined>(popover.trigger);
assertType<string>(popover.contentHeight);
assertType<string>(popover.contentWidth);
assertType<string>(popover.overlayClass);
assertType<boolean>(popover.opened);
assertType<boolean>(popover.modal);
assertType<boolean>(popover.withBackdrop);
assertType<boolean>(popover.noCloseOnEsc);
assertType<boolean>(popover.noCloseOnOutsideClick);

// Events
popover.addEventListener('opened-changed', (event) => {
  assertType<PopoverOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
