/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const ANIMATION_ID_PREFIX = 'vaadin-master-detail-layout';

/**
 * Reads CSS custom properties and computed styles from the element
 * that are needed to construct animation keyframes.
 *
 * @param {HTMLElement} element
 * @return {{ offscreen: string, duration: number, easing: string, opacity: string, translate: string }}
 */
function getAnimationParams(element) {
  const cs = getComputedStyle(element);
  const offscreen = cs.getPropertyValue('--_detail-offscreen').trim();
  const durationStr = cs.getPropertyValue('--_transition-duration').trim();
  const duration = durationStr.endsWith('ms') ? parseFloat(durationStr) : parseFloat(durationStr) * 1000;
  const easing = cs.getPropertyValue('--_transition-easing').trim();
  return { offscreen, duration, easing, opacity: cs.opacity, translate: cs.translate };
}

/**
 * Runs a Web Animations API animation on the element. If an animation
 * from a previous call is already running on the same element, it is
 * cancelled and the new animation continues from the current visual state.
 * If the exact same animation is already running, rejects with an AbortError.
 *
 * @param {HTMLElement} element - the element to animate
 * @param {1 | -1} direction - 1 for "in" (enter), -1 for "out" (exit)
 * @param {string[]} effects - list of effect names to apply (`'fade'`, `'slide'`)
 * @return {Promise<Animation>} resolves when the animation finishes
 */
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

/**
 * Runs an enter animation on the element.
 *
 * @param {HTMLElement} element
 * @param {string[]} effects - list of effect names to apply (`'fade'`, `'slide'`)
 * @return {Promise<Animation>}
 */
export function animateIn(element, effects) {
  return animate(element, 1, effects);
}

/**
 * Runs an exit animation on the element.
 *
 * @param {HTMLElement} element
 * @param {string[]} effects - list of effect names to apply (`'fade'`, `'slide'`)
 * @return {Promise<Animation>}
 */
export function animateOut(element, effects) {
  return animate(element, -1, effects);
}

/**
 * Parses a computed `gridTemplateColumns` / `gridTemplateRows` value
 * into an array of track sizes in pixels. Line names (e.g. `[name]`)
 * are stripped before parsing.
 *
 * @param {string} gridTemplate - computed grid template string (e.g. `"200px [gap] 10px 400px"`)
 * @return {number[]} track sizes in pixels
 */
export function parseTrackSizes(gridTemplate) {
  return gridTemplate
    .replace(/\[[^\]]+\]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .split(' ')
    .map(parseFloat);
}

/**
 * Determines whether the detail area overflows the host element,
 * meaning it should be shown as an overlay instead of side-by-side.
 *
 * Returns `false` when all tracks fit within the host, or when the
 * master's extra space (flexible portion) is large enough to absorb
 * the detail column.
 *
 * @param {number} hostSize - the host element's width or height in pixels
 * @param {number[]} trackSizes - `[masterSize, masterExtra, detailSize]` in pixels
 * @return {boolean} `true` if the detail overflows and should be overlaid
 */
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
