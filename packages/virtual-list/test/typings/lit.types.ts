import type { DirectiveResult } from 'lit/directive.js';
import type { VirtualListLitRenderer, VirtualListRendererDirective } from '../../lit.js';
import { virtualListRenderer } from '../../lit.js';

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
