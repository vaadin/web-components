export * from '@web/test-runner-commands';

type MovePayload = { type: 'move', element: Element };

type ClickPayload = { type: 'click', element: Element, button?: 'left' | 'middle' | 'right' }

export function sendMouseToElement(payload: MovePayload | ClickPayload): Promise<void>;
