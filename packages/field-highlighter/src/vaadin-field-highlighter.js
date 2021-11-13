/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-field-outline.js';
import './vaadin-user-tags.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { CheckboxGroupObserver } from './fields/vaadin-checkbox-group-observer.js';
import { DatePickerObserver } from './fields/vaadin-date-picker-observer.js';
import { DateTimePickerObserver } from './fields/vaadin-date-time-picker-observer.js';
import { FieldObserver } from './fields/vaadin-field-observer.js';
import { ListBoxObserver } from './fields/vaadin-list-box-observer.js';
import { RadioGroupObserver } from './fields/vaadin-radio-group-observer.js';
import { SelectObserver } from './fields/vaadin-select-observer.js';

const fields = new WeakMap();

/**
 * A web component for implementing real-time collaboration features: displaying
 * a colored outline when a field is focused by another user of the application,
 * and showing an overlay with a list of users who interact with the field.
 *
 * See https://vaadin.com/collaboration for Collaboration Engine documentation.
 *
 * @extends HTMLElement
 */
export class FieldHighlighter extends PolymerElement {
  static init(field) {
    if (!fields.has(field)) {
      // Create instance
      const instance = document.createElement(this.is);
      instance._field = field;

      // Set attribute for styling
      field.setAttribute('has-highlighter', '');

      // Store instance
      fields.set(field, instance);

      // Create observer
      instance.observer = this.initFieldObserver(field);

      // Attach instance
      field.shadowRoot.appendChild(instance);
    }

    return fields.get(field);
  }

  /**
   * @protected
   */
  static initFieldObserver(field) {
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

  static get is() {
    return 'vaadin-field-highlighter';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }

  static get properties() {
    return {
      /**
       * A user currently editing the field.
       */
      user: {
        type: Object,
        value: null,
        observer: '_userChanged'
      },

      /**
       * A list of users who focused the field.
       */
      users: {
        type: Array,
        value: () => []
      }
    };
  }

  ready() {
    super.ready();

    this.redraw();
    IronA11yAnnouncer.requestAvailability();
  }

  addUser(user) {
    if (user) {
      this.push('users', user);
      this.redraw();

      // Make user active
      this.user = user;
    }
  }

  setUsers(users) {
    if (Array.isArray(users)) {
      this.set('users', users);
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
        this.splice('users', index, 1);
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
    this.observer.redraw(Array.from(this.users).reverse());
  }

  _announce(msg) {
    const label = this._field.label || '';
    this.dispatchEvent(
      new CustomEvent('iron-announce', {
        bubbles: true,
        composed: true,
        detail: {
          text: label ? `${msg} ${label}` : msg
        }
      })
    );
  }

  _userChanged(user) {
    if (user) {
      this._announce(`${user.name} started editing`);
    }
  }
}

customElements.define(FieldHighlighter.is, FieldHighlighter);
