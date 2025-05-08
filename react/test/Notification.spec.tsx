import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Notification, type NotificationElement } from '../packages/react-components/src/Notification.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

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

  it('should use children if no renderer property set', () => {
    render(
      <Notification ref={ref} opened>
        FooBar
      </Notification>,
    );
    assert();
  });

  it('should use renderer prop if it is set', () => {
    render(<Notification ref={ref} opened renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', () => {
    render(
      <Notification ref={ref} opened>
        {Renderer}
      </Notification>,
    );
    assert();
  });

  describe('show()', () => {
    it('should render correctly', () => {
      ref.current = Notification.show('FooBar');
      assert();
    });
  });
});
