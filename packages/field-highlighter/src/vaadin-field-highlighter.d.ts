/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface FieldHighlighterUser {
  id: number;
  name: string;
  colorIndex: number;
}

/**
 * A web component for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interacted with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
declare class FieldHighlighter extends ThemableMixin(DirMixin(HTMLElement)) {
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
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-field-highlighter': FieldHighlighter;
  }
}

export { FieldHighlighter };
