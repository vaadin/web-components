import { DirectiveResult } from 'lit/directive.js';
import { NotificationLitRenderer, notificationRenderer, NotificationRendererDirective } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<
  (renderer: NotificationLitRenderer, dependencies?: unknown) => DirectiveResult<typeof NotificationRendererDirective>
>(notificationRenderer);
