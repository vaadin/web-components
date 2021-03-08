import { html } from 'lit-html';
import '../packages/vaadin-board/vaadin-board.js';

export default {
  title: 'Components/<vaadin-board>'
};

const Board = () => {
  return html`
    <vaadin-board>
      <vaadin-board-row>
        <div class="cell">Cell 1</div>
        <div class="cell">Cell 2</div>
        <div class="cell">Cell 3</div>
        <div class="cell">Cell 4</div>
      </vaadin-board-row>
      <vaadin-board-row>
        <div class="cell">Cell 5</div>
        <div class="cell">Cell 6</div>
        <div class="cell">Cell 7</div>
      </vaadin-board-row>
      <vaadin-board-row>
        <div class="cell">Cell 8</div>
        <div class="cell">Cell 9</div>
      </vaadin-board-row>
      <vaadin-board-row>
        <div class="cell">Cell 10</div>
      </vaadin-board-row>
    </vaadin-board>

    <style>
      vaadin-board {
        border: solid 1px #ccc;
      }

      .cell {
        padding: 1em;
        text-align: center;
        border: solid 1px #ccc;
      }
    </style>
  `;
};

export const Basic = (args) => Board(args);
