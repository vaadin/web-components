import { html } from 'lit-html';
import '../packages/vaadin-ordered-layout/vaadin-vertical-layout.js';

export default {
  title: 'Layouts/<vaadin-vertical-layout>'
};

const VerticalLayout = () => {
  return html`
    <vaadin-vertical-layout>
      <div class="block">Item 1</div>
      <div class="block">Item 2</div>
      <div class="block">Item 3</div>
    </vaadin-vertical-layout>
    <style>
      .block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4em;
        height: 4em;
        border: solid 1px #ccc;
      }
    </style>
  `;
};

export const Basic = (args) => VerticalLayout(args);
