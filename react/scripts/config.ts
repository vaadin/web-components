import { resolve, dirname } from 'node:path';

const __dirname = dirname(import.meta.url.replace(/^file:/, ''));

export const rootDir = resolve(__dirname, '..');
export const buildDir = resolve(rootDir, 'build');
export const nodeModulesDir = resolve(rootDir, 'node_modules');
export const generatedSourceDir = resolve(rootDir, 'src', 'generated');

export const packages = [
  /* Core */
  '@vaadin/accordion',
  '@vaadin/app-layout',
  '@vaadin/app-layout',
  '@vaadin/avatar',
  '@vaadin/avatar-group',
  '@vaadin/button',
  '@vaadin/checkbox',
  '@vaadin/checkbox-group',
  '@vaadin/combo-box',
  '@vaadin/context-menu',
  '@vaadin/custom-field',
  '@vaadin/date-picker',
  '@vaadin/date-time-picker',
  '@vaadin/details',
  '@vaadin/dialog',
  '@vaadin/email-field',
  // skip '@vaadin/field-highlighter',
  '@vaadin/form-layout',
  '@vaadin/grid',
  '@vaadin/horizontal-layout',
  '@vaadin/icon',
  '@vaadin/icons',
  '@vaadin/integer-field',
  '@vaadin/item',
  '@vaadin/list-box',
  '@vaadin/lit-renderer',
  '@vaadin/login',
  '@vaadin/menu-bar',
  '@vaadin/message-input',
  '@vaadin/message-list',
  '@vaadin/notification',
  '@vaadin/number-field',
  '@vaadin/password-field',
  '@vaadin/polymer-legacy-adapter',
  '@vaadin/progress-bar',
  '@vaadin/radio-group',
  '@vaadin/scroller',
  '@vaadin/select',
  '@vaadin/split-layout',
  '@vaadin/tabs',
  '@vaadin/text-area',
  '@vaadin/text-field',
  '@vaadin/time-picker',
  '@vaadin/tooltip',
  '@vaadin/upload',
  '@vaadin/vertical-layout',
  '@vaadin/virtual-list',
  /* Pro */
  '@vaadin/board',
  '@vaadin/charts',
  '@vaadin/confirm-dialog',
  '@vaadin/cookie-consent',
  '@vaadin/crud',
  '@vaadin/grid-pro',
  '@vaadin/map',
  '@vaadin/rich-text-editor',
];

