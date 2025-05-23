import '../../vaadin-message.js';
import '../../vaadin-message-list.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { MessageListItem } from '../../vaadin-message-list.js';

const assertType = <TExpected>(value: TExpected) => value;

const list = document.createElement('vaadin-message-list');

// Properties
assertType<MessageListItem[] | null | undefined>(list.items);
assertType<boolean | undefined>(list.markdown);
assertType<boolean | undefined>(list.announceMessages);

// Item properties
const item: MessageListItem = list.items ? list.items[0] : {};
assertType<string | undefined>(item.text);
assertType<string | undefined>(item.time);
assertType<string | undefined>(item.userName);
assertType<string | undefined>(item.userAbbr);
assertType<string | undefined>(item.userImg);
assertType<number | undefined>(item.userColorIndex);
assertType<string | undefined>(item.theme);
assertType<string | undefined>(item.className);

// Mixins
assertType<ElementMixinClass>(list);
assertType<ThemableMixinClass>(list);

const message = document.createElement('vaadin-message');

// Message properties
assertType<string | null | undefined>(message.time);
assertType<string | null | undefined>(message.userName);
assertType<string | null | undefined>(message.userAbbr);
assertType<string | null | undefined>(message.userImg);
assertType<number | null | undefined>(message.userColorIndex);

assertType<ElementMixinClass>(message);
assertType<FocusMixinClass>(message);
assertType<ThemableMixinClass>(message);
