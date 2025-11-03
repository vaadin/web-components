import { registerAPI } from './shared/shared.js';

const elements = [
  'vaadin-accordion-panel',
  'vaadin-avatar',
  'vaadin-button',
  'vaadin-checkbox',
  'vaadin-checkbox-group',
  'vaadin-combo-box',
  'vaadin-custom-field',
  'vaadin-date-picker',
  'vaadin-date-time-picker',
  'vaadin-details',
  'vaadin-email-field',
  'vaadin-icon',
  'vaadin-integer-field',
  'vaadin-list-box',
  'vaadin-message-input',
  'vaadin-multi-select-combo-box',
  'vaadin-number-field',
  'vaadin-password-field',
  'vaadin-radio-group',
  'vaadin-select',
  'vaadin-side-nav-item',
  'vaadin-tab',
  'vaadin-text-area',
  'vaadin-text-field',
  'vaadin-time-picker',
];

const getTooltipTextAPI = (element) => () => {
  // There is no tooltip element in this component
  const tooltip = element.querySelector('vaadin-tooltip');
  if (!tooltip) {
    return null;
  }

  // Tooltip element is added but not imported
  const contentNode = tooltip.querySelector('[slot="overlay"]');
  if (!contentNode) {
    return '';
  }

  return contentNode.textContent;
};

elements.forEach((tagName) => {
  registerAPI(tagName, 'getTooltipText', getTooltipTextAPI);
});
