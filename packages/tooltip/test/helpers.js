import { fire } from '@vaadin/testing-helpers';

export function mouseenter(target) {
  fire(target, 'mouseenter');
}

export function mouseleave(target) {
  fire(target, 'mouseleave');
}
