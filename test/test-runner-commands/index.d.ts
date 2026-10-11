export * from '@web/test-runner-commands';

type MovePayload = { type: 'move'; element: Element };

type ClickPayload = { type: 'click'; element: Element; button?: 'left' | 'middle' | 'right' };

export function sendMouseToElement(payload: MovePayload | ClickPayload): Promise<void>;

export type A11yNode = {
  role: string;
  name: string;
  value?: string;
  description?: string;
  states?: Record<string, boolean | number | string>;
  relations?: Record<string, Array<{ role: string; name: string }>>;
  children?: A11yNode[];
};

export function getA11yTree(element: Element): Promise<A11yNode[]>;
