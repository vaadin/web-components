import { DirectiveResult } from 'lit/directive.js';
import { ContextMenuLitRenderer, contextMenuRenderer, ContextMenuRendererDirective } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<
  (renderer: ContextMenuLitRenderer, dependencies?: unknown) => DirectiveResult<typeof ContextMenuRendererDirective>
>(contextMenuRenderer);
