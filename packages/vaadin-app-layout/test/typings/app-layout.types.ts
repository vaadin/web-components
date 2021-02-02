import '../../src/vaadin-app-layout';

const assert = <T>(value: T) => value;

const layout = document.createElement('vaadin-app-layout');

layout.addEventListener('drawer-opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

layout.addEventListener('overlay-changed', (event) => {
  assert<boolean>(event.detail.value);
});

layout.addEventListener('primary-section-changed', (event) => {
  assert<'navbar' | 'drawer'>(event.detail.value);
});
