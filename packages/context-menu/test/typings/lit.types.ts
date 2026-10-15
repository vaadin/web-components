import type { DirectiveResult } from 'lit/directive.js';
import type { ContextMenuLitRenderer, ContextMenuRendererDirective } from '../../lit.js';
import { contextMenuRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<
  (renderer: ContextMenuLitRenderer, dependencies?: unknown) => DirectiveResult<typeof ContextMenuRendererDirective>
>(contextMenuRenderer);
