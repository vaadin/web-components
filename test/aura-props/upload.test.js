import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/upload/src/vaadin-upload.js';

// TODO: --vaadin-upload-file-button-text-color fails because Aura theme sets it
// to var(--vaadin-text-color-secondary) directly on ::part(remove-button) and
// ::part(retry-button) in upload.css:79, which overrides custom values set on the host.
//
// TODO: --vaadin-upload-gap fails because Aura theme sets margin-top: 0 on
// vaadin-upload-file-list li:first-child in upload.css:53, which overrides the
// ::slotted(:first-child) margin-top that uses this property.
//
// TODO: --vaadin-upload-file-border-radius fails because Aura theme sets
// border-radius: var(--vaadin-radius-m) directly on vaadin-upload-file in
// upload.css:65, which overrides the custom property set on :host.
//
// TODO: --vaadin-upload-file-padding fails because Aura theme sets
// padding-block: var(--vaadin-padding-m) directly on vaadin-upload-file in
// upload.css:66, which overrides the block padding from the custom property.

export const props = [
  // === Upload Container ===
  {
    name: '--vaadin-upload-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-upload-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-upload-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-upload-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-upload-padding',
    value: '30px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },

  // === Drop Label ===
  {
    name: '--vaadin-upload-drop-label-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const dropLabel = element.shadowRoot.querySelector('[part="drop-label"]');
      return getComputedStyle(dropLabel).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-upload-drop-label-font-size',
    value: '24px',
    compute(element) {
      const dropLabel = element.shadowRoot.querySelector('[part="drop-label"]');
      return getComputedStyle(dropLabel).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-upload-drop-label-font-weight',
    value: '700',
    compute(element) {
      const dropLabel = element.shadowRoot.querySelector('[part="drop-label"]');
      return getComputedStyle(dropLabel).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-upload-drop-label-gap',
    value: '20px',
    compute(element) {
      const dropLabel = element.shadowRoot.querySelector('[part="drop-label"]');
      return getComputedStyle(dropLabel).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-upload-drop-label-line-height',
    value: '40px',
    compute(element) {
      const dropLabel = element.shadowRoot.querySelector('[part="drop-label"]');
      return getComputedStyle(dropLabel).getPropertyValue('line-height').trim();
    },
  },

  // === File List ===
  {
    name: '--vaadin-upload-gap',
    value: '30px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const fileList = element.querySelector('vaadin-upload-file-list');
      const firstItem = fileList.querySelector('li');
      return getComputedStyle(firstItem).getPropertyValue('margin-top').trim();
    },
  },
  {
    name: '--vaadin-upload-file-list-divider-color',
    value: 'rgb(255, 0, 255)',
    setup(element) {
      element.files = [
        { name: 'file1.txt', complete: true },
        { name: 'file2.txt', complete: true },
      ];
    },
    compute(element) {
      const fileList = element.querySelector('vaadin-upload-file-list');
      const firstItem = fileList.querySelector('li');
      return getComputedStyle(firstItem).getPropertyValue('border-bottom-color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-list-divider-width',
    value: '5px',
    setup(element) {
      element.files = [
        { name: 'file1.txt', complete: true },
        { name: 'file2.txt', complete: true },
      ];
    },
    compute(element) {
      const fileList = element.querySelector('vaadin-upload-file-list');
      const firstItem = fileList.querySelector('li');
      return getComputedStyle(firstItem).getPropertyValue('border-bottom-width').trim();
    },
  },

  // === File Item ===
  {
    name: '--vaadin-upload-file-border-radius',
    value: '15px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      return getComputedStyle(file).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-upload-file-gap',
    value: '10px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      return getComputedStyle(file).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-upload-file-padding',
    value: '25px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      return getComputedStyle(file).getPropertyValue('padding').trim();
    },
  },

  // === File Name ===
  {
    name: '--vaadin-upload-file-name-color',
    value: 'rgb(100, 50, 0)',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const name = file.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-name-font-size',
    value: '20px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const name = file.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-upload-file-name-font-weight',
    value: '800',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const name = file.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-upload-file-name-line-height',
    value: '30px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const name = file.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('line-height').trim();
    },
  },

  // === File Status ===
  {
    name: '--vaadin-upload-file-status-color',
    value: 'rgb(50, 150, 50)',
    setup(element) {
      element.files = [{ name: 'file1.txt', status: 'Uploading...' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const status = file.shadowRoot.querySelector('[part="status"]');
      return getComputedStyle(status).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-status-font-size',
    value: '14px',
    setup(element) {
      element.files = [{ name: 'file1.txt', status: 'Uploading...' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const status = file.shadowRoot.querySelector('[part="status"]');
      return getComputedStyle(status).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-upload-file-status-font-weight',
    value: '700',
    setup(element) {
      element.files = [{ name: 'file1.txt', status: 'Uploading...' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const status = file.shadowRoot.querySelector('[part="status"]');
      return getComputedStyle(status).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-upload-file-status-line-height',
    value: '22px',
    setup(element) {
      element.files = [{ name: 'file1.txt', status: 'Uploading...' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const status = file.shadowRoot.querySelector('[part="status"]');
      return getComputedStyle(status).getPropertyValue('line-height').trim();
    },
  },

  // === File Error ===
  {
    name: '--vaadin-upload-file-error-color',
    value: 'rgb(200, 0, 0)',
    setup(element) {
      element.files = [{ name: 'file1.txt', error: 'Upload failed' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const error = file.shadowRoot.querySelector('[part="error"]');
      return getComputedStyle(error).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-error-font-size',
    value: '12px',
    setup(element) {
      element.files = [{ name: 'file1.txt', error: 'Upload failed' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const error = file.shadowRoot.querySelector('[part="error"]');
      return getComputedStyle(error).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-upload-file-error-font-weight',
    value: '700',
    setup(element) {
      element.files = [{ name: 'file1.txt', error: 'Upload failed' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const error = file.shadowRoot.querySelector('[part="error"]');
      return getComputedStyle(error).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-upload-file-error-line-height',
    value: '18px',
    setup(element) {
      element.files = [{ name: 'file1.txt', error: 'Upload failed' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const error = file.shadowRoot.querySelector('[part="error"]');
      return getComputedStyle(error).getPropertyValue('line-height').trim();
    },
  },

  // === File Icons ===
  {
    name: '--vaadin-upload-file-done-color',
    value: 'rgb(0, 200, 0)',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const doneIcon = file.shadowRoot.querySelector('[part="done-icon"]');
      return getComputedStyle(doneIcon, '::before').getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-warning-color',
    value: 'rgb(255, 165, 0)',
    setup(element) {
      element.files = [{ name: 'file1.txt', error: 'Upload failed' }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const warningIcon = file.shadowRoot.querySelector('[part="warning-icon"]');
      return getComputedStyle(warningIcon, '::before').getPropertyValue('background-color').trim();
    },
  },

  // === File Buttons ===
  {
    name: '--vaadin-upload-file-button-background',
    value: 'rgb(200, 200, 200)',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-button-border-color',
    value: 'rgb(100, 100, 100)',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-button-border-radius',
    value: '10px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-upload-file-button-border-width',
    value: '3px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-upload-file-button-text-color',
    value: 'rgb(0, 100, 200)',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-upload-file-button-padding',
    value: '8px',
    setup(element) {
      element.files = [{ name: 'file1.txt', complete: true }];
    },
    compute(element) {
      const file = element.querySelector('vaadin-upload-file');
      const button = file.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(button).getPropertyValue('padding').trim();
    },
  },
];

describe('upload', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-upload></vaadin-upload>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
