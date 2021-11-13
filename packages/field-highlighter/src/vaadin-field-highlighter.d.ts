/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

export interface FieldHighlighterUser {
  id: number;
  name: string;
  colorIndex: number;
}

/**
 * A field controller for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interacted with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
declare class FieldHighlighter implements ReactiveController {
  static init(field: HTMLElement): FieldHighlighter;

  static addUser(field: HTMLElement, user: FieldHighlighterUser): void;

  static removeUser(field: HTMLElement, user: FieldHighlighterUser): void;

  static setUsers(field: HTMLElement, users: FieldHighlighterUser[]): void;

  /**
   * A user who last interacted with the field.
   */
  user: FieldHighlighterUser | null;

  /**
   * A list of users who focused the field.
   */
  users: FieldHighlighterUser[];

  hostConnected(): void;

  redraw(): void;
}

export { FieldHighlighter };
