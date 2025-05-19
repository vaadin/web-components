import '../../vaadin-avatar-group.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { AvatarGroupMixinClass } from '../../src/vaadin-avatar-group-mixin.js';
import type { AvatarGroupI18n, AvatarGroupItem } from '../../vaadin-avatar-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-avatar-group');

// Properties
assertType<AvatarGroupItem[] | undefined>(group.items);
assertType<number | null | undefined>(group.maxItemsVisible);
assertType<AvatarGroupI18n>(group.i18n);
assertType<string>(group.overlayClass);

// Item properties
const item: AvatarGroupItem = group.items ? group.items[0] : {};
assertType<string | undefined>(item.abbr);
assertType<string | undefined>(item.img);
assertType<string | undefined>(item.name);
assertType<number | undefined>(item.colorIndex);
assertType<string | undefined>(item.className);

// I18n
assertType<AvatarGroupI18n>({ joined: 'yesterday' });
assertType<AvatarGroupI18n>({ activeUsers: { one: '1 user' } });

// Mixins
assertType<AvatarGroupMixinClass>(group);
assertType<ElementMixinClass>(group);
assertType<I18nMixinClass<AvatarGroupI18n>>(group);
assertType<OverlayClassMixinClass>(group);
assertType<ResizeMixinClass>(group);
assertType<ThemableMixinClass>(group);
