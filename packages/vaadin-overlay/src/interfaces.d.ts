export type OverlayRenderer = (
  root: HTMLElement,
  owner: HTMLElement,
  model?: object
) => void;

/**
 * Fired when the `opened` property changes.
 */
export type OverlayOpenedChanged = CustomEvent<{ value: boolean }>;

export interface OverlayElementEventMap {
  'opened-changed': OverlayOpenedChanged;
}

export type OverlayEventMap = HTMLElementEventMap & OverlayElementEventMap;
