import { html } from 'lit-html';
import '../packages/vaadin-accordion/vaadin-accordion.js';

export default {
  title: 'Components/<vaadin-accordion>',
  argTypes: {
    opened: { control: 'number' }
  }
};

const Accordion = ({ opened }) => {
  return html`
    <vaadin-accordion .opened="${opened}">
      <vaadin-accordion-panel>
        <div slot="summary">Panel Heading 1</div>
        <span>Panel Content 1</span>
      </vaadin-accordion-panel>
      <vaadin-accordion-panel>
        <div slot="summary">Panel Heading 2</div>
        <span>Panel Content 2</span>
      </vaadin-accordion-panel>
      <vaadin-accordion-panel>
        <div slot="summary">Panel Heading 3</div>
        <span>Panel Content 3</span>
      </vaadin-accordion-panel>
      </vaadin-accordion-panel>
    </vaadin-accordion>
  `;
};

export const Basic = (args) => Accordion(args);
