/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-field-outline.js';
import './vaadin-user-tags.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
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

const fields = new WeakMap();

/**
 * A field controller for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interact with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 */
export class FieldHighlighter {
  static init(field) {
    if (!fields.has(field)) {
      // Create instance
      const instance = new FieldHighlighter(field);

      // Set attribute for styling
      field.setAttribute('has-highlighter', '');

      // Store instance
      fields.set(field, instance);

      // Create observer
      instance.observer = initFieldObserver(field);

      // Attach controller
      field.addController(instance);
    }

    return fields.get(field);
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

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;

    if (user) {
      this._announce(`${user.name} started editing`);
    }
  }

  constructor(field) {
    this.host = field;

    /**
     * A user currently editing the field.
     * @type {FieldHighlighterUser | null}
     */
    this.user = null;

    /**
     * A list of users who focused the field.
     * @type {FieldHighlighterUsers}
     */
    this.users = [];
  }

  hostConnected() {
    this.redraw();
    IronA11yAnnouncer.requestAvailability();
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

  _announce(msg) {
    const label = this.host.label || '';
    this.host.dispatchEvent(
      new CustomEvent('iron-announce', {
        bubbles: true,
        composed: true,
        detail: {
          text: label ? `${msg} ${label}` : msg
        }
      })
    );
  }
}
