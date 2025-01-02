/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-field-outline.js';
import './vaadin-user-tags.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { CheckboxGroupObserver } from './fields/vaadin-checkbox-group-observer.js';
import { DatePickerObserver } from './fields/vaadin-date-picker-observer.js';
import { DateTimePickerObserver } from './fields/vaadin-date-time-picker-observer.js';
import { FieldObserver } from './fields/vaadin-field-observer.js';
import { ListBoxObserver } from './fields/vaadin-list-box-observer.js';
import { RadioGroupObserver } from './fields/vaadin-radio-group-observer.js';
import { SelectObserver } from './fields/vaadin-select-observer.js';

const initFieldObserver = (field) => {
  let result;
  switch (field.tagName.toLowerCase()) {
    /* c8 ignore next */
    case 'vaadin-date-picker':
      result = new DatePickerObserver(field);
      break;
    /* c8 ignore next */
    case 'vaadin-date-time-picker':
      result = new DateTimePickerObserver(field);
      break;
    /* c8 ignore next */
    case 'vaadin-select':
      result = new SelectObserver(field);
      break;
    /* c8 ignore next 2 */
    case 'vaadin-checkbox-group':
      result = new CheckboxGroupObserver(field);
      break;
    case 'vaadin-radio-group':
      result = new RadioGroupObserver(field);
      break;
    case 'vaadin-list-box':
      result = new ListBoxObserver(field);
      break;
    default:
      result = new FieldObserver(field);
  }
  return result;
};

/**
 * A field controller for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interact with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
export class FieldHighlighterController {
  constructor(host) {
    this.host = host;

    /**
     * An object representing a user currently editing the field.
     * The user object has the following structure:
     *
     * ```js
     * {
     *   id: number,
     *   name: string;
     *   colorIndex: number;
     *   fieldIndex: number;
     * }
     * ```
     *
     * @type {FieldHighlighterUser | null}
     */
    this.user = null;

    /**
     * A list of users who have focused the field.
     * @type {FieldHighlighterUsers}
     */
    this.users = [];
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;

    if (user) {
      const msg = `${user.name} started editing`;
      const { label } = this.host;
      announce(label ? `${msg} ${label}` : msg);
    }
  }

  hostConnected() {
    this.redraw();
  }

  addUser(user) {
    if (user) {
      this.users.push(user);
      this.redraw();

      // Make user active
      this.user = user;
    }
  }

  setUsers(users) {
    if (Array.isArray(users)) {
      this.users = users;
      this.redraw();

      // Make user active
      this.user = users[users.length - 1] || null;
    }
  }

  removeUser(user) {
    if (user && user.id !== undefined) {
      let index;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === user.id) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        this.users.splice(index, 1);
        this.redraw();

        // Change or remove active user
        if (this.users.length > 0) {
          this.user = this.users[this.users.length - 1];
        } else {
          this.user = null;
        }
      }
    }
  }

  redraw() {
    this.observer.redraw([...this.users].reverse());
  }
}

/**
 * A web component for implementing real-time collaboration features
 * by configuring a reactive controller for a field instance.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 *
 * @customElement
 */
export class FieldHighlighter extends HTMLElement {
  static get is() {
    return 'vaadin-field-highlighter';
  }

  static init(field) {
    if (!field._highlighterController) {
      // Create instance
      const instance = new FieldHighlighterController(field);

      // Set attribute for styling
      field.setAttribute('has-highlighter', '');

      // Create observer
      instance.observer = initFieldObserver(field);

      // Attach controller
      field.addController(instance);

      field._highlighterController = instance;
    }

    return field._highlighterController;
  }

  static addUser(field, user) {
    this.init(field).addUser(user);
  }

  static removeUser(field, user) {
    this.init(field).removeUser(user);
  }

  static setUsers(field, users) {
    this.init(field).setUsers(users);
  }
}

defineCustomElement(FieldHighlighter);
