/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { initOutline } from './outline.js';

export class ComponentObserver {
  constructor(component) {
    this.component = component;
    this.initTags(component);
  }

  getFields() {
    return [this.component];
  }

  getFieldIndex(field) {
    return this.getFields().indexOf(field);
  }

  getFocusTarget(_event) {
    return this.component;
  }

  initTags(component) {
    const tags = document.createElement('vaadin-user-tags');
    component.shadowRoot.appendChild(tags);
    tags.target = component;
    this._tags = tags;

    component.addEventListener('mouseenter', (event) => {
      // Ignore mouseleave on overlay opening
      if (event.relatedTarget === this._tags.$.overlay) {
        return;
      }
      this._mouse = true;
      this._mouseDebouncer = Debouncer.debounce(this._mouseDebouncer, timeOut.after(200), () => {
        if (this._mouse) {
          this._tags.show();
        }
      });
    });

    component.addEventListener('mouseleave', (event) => {
      // Ignore mouseleave on overlay opening
      if (event.relatedTarget === this._tags.$.overlay) {
        return;
      }
      this._mouse = false;
      if (!this._hasFocus) {
        this._tags.hide();
      }
    });

    component.addEventListener('vaadin-highlight-show', (_event) => {
      this._hasFocus = true;

      if (this._debouncer && this._debouncer.isActive()) {
        this._debouncer.cancel();
      } else {
        this._tags.show();
      }
    });

    component.addEventListener('vaadin-highlight-hide', (_event) => {
      this._hasFocus = false;

      if (!this._mouse) {
        this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(1), () => {
          this._tags.hide();
        });
      }
    });

    this._tags.$.overlay.addEventListener('mouseleave', (event) => {
      // Ignore mouseleave when moving back to field
      if (event.relatedTarget === component) {
        return;
      }
      this._mouse = false;
      if (!component.hasAttribute('focused')) {
        this._tags.hide();
      }
    });
  }

  setOutlines(users) {
    const fields = this.getFields();
    fields.forEach((field, idx) => {
      const { outline } = initOutline(field);
      const index = fields.length === 1 ? 0 : users.map((user) => user.fieldIndex).indexOf(idx);
      outline.user = users[index];
    });
  }

  showOutline(field) {
    this.fire('show', field);
  }

  hideOutline(field) {
    this.fire('hide', field);
  }

  fire(action, field) {
    this.component.dispatchEvent(
      new CustomEvent(`vaadin-highlight-${action}`, {
        bubbles: true,
        composed: true,
        detail: { fieldIndex: this.getFieldIndex(field) },
      }),
    );
  }

  redraw(users) {
    this._tags.setUsers(users);
    this.setOutlines(users);
  }
}
