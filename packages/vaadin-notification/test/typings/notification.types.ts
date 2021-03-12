import '../../src/vaadin-notification';

const assert = <T>(value: T) => value;

const notification = document.createElement('vaadin-notification');

notification.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});
