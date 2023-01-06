import '../../vaadin-avatar-group.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { AvatarGroupI18n, AvatarGroupItem } from '../../vaadin-avatar-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-avatar-group');

// Properties
assertType<AvatarGroupItem[] | undefined>(group.items);
assertType<number | null | undefined>(group.maxItemsVisible);
assertType<AvatarGroupI18n>(group.i18n);

// Mixins
assertType<ElementMixinClass>(group);
assertType<ResizeMixinClass>(group);
assertType<ThemableMixinClass>(group);
