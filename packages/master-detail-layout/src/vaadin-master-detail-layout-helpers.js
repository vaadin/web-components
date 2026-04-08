/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const ANIMATION_ID = 'vaadin-master-detail-layout';

/**
 * Reads CSS custom properties from the element that control
 * animation keyframes and timing.
 *
 * @param {HTMLElement} element
 * @return {{ offset: string, easing: string, duration: number }}
 */
function getAnimationParams(element) {
  const computedStyle = getComputedStyle(element);
  const offset = computedStyle.getPropertyValue('--_transition-offset').trim();
  const easing = computedStyle.getPropertyValue('--_transition-easing').trim();
  const durationStr = computedStyle.getPropertyValue('--_transition-duration').trim();
  const duration = durationStr.endsWith('ms') ? parseFloat(durationStr) : parseFloat(durationStr) * 1000;
  return { offset, easing, duration };
}

/**
 * Returns the currently running master-detail-layout animation on the
 * element, if any. Matches by the shared animation ID and `'running'`
 * play state.
 *
 * @param {HTMLElement} element
 * @return {Animation | undefined}
 */
export function getCurrentAnimation(element) {
  return element
    .getAnimations()
    .find((animation) => animation.id === ANIMATION_ID && animation.playState !== 'finished');
}

/**
 * Returns the overall progress (0–1) of the current animation on the
 * element, computed as `currentTime / duration`. Returns 0 when no
 * animation is running.
 *
 * @param {HTMLElement} element
 * @return {number}
 */
export function getCurrentAnimationProgress(element) {
  const animation = getCurrentAnimation(element);
  if (!animation) {
    return 0;
  }
  const currentTime = animation.currentTime;
  if (currentTime == null) {
    return 0;
  }
  return currentTime / animation.effect.getTiming().duration;
}

/**
 * Animates the element using the Web Animations API. Cancels any
 * previous animation and resumes from the given progress for a
 * smooth handoff. No-op when CSS params are missing or progress is 1.
 *
 * @param {HTMLElement} element
 * @param {'in' | 'out'} direction
 * @param {Array<'fade' | 'slide'>} effects
 * @param {number} progress starting progress (0–1) for interrupted resumption
 * @return {Promise<void>} resolves when the animation finishes
 */
function animate(element, direction, effects, progress) {
  const { offset, easing, duration } = getAnimationParams(element);
  if (!offset || !duration || progress === 1) {
    return Promise.resolve();
  }

  const oldAnimation = getCurrentAnimation(element);
  if (oldAnimation) {
    oldAnimation.cancel();
  }

  const keyframes = {};
  if (effects.includes('fade')) {
    keyframes.opacity = [0, 1];
  }
  if (effects.includes('slide')) {
    keyframes.translate = [offset, 0];
  }

  const newAnimation = element.animate(keyframes, { id: ANIMATION_ID, easing, duration });
  newAnimation.pause();
  newAnimation.currentTime = duration * progress;
  newAnimation.playbackRate = direction === 'in' ? 1 : -1;
  newAnimation.play();
  return newAnimation.finished;
}

/**
 * Runs an enter animation on the element.
 *
 * @param {HTMLElement} element
 * @param {Array<'fade' | 'slide'>} effects
 * @param {number} progress starting progress (0–1) for interrupted resumption
 * @return {Promise<void>} resolves when the animation finishes
 */
export function animateIn(element, effects, progress) {
  return animate(element, 'in', effects, progress);
}

/**
 * Runs an exit animation on the element.
 *
 * @param {HTMLElement} element
 * @param {Array<'fade' | 'slide'>} effects
 * @param {number} progress starting progress (0–1) for interrupted resumption
 * @return {Promise<void>} resolves when the animation finishes
 */
export function animateOut(element, effects, progress) {
  return animate(element, 'out', effects, progress);
}

/**
 * Cancels all running animations on the element that match the shared animation ID.
 *
 * @param {HTMLElement} element
 */
export function cancelAnimations(element) {
  element.getAnimations({ subtree: true }).forEach((animation) => {
    if (animation.id === ANIMATION_ID) {
      animation.cancel();
    }
  });
}

/**
 * Parses a computed `gridTemplateColumns` / `gridTemplateRows` value
 * into an array of track sizes in pixels. Line names (e.g. `[name]`)
 * are stripped before parsing.
 *
 * @param {string} gridTemplate computed grid template string (e.g. `"200px [gap] 10px 400px"`)
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
 * @param {number} hostSize the host element's width or height in pixels
 * @param {number[]} trackSizes [masterSize, masterExtra, detailSize] in pixels
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
