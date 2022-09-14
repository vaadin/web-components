import { fire, nextFrame } from '@vaadin/testing-helpers';

export function mouseenter(target) {
  fire(target, 'mouseenter');
}

export function mouseleave(target, relatedTarget) {
  const eventProps = relatedTarget ? { relatedTarget } : {};
  fire(target, 'mouseleave', undefined, eventProps);
}

export async function waitForIntersectionObserver() {
  await nextFrame();
  await nextFrame();
  await nextFrame();
}
