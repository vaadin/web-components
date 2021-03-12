import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-board.js';

describe('size', () => {
  let container, board, rows, rowDefault, rowSmaller, rowLarger;

  beforeEach(() => {
    container = fixtureSync(`
      <div>
        <style>
          vaadin-board-row {
            --vaadin-board-width-small: 500px;
            --vaadin-board-width-medium: 900px;
          }

          vaadin-board-row#smaller {
            --vaadin-board-width-small: 300px;
            --vaadin-board-width-medium: 700px;
          }

          vaadin-board-row#larger {
            --vaadin-board-width-small: 800px;
            --vaadin-board-width-medium: 1300px;
          }

          vaadin-board-row.large > div {
            background-color: rgb(255, 0, 0);
          }

          vaadin-board-row.medium > div {
            background-color: rgb(0, 255, 0);
          }

          vaadin-board-row.small > div {
            background-color: rgb(0, 0, 255);
          }
        </style>
        <vaadin-board>
          <vaadin-board-row id="default">
            <div>default A</div>
            <div>default B</div>
            <div>default C</div>
            <div>default D</div>
          </vaadin-board-row>
          <vaadin-board-row id="smaller">
            <div>smaller A</div>
            <div>smaller B</div>
            <div>smaller C</div>
            <div>smaller D</div>
          </vaadin-board-row>
          <vaadin-board-row id="larger">
            <div>larger A</div>
            <div>larger B</div>
            <div>larger C</div>
            <div>larger D</div>
          </vaadin-board-row>
        </vaadin-board>
      </div>
    `);
    board = container.querySelector('vaadin-board');
    rows = container.querySelectorAll('vaadin-board-row');
    rowDefault = rows[0].querySelector('div');
    rowSmaller = rows[1].querySelector('div');
    rowLarger = rows[2].querySelector('div');
  });

  const large = 'rgb(255, 0, 0)';
  const medium = 'rgb(0, 255, 0)';
  const small = 'rgb(0, 0, 255)';

  function testSize(defaultColor, smallerColor, largerColor) {
    expect(getComputedStyle(rowDefault).backgroundColor).to.equal(defaultColor);
    expect(getComputedStyle(rowSmaller).backgroundColor).to.equal(smallerColor);
    expect(getComputedStyle(rowLarger).backgroundColor).to.equal(largerColor);
  }

  it('should apply correct styles for 900px width', () => {
    container.style.width = '920px';
    board.redraw();
    testSize(large, large, medium);

    container.style.width = '880px';
    board.redraw();
    testSize(medium, large, medium);
  });

  it('should style items correctly for 500px width', () => {
    container.style.width = '520px';
    board.redraw();
    testSize(medium, medium, small);

    container.style.width = '480px';
    board.redraw();
    testSize(small, medium, small);
  });

  it('should style items correctly for 700px width', () => {
    container.style.width = '720px';
    board.redraw();
    testSize(medium, large, small);

    container.style.width = '680px';
    board.redraw();
    testSize(medium, medium, small);
  });

  it('should style items correctly for 300px width', () => {
    container.style.width = '320px';
    board.redraw();
    testSize(small, medium, small);

    container.style.width = '280px';
    board.redraw();
    testSize(small, small, small);
  });

  it('should style items correctly for 1300px width', () => {
    container.style.width = '1320px';
    board.redraw();
    testSize(large, large, large);

    container.style.width = '1280px';
    board.redraw();
    testSize(large, large, medium);
  });

  it('should style items correctly for 800px width', () => {
    container.style.width = '820px';
    board.redraw();
    testSize(medium, large, medium);

    container.style.width = '780px';
    board.redraw();
    testSize(medium, large, small);
  });
});
