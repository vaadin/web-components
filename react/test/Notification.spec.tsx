import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Notification, type WebComponentModule } from '../src/Notification.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

describe('Notification', () => {
  const overlayTag = 'vaadin-notification-container';

  const [ref, catcher] = createOverlayCloseCatcher<WebComponentModule.Notification>(overlayTag, (ref) => ref.close());

  function Renderer() {
    return <>FooBar</>;
  }

  function assert() {
    const card = document.querySelector('vaadin-notification-card');
    expect(card).not.to.be.undefined;
    expect(card!.textContent).to.equal('FooBar');
  }

  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    render(
      <Notification ref={ref} opened>
        FooBar
      </Notification>,
    );
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(<Notification ref={ref} opened renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(
      <Notification ref={ref} opened>
        {Renderer}
      </Notification>,
    );
    assert();
  });
});
