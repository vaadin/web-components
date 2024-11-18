import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

describe('timezone independent', () => {
  let dateTimePicker;
  let datePicker;
  let timePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
    await nextRender();
    datePicker = dateTimePicker.querySelector('[slot="date-picker"]');
    timePicker = dateTimePicker.querySelector('[slot="time-picker"]');
  });

  it('should not skip missing hour from DST switch', () => {
    // There's no good way to mock the system timezone, so use multiple test
    // cases to cover different timezones, in one of which this test hopefully
    // runs. The setup should verify that the component does not use the system
    // timezone to manipulate date instances, which would lead to skipping an
    // hour when entering the date and time of DST start, as this is an hour
    // that does not exist in timezones that use DST.
    const testCases = [
      '2024-03-10T02:00', // US Eastern DST start
      '2024-03-31T02:00', // Central european DST start
      '2024-03-31T03:00', // Eastern european DST start
    ];

    testCases.forEach((value) => {
      const [date, time] = value.split('T');
      datePicker.value = date;
      timePicker.value = time;

      expect(dateTimePicker.value).to.equal(value);
    });
  });
});
