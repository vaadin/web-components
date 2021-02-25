import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';

export function arrowDown(target) {
  keyDownOn(target, 40, [], 'ArrowDown');
}

export function arrowRight(target) {
  keyDownOn(target, 39, [], 'ArrowRight');
}

export function arrowUp(target) {
  keyDownOn(target, 38, [], 'ArrowUp');
}

export function arrowLeft(target) {
  keyDownOn(target, 37, [], 'ArrowLeft');
}

export function home(target) {
  keyDownOn(target, 36, [], 'Home');
}

export function end(target) {
  keyDownOn(target, 35, [], 'End');
}

export function keyDownChar(target, letter, modifier) {
  keyDownOn(target, letter.charCodeAt(0), modifier, letter);
}
