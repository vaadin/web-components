import { html } from 'lit-html';
import '../packages/vaadin-ordered-layout/vaadin-horizontal-layout.js';

export default {
  title: 'Components/<vaadin-horizontal-layout>'
};

const HorizontalLayout = () => {
  return html`
    <vaadin-horizontal-layout>
      <div class="block">Item 1</div>
      <div class="block">Item 2</div>
      <div class="block">Item 3</div>
    </vaadin-horizontal-layout>
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

export const Basic = (args) => HorizontalLayout(args);
