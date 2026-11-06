export * from '@web/test-runner-commands';

type MovePayload = { type: 'move'; element: Element };

type ClickPayload = { type: 'click'; element: Element; button?: 'left' | 'middle' | 'right' };

export function sendMouseToElement(payload: MovePayload | ClickPayload): Promise<void>;

export type AccessibilityNode = {
  role: string;
  name: string;
  depth: number;
  properties: Record<string, unknown>;
};

export function getAccessibilityTree(): Promise<AccessibilityNode[] | null>;

export function setTouchEmulation(enabled: boolean): Promise<boolean>;

export function dispatchTouch(
  type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel',
  touchPoints: Array<{ x: number; y: number; id: number }>,
): Promise<boolean>;
