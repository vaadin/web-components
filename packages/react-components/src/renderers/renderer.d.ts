type Slice<T, N extends number, O extends any[] = []> = O['length'] extends N
  ? T
  : T extends [infer F, ...infer R]
  ? Slice<[...R], N, [...O, F]>
  : never;

export type WebComponentRenderer = (root: HTMLElement, ...args: any[]) => void;
