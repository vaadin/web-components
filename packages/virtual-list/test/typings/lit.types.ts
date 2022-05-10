import { DirectiveResult } from 'lit/directive.js';
import { VirtualListLitRenderer, virtualListRenderer, VirtualListRendererDirective } from '../../lit.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestVirtualListItem {
  testProperty: string;
}

assertType<
  (
    renderer: VirtualListLitRenderer<TestVirtualListItem>,
    dependencies?: unknown,
  ) => DirectiveResult<typeof VirtualListRendererDirective>
>(virtualListRenderer);
