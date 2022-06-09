import { DirectiveResult } from 'lit/directive.js';
import {
  MultiSelectComboBoxLitRenderer,
  multiSelectComboBoxRenderer,
  MultiSelectComboBoxRendererDirective,
} from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestComboBoxItem {
  testProperty: string;
}

assertType<
  (
    renderer: MultiSelectComboBoxLitRenderer<TestComboBoxItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof MultiSelectComboBoxRendererDirective>
>(multiSelectComboBoxRenderer);
