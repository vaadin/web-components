export type OverlayRenderer = (root: HTMLElement, owner: HTMLElement, model?: object) => void;

/**
 * Fired when the `opened` property changes.
 */
export type OverlayOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface OverlayElementEventMap {
  'opened-changed': OverlayOpenedChangedEvent;
}

export type OverlayEventMap = HTMLElementEventMap & OverlayElementEventMap;
