import '../../vaadin-avatar.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { AvatarMixinClass } from '../../src/vaadin-avatar-mixin.js';
import type { AvatarI18n } from '../../vaadin-avatar.js';

const assertType = <TExpected>(value: TExpected) => value;

const avatar = document.createElement('vaadin-avatar');

// Properties
assertType<string | null | undefined>(avatar.img);
assertType<string | null | undefined>(avatar.abbr);
assertType<string | null | undefined>(avatar.name);
assertType<number | null | undefined>(avatar.colorIndex);
assertType<AvatarI18n>(avatar.i18n);
assertType<boolean>(avatar.withTooltip);

// Mixins
assertType<AvatarMixinClass>(avatar);
assertType<FocusMixinClass>(avatar);
assertType<I18nMixinClass<AvatarI18n>>(avatar);
assertType<ElementMixinClass>(avatar);
assertType<ThemableMixinClass>(avatar);
