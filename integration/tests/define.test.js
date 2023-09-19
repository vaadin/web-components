import { expect } from '@esm-bundle/chai';
import '@vaadin/button';
import { Button } from '@vaadin/button';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

it('should warn when component with same version is loaded twice', () => {
  const oldWarn = console.warn;
  const warningMessages = [];
  console.warn = (message, ...args) => {
    warningMessages.push(message);
  };
  defineCustomElement({ is: 'vaadin-button', version: Button.version });
  expect(warningMessages.length).to.equal(1);
  expect(warningMessages[0]).to.equal('The component vaadin-button has been loaded twice');
  console.warn = oldWarn;
});

it('should print an error when a component with different version is loaded twice', () => {
  const oldError = console.error;
  const errorMessages = [];
  console.error = (message, ...args) => {
    errorMessages.push(message);
  };
  defineCustomElement({ is: 'vaadin-button', version: '0.0.1' });
  expect(errorMessages.length).to.equal(1);
  expect(errorMessages[0]).to.equal(
    'Tried to define vaadin-button version 0.0.1 when version 24.2.0-alpha16 is already in use. Something will probably break.',
  );
  console.error = oldError;
});
