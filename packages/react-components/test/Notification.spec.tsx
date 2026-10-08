import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import createOverlayCloseCatcher from '../../../react/test/utils/createOverlayCloseCatcher.js';
import { Notification, type NotificationElement } from '../src/Notification.js';

describe('Notification', () => {
  const overlayTag = 'vaadin-notification-container';

  const [ref, catcher] = createOverlayCloseCatcher<NotificationElement>(overlayTag, (ref) => ref.close());

  function Renderer() {
    return <>FooBar</>;
  }

  function assert() {
    const card = document.querySelector('vaadin-notification-card');
    expect(card).to.exist;
    expect(card).to.have.text('FooBar');
  }

  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    await render(
      <Notification ref={ref} opened>
        FooBar
      </Notification>,
    );
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    await render(<Notification ref={ref} opened renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', async () => {
    await render(
      <Notification ref={ref} opened>
        {Renderer}
      </Notification>,
    );
    assert();
  });

  describe('show()', () => {
    it('should render correctly', async () => {
      ref.current = Notification.show('FooBar');
      assert();
    });
  });
});
