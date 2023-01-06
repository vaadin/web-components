import '../../vaadin-avatar-group.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { AvatarGroupI18n, AvatarGroupItem } from '../../vaadin-avatar-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-avatar-group');

// Properties
assertType<AvatarGroupItem[] | undefined>(group.items);
assertType<number | null | undefined>(group.maxItemsVisible);
assertType<AvatarGroupI18n>(group.i18n);
assertType<string>(group.overlayClass);

// Mixins
assertType<ControllerMixinClass>(group);
assertType<ElementMixinClass>(group);
assertType<OverlayClassMixinClass>(group);
assertType<ResizeMixinClass>(group);
assertType<ThemableMixinClass>(group);
