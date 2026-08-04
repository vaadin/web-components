import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { monthDate, monthIndexOf } from '../src/vaadin-date-picker-helper.js';
import { open } from './helpers.js';

describe('dateMetadataProvider initial focus', () => {
  let datePicker, content;

  // The 15th of every month is disabled, so the initial position can be checked without depending
  // on which months the request happens to cover.
  function disableFifteenth({ start, end }) {
    const first = monthIndexOf(start.year, start.month);
    const last = monthIndexOf(end.year, end.month);
    const dates = [];
    for (let month = first; month <= last; month++) {
      const date = monthDate(month);
      dates.push({ year: date.getFullYear(), month: date.getMonth(), day: 15, disabled: true });
    }
    return dates;
  }

  function deferredProvider(resolveWith = disableFifteenth) {
    const pending = [];
    const provider = (range) =>
      new Promise((resolve) => {
        pending.push(() => resolve(resolveWith(range)));
      });
    provider.resolveAll = () => {
      pending.splice(0).forEach((resolve) => resolve());
    };
    return provider;
  }

  // The reactive chain after a provider resolves can span more than one render.
  async function untilRendered(predicate) {
    for (let i = 0; i < 50 && !predicate(); i++) {
      await nextRender();
    }
    await nextRender();
  }

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    datePicker.initialPosition = '2020-01-15';
    await nextRender();
  });

  it('should move initial focus off a provider-disabled date', async () => {
    datePicker.dateMetadataProvider = disableFifteenth;
    await open(datePicker);
    content = datePicker._overlayContent;

    await untilRendered(() => content.focusedDate && content.focusedDate.getDate() !== 15);

    // The 15th is disabled, so focus moves to the closest selectable date, the 16th.
    expect(content.focusedDate.getFullYear()).to.equal(2020);
    expect(content.focusedDate.getMonth()).to.equal(0);
    expect(content.focusedDate.getDate()).to.equal(16);
  });

  it('should move initial focus once an async provider resolves', async () => {
    const provider = deferredProvider();
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    content = datePicker._overlayContent;

    // Nothing is known about the 15th yet, so focus stays on it.
    expect(content.focusedDate.getDate()).to.equal(15);

    provider.resolveAll();
    await untilRendered(() => content.focusedDate.getDate() !== 15);

    expect(content.focusedDate.getDate()).to.equal(16);
  });

  it('should move initial focus to the earlier date when the next one is also disabled', async () => {
    datePicker.dateMetadataProvider = ({ start, end }) =>
      disableFifteenth({ start, end }).flatMap((date) => [date, { ...date, day: 16 }]);
    await open(datePicker);
    content = datePicker._overlayContent;

    await untilRendered(() => content.focusedDate && content.focusedDate.getDate() !== 15);

    expect(content.focusedDate.getDate()).to.equal(14);
  });

  it('should keep initial focus on a date the provider does not disable', async () => {
    datePicker.initialPosition = '2020-01-10';
    datePicker.dateMetadataProvider = disableFifteenth;
    await open(datePicker);
    content = datePicker._overlayContent;

    await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2020, 0, 10)));

    expect(content.focusedDate.getDate()).to.equal(10);
  });

  it('should not move focus the user has navigated away from the initial date', async () => {
    const provider = deferredProvider();
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    content = datePicker._overlayContent;

    // The user navigates away from the initial 15th before the provider resolves and reports it
    // disabled. The adjustment must stop at the first navigation, not pull the focus back towards
    // the initial date.
    content.focusedDate = new Date(2020, 0, 20);
    provider.resolveAll();
    await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2020, 0, 15)));

    expect(content.focusedDate.getDate()).to.equal(20);
  });

  it('should not move focus the user has navigated to a disabled date', async () => {
    datePicker.initialPosition = '2020-01-10';
    const provider = deferredProvider();
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    content = datePicker._overlayContent;

    // The user navigates to the 15th — disabled, but disabled dates stay keyboard-focusable —
    // before the provider resolves. A date the user chose must be left alone.
    content.focusedDate = new Date(2020, 0, 15);
    provider.resolveAll();
    await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2020, 0, 15)));

    expect(content.focusedDate.getDate()).to.equal(15);
  });

  it('should not move focus away from a selected value the provider disables', async () => {
    datePicker.value = '2020-01-15';
    datePicker.dateMetadataProvider = disableFifteenth;
    await open(datePicker);
    content = datePicker._overlayContent;

    await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2020, 0, 15)));

    // The value was the user's own choice; only the auto-picked initial date is ever moved.
    expect(content.focusedDate.getDate()).to.equal(15);
  });

  it('should keep focus in place when no selectable date exists within a year', async () => {
    // Every date the constraints allow is disabled, so the scan finds nothing and gives up.
    datePicker.min = '2020-01-01';
    datePicker.max = '2020-01-31';
    datePicker.dateMetadataProvider = ({ start, end }) => {
      const dates = [];
      for (let month = monthIndexOf(start.year, start.month); month <= monthIndexOf(end.year, end.month); month++) {
        const date = monthDate(month);
        for (let day = 1; day <= 31; day++) {
          dates.push({ year: date.getFullYear(), month: date.getMonth(), day, disabled: true });
        }
      }
      return dates;
    };
    await open(datePicker);
    content = datePicker._overlayContent;

    await untilRendered(() => datePicker._dateMetadataController.isMonthLoaded(new Date(2020, 0, 15)));

    expect(content.focusedDate.getDate()).to.equal(15);
  });

  it('should not move focus after the overlay was closed', async () => {
    const provider = deferredProvider();
    datePicker.dateMetadataProvider = provider;
    await open(datePicker);
    content = datePicker._overlayContent;

    datePicker.close();
    await nextRender();
    // The host callback still runs with the overlay closed, for validation; the focus of a
    // dropdown that is no longer shown must not be touched.
    provider.resolveAll();
    await aTimeout(0);
    await nextRender();

    expect(content.focusedDate.getDate()).to.equal(15);
  });
});
