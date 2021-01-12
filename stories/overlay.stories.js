import { html } from 'lit-html';
import '../packages/vaadin-overlay/vaadin-overlay.js';

export default {
  title: 'Components/Overlay',
  argTypes: {
    withBackdrop: { control: 'boolean' }
  }
};

const overlayRenderer = (root) => {
  root.textContent = 'Overlay content';
};

const Overlay = ({ withBackdrop }) => {
  return html`
    <vaadin-overlay .withBackdrop="${withBackdrop}" .renderer="${overlayRenderer}" opened></vaadin-overlay>
  `;
};

export const Basic = (args) => Overlay(args);
