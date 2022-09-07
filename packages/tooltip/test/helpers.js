import { fire, nextFrame } from '@vaadin/testing-helpers';

export function mouseenter(target) {
  fire(target, 'mouseenter');
}

export function mouseleave(target) {
  fire(target, 'mouseleave');
}

export async function waitForIntersectionObserver() {
  await nextFrame();
  await nextFrame();
  await nextFrame();
}
