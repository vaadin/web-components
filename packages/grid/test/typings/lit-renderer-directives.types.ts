import { DirectiveResult } from 'lit/directive';
import {
  columnBodyRenderer,
  columnFooterRenderer,
  columnHeaderRenderer,
  GridColumnBodyLitRenderer,
  GridColumnFooterLitRenderer,
  GridColumnHeaderLitRenderer,
  GridRowDetailsLitRenderer,
  gridRowDetailsRenderer,
} from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestGridItem {
  testProperty: string;
}

assertType<(renderer: GridRowDetailsLitRenderer<TestGridItem>, value?: unknown) => DirectiveResult>(
  gridRowDetailsRenderer,
);
assertType<(renderer: GridColumnBodyLitRenderer<TestGridItem>, value?: unknown) => DirectiveResult>(columnBodyRenderer);
assertType<(renderer: GridColumnHeaderLitRenderer, value?: unknown) => DirectiveResult>(columnHeaderRenderer);
assertType<(renderer: GridColumnFooterLitRenderer, value?: unknown) => DirectiveResult>(columnFooterRenderer);
