/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { get, set } from '@polymer/polymer/lib/utils/path.js';

/**
 * Convenience utility for capitalizing a string, with
 * replacing non-alphanumeric characters with spaces.
 *
 * @param {string} path
 * @return {string}
 */
export function capitalize(path) {
  return path
    .toLowerCase()
    .replace(/([^\w]+)/gu, ' ')
    .trim()
    .replace(/^./u, (c) => c.toUpperCase());
}

/**
 * Convenience utility for reading a value from a path.
 *
 * @param {string} path
 * @param {Object} obj
 * @return {*}
 */
export function getProperty(path, obj) {
  return get(obj, path);
}

/**
 * Convenience utility for setting a value to a path.
 *
 * Note, if any part in the path is undefined, this
 * function initializes it with an empty object.
 *
 * @param {string} path
 * @param {*} value
 * @param {Object} obj
 */
export function setProperty(path, value, obj) {
  if (obj && path) {
    path
      .split('.')
      .slice(0, -1)
      .reduce((o, p) => {
        // Create an object
        if (!o[p]) {
          o[p] = {};
        }
        return o[p];
      }, obj);

    set(obj, path, value);
  }
}

export function isValidEditorPosition(editorPosition) {
  return ['bottom', 'aside'].includes(editorPosition);
}

export function editColumnDefaultRenderer(root, column) {
  let edit = root.firstElementChild;
  if (!edit) {
    edit = document.createElement('vaadin-crud-edit');
    if (column.hasAttribute('theme')) {
      edit.setAttribute('theme', column.getAttribute('theme'));
    }
    root.appendChild(edit);
  }

  if (column.ariaLabel) {
    edit.setAttribute('aria-label', column.ariaLabel);
  } else {
    edit.removeAttribute('aria-label');
  }
}

export function createField(crudForm, parent, path) {
  const field = document.createElement('vaadin-text-field');
  field.label = capitalize(path);
  field.path = path;
  field.required = true;
  parent.appendChild(field);
  crudForm._fields.push(field);
  return field;
}

export function createFields(crudForm, parent, object, path) {
  Object.keys(object).forEach((prop) => {
    if (!crudForm.include && crudForm.exclude && crudForm.exclude.test(prop)) {
      return;
    }
    const newPath = (path ? `${path}.` : '') + prop;
    if (object[prop] && typeof object[prop] === 'object') {
      createFields(crudForm, parent, object[prop], newPath);
    } else {
      createField(crudForm, parent, newPath);
    }
  });
  if (!crudForm._fields.length) {
    crudForm._fields = undefined;
  }
}
