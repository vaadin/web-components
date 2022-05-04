import { DirectiveResult } from 'lit/directive';
import {
  columnBodyRenderer,
  columnFooterRenderer,
  columnHeaderRenderer,
  GridColumnBodyLitRenderer,
  GridColumnBodyRendererDirective,
  GridColumnFooterLitRenderer,
  GridColumnFooterRendererDirective,
  GridColumnHeaderLitRenderer,
  GridColumnHeaderRendererDirective,
  GridRowDetailsLitRenderer,
  gridRowDetailsRenderer,
  GridRowDetailsRendererDirective,
} from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestGridItem {
  testProperty: string;
}

assertType<
  (
    renderer: GridRowDetailsLitRenderer<TestGridItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridRowDetailsRendererDirective>
>(gridRowDetailsRenderer);

assertType<
  (
    renderer: GridColumnBodyLitRenderer<TestGridItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnBodyRendererDirective>
>(columnBodyRenderer);

assertType<
  (
    renderer: GridColumnHeaderLitRenderer,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnHeaderRendererDirective>
>(columnHeaderRenderer);

assertType<
  (
    renderer: GridColumnFooterLitRenderer,
    dependencies?: unknown,
  ) => DirectiveResult<typeof GridColumnFooterRendererDirective>
>(columnFooterRenderer);
