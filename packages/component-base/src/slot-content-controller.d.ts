/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

export interface SlotContentControllerConfig {
  /**
   * Keep all the custom nodes as content, instead of a single one.
   */
  multiple?: boolean;

  /**
   * Prefix of the ID generated for content that has no ID of its own,
   * so that the host can reference it from ARIA attributes.
   */
  idPrefix?: string;

  /**
   * Observe text and child changes of the content, so that `slot-content-changed`
   * is also dispatched when `hasContent` changes.
   */
  observeContent?: boolean;
}

export type SlotContentChangedEvent = CustomEvent<{
  node: Node | null;
  nodes: Node[];
  hasContent: boolean;
  isDefault: boolean;
}>;

export interface SlotContentControllerEventMap {
  'slot-content-changed': SlotContentChangedEvent;
}

/**
 * A controller that manages the content of a slot: the custom nodes slotted
 * by the user, or a default node created by the controller when there are none.
 * Subclasses override the hooks to create the default node and to set up,
 * update and tear down the content nodes. The host calls `update()` when
 * a property used by the hooks changes, and listens for `slot-content-changed`.
 *
 * In single mode, a newly slotted custom node replaces the current one.
 * With the `multiple` option, all the custom nodes are kept as content.
 */
export class SlotContentController extends EventTarget implements ReactiveController {
  /**
   * Generate an ID unique per host instance.
   */
  static generateId(host: HTMLElement, prefix: string): string;

  /**
   * Create a controller that creates the default node from the tag name, and
   * runs the initializer once for every node that becomes content, default or
   * custom. For the cases that do not need a subclass.
   */
  static create<T extends SlotContentController>(
    this: new (...args: any[]) => T,
    host: HTMLElement,
    slotName: string,
    tagName: string | null,
    config?: SlotContentControllerConfig & { initializer?(node: Node, host: HTMLElement): void },
  ): T;

  constructor(host: HTMLElement, slotName: string, config?: SlotContentControllerConfig);

  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * The name of the managed slot, an empty string for the default slot.
   */
  slotName: string;

  /**
   * The current content node, or the first one in `multiple` mode.
   */
  node: Node | null;

  /**
   * The current content nodes.
   */
  nodes: Node[];

  /**
   * The default node created by `createDefaultNode()`, also when not in the DOM.
   */
  defaultNode: Node | null;

  /**
   * The ID generated from `idPrefix` for content that has no ID of its own.
   */
  defaultId: string | undefined;

  /**
   * Whether the content has any text or elements.
   */
  readonly hasContent: boolean;

  protected multiple: boolean;

  protected observeContent: boolean;

  hostConnected(): void;

  /**
   * Update the content to match the slot children and the host state, running
   * the hooks for the nodes that changed and `_updateNode()` for all of them,
   * then dispatch `slot-content-changed`. Does nothing before `hostConnected()`.
   */
  update(): void;

  /**
   * Override to create the default node. Return `null` for no default content.
   */
  protected createDefaultNode(): Node | null;

  /**
   * Override to control whether the default node is in the DOM, e.g. only
   * while the host property it shows is not empty.
   */
  protected shouldRenderDefaultNode(): boolean;

  /**
   * Override to set up a node once it becomes content, e.g. to add listeners.
   */
  protected _initNode(node: Node): void;

  /**
   * Override to apply the host state to a content node. Runs after `_initNode()`
   * and on every `update()`, for default and custom nodes alike.
   */
  protected _updateNode(node: Node): void;

  /**
   * Override to clean up a node once it stops being content.
   */
  protected _teardownNode(node: Node): void;

  addEventListener<K extends keyof SlotContentControllerEventMap>(
    type: K,
    listener: (this: SlotContentController, ev: SlotContentControllerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SlotContentControllerEventMap>(
    type: K,
    listener: (this: SlotContentController, ev: SlotContentControllerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}
