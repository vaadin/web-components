/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

export interface SlotContentControllerConfig {
  /**
   * Set to `true` to keep all the custom nodes slotted by the user as content,
   * instead of a single one.
   */
  multiple?: boolean;

  /**
   * The prefix of the ID generated for the content, so that the host can
   * reference it from ARIA attributes. The ID is assigned to the default node,
   * and to a custom node that has no ID of its own.
   */
  idPrefix?: string;

  /**
   * Set to `true` to observe text and child changes of the content, so that
   * `content-changed` is also dispatched when `hasContent` changes.
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
  'content-changed': SlotContentChangedEvent;
}

/**
 * A controller that manages the content of a slot: either the custom nodes
 * slotted by the user, or a default node that the controller creates when
 * nothing custom is slotted. Custom content always wins over the default.
 *
 * Subclasses customize the behavior by overriding the hooks:
 *
 * - `createDefault()` returns the default node, or `null` for no default content.
 * - `shouldShowDefault()` tells whether the default node belongs in the DOM.
 * - `initNode(node)` runs once when a node becomes content, default or custom.
 * - `updateNode(node)` runs after `initNode()` and on every `update()`.
 * - `teardownNode(node)` runs once when a node stops being content.
 *
 * The host calls `update()` when a property used by the hooks changes,
 * and listens for the `content-changed` event to react to the content.
 *
 * In single mode, a newly slotted custom node replaces the current one.
 * With the `multiple` option, all the custom nodes are kept as content.
 */
export class SlotContentController extends EventTarget implements ReactiveController {
  /**
   * Generate an ID that is unique per host instance.
   */
  static generateId(host: HTMLElement, prefix: string): string;

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
   * The default node created by `createDefault()`, whether or not it is in the DOM.
   */
  defaultNode: Node | null;

  /**
   * The ID assigned to the content that has none, when `idPrefix` is set.
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
   * Update the content to match the slot children and the host state.
   * Attaches the default node when there is no custom content, calls
   * `teardownNode()` for the nodes that stopped being content, `initNode()`
   * for the new ones and `updateNode()` for all of them, then dispatches
   * the `content-changed` event. Does nothing until the controller is
   * connected to the host.
   */
  update(): void;

  /**
   * Override to create the default node, used as content when nothing
   * custom is slotted. Return `null` when the slot has no default content.
   */
  protected createDefault(): Node | null;

  /**
   * Override to tell whether the default node belongs in the DOM. Only asked
   * when nothing custom is slotted. Return `false` to create the default node
   * lazily, or to remove it, e.g. while the host property it shows is empty.
   */
  protected shouldShowDefault(): boolean;

  /**
   * Override to set up a node once it becomes content, default or custom,
   * e.g. to add event listeners. Runs after the generated ID is assigned.
   */
  protected initNode(node: Node): void;

  /**
   * Override to make a content node reflect the host state. Runs after
   * `initNode()` and on every `update()`, for default and custom nodes alike.
   */
  protected updateNode(node: Node): void;

  /**
   * Override to clean up a node once it stops being content, e.g. to remove
   * the event listeners added in `initNode()`.
   */
  protected teardownNode(node: Node): void;

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
