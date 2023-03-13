import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-board.js';
import { allResized } from './helpers.js';

describe('size', () => {
  let container, rows, rowDefault, rowSmaller, rowLarger;

  beforeEach(async () => {
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
    rows = [...container.querySelectorAll('vaadin-board-row')];
    rowDefault = rows[0].querySelector('div');
    rowSmaller = rows[1].querySelector('div');
    rowLarger = rows[2].querySelector('div');

    await allResized(rows);
  });

  const large = 'rgb(255, 0, 0)';
  const medium = 'rgb(0, 255, 0)';
  const small = 'rgb(0, 0, 255)';

  function testSize(defaultColor, smallerColor, largerColor) {
    expect(getComputedStyle(rowDefault).backgroundColor).to.equal(defaultColor);
    expect(getComputedStyle(rowSmaller).backgroundColor).to.equal(smallerColor);
    expect(getComputedStyle(rowLarger).backgroundColor).to.equal(largerColor);
  }

  it('should apply correct styles for 900px width', async () => {
    container.style.width = '920px';
    await allResized(rows);
    testSize(large, large, medium);

    container.style.width = '880px';
    await allResized(rows);
    testSize(medium, large, medium);
  });

  it('should style items correctly for 500px width', async () => {
    container.style.width = '520px';
    await allResized(rows);
    testSize(medium, medium, small);

    container.style.width = '480px';
    await allResized(rows);
    testSize(small, medium, small);
  });

  it('should style items correctly for 700px width', async () => {
    container.style.width = '720px';
    await allResized(rows);
    testSize(medium, large, small);

    container.style.width = '680px';
    await allResized(rows);
    testSize(medium, medium, small);
  });

  it('should style items correctly for 300px width', async () => {
    container.style.width = '320px';
    await allResized(rows);
    testSize(small, medium, small);

    container.style.width = '280px';
    await allResized(rows);
    testSize(small, small, small);
  });

  it('should style items correctly for 1300px width', async () => {
    container.style.width = '1320px';
    await allResized(rows);
    testSize(large, large, large);

    container.style.width = '1280px';
    await allResized(rows);
    testSize(large, large, medium);
  });

  it('should style items correctly for 800px width', async () => {
    container.style.width = '820px';
    await allResized(rows);
    testSize(medium, large, medium);

    container.style.width = '780px';
    await allResized(rows);
    testSize(medium, large, small);
  });
});
