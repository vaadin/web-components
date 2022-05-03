import { DirectiveResult } from 'lit/directive.js';
import {
  dialogFooterRenderer,
  DialogFooterRendererDirective,
  dialogHeaderRenderer,
  DialogHeaderRendererDirective,
  DialogLitRenderer,
  dialogRenderer,
  DialogRendererDirective,
} from '../../lit.js';

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
