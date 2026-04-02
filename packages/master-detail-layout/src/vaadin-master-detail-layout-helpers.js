/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const ANIMATION_ID_PREFIX = 'vaadin-master-detail-layout';

function getAnimationParams(element) {
  const cs = getComputedStyle(element);
  const offscreen = cs.getPropertyValue('--_detail-offscreen').trim();
  const durationStr = cs.getPropertyValue('--_transition-duration').trim();
  const duration = durationStr.endsWith('ms') ? parseFloat(durationStr) : parseFloat(durationStr) * 1000;
  const easing = cs.getPropertyValue('--_transition-easing').trim();
  return { offscreen, duration, easing, opacity: cs.opacity, translate: cs.translate };
}

function animate(element, direction, effects) {
  const id = `${ANIMATION_ID_PREFIX}-${direction}-${effects.join('-')}`;

  const currentAnimation = element.getAnimations().find((animation) => {
    return animation.id.startsWith(ANIMATION_ID_PREFIX) && animation.playState === 'running';
  });
  if (currentAnimation && currentAnimation.id === id) {
    return Promise.reject(new DOMException('', 'AbortError'));
  }

  const { offscreen, duration, easing, opacity, translate } = getAnimationParams(element);

  const keyframes = {};
  if (effects.includes('fade')) {
    if (direction > 0) {
      keyframes.opacity = [currentAnimation ? opacity : 0, 1];
    } else {
      keyframes.opacity = [currentAnimation ? opacity : 1, 0];
    }
  }
  if (effects.includes('slide')) {
    if (direction > 0) {
      keyframes.translate = [currentAnimation ? translate : offscreen, 'none'];
    } else {
      keyframes.translate = [currentAnimation ? translate : 'none', offscreen];
    }
  }

  if (currentAnimation) {
    currentAnimation.cancel();
  }

  return element.animate(keyframes, { id, easing, duration }).finished;
}

export function animateIn(element, effects) {
  return animate(element, 1, effects);
}

export function animateOut(element, effects) {
  return animate(element, -1, effects);
}

export function parseTrackSizes(gridTemplate) {
  return gridTemplate
    .replace(/\[[^\]]+\]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .split(' ')
    .map(parseFloat);
}

export function detectOverflow(hostSize, trackSizes) {
  const [masterSize, masterExtra, detailSize] = trackSizes;

  if (Math.floor(masterSize + masterExtra + detailSize) <= Math.floor(hostSize)) {
    return false;
  }
  if (Math.floor(masterExtra) >= Math.floor(detailSize)) {
    return false;
  }
  return true;
}
