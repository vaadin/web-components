import type { SlottedContentChangedEvent } from '../../../src/slotted-content-controller.js';
import { SlottedContentController } from '../../../src/slotted-content-controller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const host = document.createElement('div');

class TestController extends SlottedContentController {}

const controller = new TestController(host, 'foo', { multiple: true, idPrefix: 'foo', observeContent: true });

assertType<HTMLElement>(controller.host);
assertType<string>(controller.slotName);
assertType<Node | null>(controller.node);
assertType<Node[]>(controller.nodes);
assertType<Node | null>(controller.defaultNode);
assertType<string | undefined>(controller.defaultId);
assertType<boolean>(controller.hasContent);
controller.update();
assertType<string>(SlottedContentController.generateId(host, 'foo'));

controller.addEventListener('slot-content-changed', (event) => {
  assertType<SlottedContentChangedEvent>(event);
  assertType<Node | null>(event.detail.node);
  assertType<Node[]>(event.detail.nodes);
  assertType<boolean>(event.detail.hasContent);
  assertType<boolean>(event.detail.isDefault);
});

// `create()` returns an instance of the class it is called on
assertType<TestController>(TestController.create(host, 'foo', 'div'));

assertType<SlottedContentController>(
  SlottedContentController.create(host, 'foo', null, {
    multiple: true,
    idPrefix: 'foo',
    observeContent: true,
    initializer: (node, initHost) => {
      assertType<Node>(node);
      assertType<HTMLElement>(initHost);
    },
  }),
);
