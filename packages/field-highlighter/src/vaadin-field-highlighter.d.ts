/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

export interface FieldHighlighterUser {
  id: number;
  name: string;
  colorIndex: number;
  fieldIndex?: number;
}

/**
 * A field controller for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interacted with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
declare class FieldHighlighterController implements ReactiveController {
  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * An object representing a user currently editing the field.
   * The user object has the following structure:
   *
   * ```ts
   * {
   *   id: number,
   *   name: string;
   *   colorIndex: number;
   *   fieldIndex?: number;
   * }
   * ```
   */
  user: FieldHighlighterUser | null;

  /**
   * A list of users who have focused the field.
   */
  users: FieldHighlighterUser[];

  constructor(host: HTMLElement);

  hostConnected(): void;

  redraw(): void;
}

/**
 * A web component for implementing real-time collaboration features
 * by configuring a reactive controller for a field instance.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
declare class FieldHighlighter extends HTMLElement {
  static init(field: HTMLElement): FieldHighlighterController;

  static addUser(field: HTMLElement, user: FieldHighlighterUser): void;

  static removeUser(field: HTMLElement, user: FieldHighlighterUser): void;

  static setUsers(field: HTMLElement, users: FieldHighlighterUser[]): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-field-highlighter': FieldHighlighter;
  }
}

export { FieldHighlighter, FieldHighlighterController };
