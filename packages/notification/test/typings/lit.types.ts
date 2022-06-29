import type { DirectiveResult } from 'lit/directive.js';
import type { NotificationLitRenderer, NotificationRendererDirective } from '../../lit.js';
import { notificationRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<
  (renderer: NotificationLitRenderer, dependencies?: unknown) => DirectiveResult<typeof NotificationRendererDirective>
>(notificationRenderer);
