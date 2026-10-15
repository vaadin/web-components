import type { DirectiveResult } from 'lit/directive.js';
import type {
  DialogFooterRendererDirective,
  DialogHeaderRendererDirective,
  DialogLitRenderer,
  DialogRendererDirective,
} from '../../lit.js';
import { dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<(renderer: DialogLitRenderer, dependencies?: unknown) => DirectiveResult<typeof DialogRendererDirective>>(
  dialogRenderer,
);

assertType<
  (renderer: DialogLitRenderer, dependencies?: unknown) => DirectiveResult<typeof DialogHeaderRendererDirective>
>(dialogHeaderRenderer);

assertType<
  (renderer: DialogLitRenderer, dependencies?: unknown) => DirectiveResult<typeof DialogFooterRendererDirective>
>(dialogFooterRenderer);
