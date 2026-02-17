import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/date-picker/src/vaadin-date-picker.js';

async function openOverlay(element) {
  element.open();
  // Wait for overlay to open and content to render
  await nextRender();
  await nextRender();
  // Wait for scroll animation to finish
  const overlayContent = element._overlayContent;
  if (overlayContent?._revealPromise) {
    await overlayContent._revealPromise;
  }
  // Wait for month calendars to render
  await nextRender();
  // Flush scroller update debouncers to ensure items are populated
  overlayContent?._monthScroller?._debouncerUpdateClones?.flush();
  overlayContent?._yearScroller?._debouncerUpdateClones?.flush();
  await nextRender();
}

// TODO: --vaadin-input-field-disabled-text-color is not documented but is used
// in input-container-base-styles.js:113 to set --vaadin-input-field-value-color when disabled.
//
// TODO: --vaadin-icon-visual-size fails because Aura theme sets it to 90% on ::part(field-button)
// in input-container.css:32 and 75% on ::part(clear-button) in input-container.css:35,
// which overrides custom values set on the host.
//
// TODO: --vaadin-overlay-shadow fails because Aura theme combines it with --aura-overlay-outline-shadow
// in overlay.css:32, so the computed box-shadow doesn't match the custom property value alone.
//
// TODO: --vaadin-date-picker-year-scroller-current-year-color is not documented but is used
// in vaadin-date-picker-year-base-styles.js:25 to set the color of the current year number.

export const props = [
  // === Field Surface ===
  {
    name: '--vaadin-input-field-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-radius',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-width',
    value: '5px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-input-field-top-start-radius',
    value: '15px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-top-left-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-top-end-radius',
    value: '16px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-top-right-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-bottom-start-radius',
    value: '17px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-bottom-left-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-bottom-end-radius',
    value: '18px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-bottom-right-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-padding',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-color',
    value: 'rgb(100, 100, 100)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-font-size',
    value: '24px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-font-weight',
    value: '700',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-line-height',
    value: '40px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-input-field-placeholder-color',
    value: 'rgb(200, 100, 50)',
    setup(element) {
      element.placeholder = 'Placeholder text';
    },
    compute(element) {
      const input = element.inputElement;
      return getComputedStyle(input).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-container-gap',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--_gap').trim();
    },
  },

  // === Field States ===
  {
    name: '--vaadin-focus-ring-width',
    value: '5px',
    setup(element) {
      element.focus();
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(255, 100, 0)',
    setup(element) {
      element.focus();
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('outline-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-disabled-background',
    value: 'rgb(200, 200, 200)',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-disabled-text-color',
    value: 'rgb(150, 150, 150)',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('color').trim();
    },
  },
  // Note: --vaadin-input-field-disabled-value-color is Lumo-specific
  // Note: --vaadin-input-field-hover-highlight is Lumo-specific
  // Note: --vaadin-input-field-hover-highlight-opacity is Lumo-specific
  // Note: --vaadin-input-field-invalid-background is Lumo-specific
  // Note: --vaadin-input-field-invalid-hover-highlight is Lumo-specific
  // Note: --vaadin-input-field-readonly-border is Lumo-specific

  // === Label ===
  {
    name: '--vaadin-input-field-label-color',
    value: 'rgb(50, 100, 150)',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-font-size',
    value: '20px',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-font-weight',
    value: '800',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-line-height',
    value: '30px',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-input-field-required-indicator-color',
    value: 'rgb(255, 0, 255)',
    setup(element) {
      element.label = 'Test Label';
      element.required = true;
    },
    compute(element) {
      const indicator = element.shadowRoot.querySelector('[part="required-indicator"]');
      return getComputedStyle(indicator).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-required-indicator',
    value: '"!"',
    setup(element) {
      element.label = 'Test Label';
      element.required = true;
    },
    compute(element) {
      const indicator = element.shadowRoot.querySelector('[part="required-indicator"]');
      return getComputedStyle(indicator, '::after').getPropertyValue('content').trim();
    },
  },
  // Note: --vaadin-input-field-focused-label-color is Lumo-specific
  // Note: --vaadin-input-field-hovered-label-color is Lumo-specific

  // === Helper Text ===
  {
    name: '--vaadin-input-field-helper-color',
    value: 'rgb(100, 150, 200)',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-font-size',
    value: '14px',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-font-weight',
    value: '600',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-line-height',
    value: '22px',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('line-height').trim();
    },
  },
  // Note: --vaadin-input-field-helper-spacing is Lumo-specific

  // === Error Message ===
  {
    name: '--vaadin-input-field-error-color',
    value: 'rgb(200, 50, 50)',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-font-size',
    value: '12px',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-font-weight',
    value: '500',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-line-height',
    value: '18px',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('line-height').trim();
    },
  },

  // === Field Buttons & Icons ===
  {
    name: '--vaadin-input-field-button-text-color',
    value: 'rgb(150, 75, 0)',
    compute(element) {
      const toggleButton = element.shadowRoot.querySelector('[part~="toggle-button"]');
      return getComputedStyle(toggleButton).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-clickable-cursor',
    value: 'pointer',
    compute(element) {
      const toggleButton = element.shadowRoot.querySelector('[part~="toggle-button"]');
      return getComputedStyle(toggleButton).getPropertyValue('cursor').trim();
    },
  },
  {
    name: '--vaadin-disabled-cursor',
    value: 'not-allowed',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('cursor').trim();
    },
  },
  {
    name: '--vaadin-icon-size',
    value: '30px',
    compute(element) {
      const toggleButton = element.shadowRoot.querySelector('[part~="toggle-button"]');
      return getComputedStyle(toggleButton, '::before').getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '80%',
    compute(element) {
      const toggleButton = element.shadowRoot.querySelector('[part~="toggle-button"]');
      return getComputedStyle(toggleButton, '::before').getPropertyValue('mask-size').trim();
    },
  },
  // Note: --vaadin-input-field-icon-size is Lumo-specific
  // Note: --vaadin-input-field-icon-color is Lumo-specific
  // Note: --vaadin-input-field-height is Lumo-specific

  // === Overlay ===
  {
    name: '--vaadin-date-picker-overlay-max-height',
    value: '400px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('max-height').trim();
    },
  },
  {
    name: '--vaadin-date-picker-overlay-width',
    value: '400px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-date-picker-toolbar-padding',
    value: '20px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlayContent = element.querySelector('vaadin-date-picker-overlay-content');
      const toolbar = overlayContent.shadowRoot.querySelector('[part="toolbar"]');
      return getComputedStyle(toolbar).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-overlay-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-radius',
    value: '20px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-width',
    value: '5px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-overlay-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Year Scroller ===
  {
    name: '--vaadin-date-picker-year-scroller-width',
    value: '100px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const yearScroller = element.querySelector('vaadin-date-picker-year-scroller');
      return getComputedStyle(yearScroller).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-date-picker-year-scroller-background',
    value: 'rgb(200, 200, 255)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const yearScroller = element.querySelector('vaadin-date-picker-year-scroller');
      return getComputedStyle(yearScroller).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-date-picker-year-scroller-border-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const yearScroller = element.querySelector('vaadin-date-picker-year-scroller');
      return getComputedStyle(yearScroller).getPropertyValue('border-left-color').trim();
    },
  },
  {
    name: '--vaadin-date-picker-year-scroller-current-year-color',
    value: 'rgb(0, 128, 0)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const years = element.querySelectorAll('vaadin-date-picker-year');
      for (const year of years) {
        if (year.hasAttribute('current')) {
          const yearNumber = year.shadowRoot.querySelector('[part="year-number"]');
          return getComputedStyle(yearNumber).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },

  // === Month Calendar ===
  {
    name: '--vaadin-date-picker-month-padding',
    value: '30px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      return getComputedStyle(monthCalendar).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-date-picker-month-header-color',
    value: 'rgb(0, 100, 200)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const header = monthCalendar.shadowRoot.querySelector('[part="month-header"]');
      return getComputedStyle(header).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-date-picker-month-header-font-size',
    value: '20px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const header = monthCalendar.shadowRoot.querySelector('[part="month-header"]');
      return getComputedStyle(header).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-date-picker-month-header-font-weight',
    value: '800',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const header = monthCalendar.shadowRoot.querySelector('[part="month-header"]');
      return getComputedStyle(header).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-date-picker-weekday-color',
    value: 'rgb(100, 50, 0)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part~="weekday"]');
      for (const weekday of weekdays) {
        if (weekday.textContent.trim()) {
          return getComputedStyle(weekday).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-weekday-font-size',
    value: '16px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part~="weekday"]');
      for (const weekday of weekdays) {
        if (weekday.textContent.trim()) {
          return getComputedStyle(weekday).getPropertyValue('font-size').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-weekday-font-weight',
    value: '700',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const weekdays = monthCalendar.shadowRoot.querySelectorAll('[part~="weekday"]');
      for (const weekday of weekdays) {
        if (weekday.textContent.trim()) {
          return getComputedStyle(weekday).getPropertyValue('font-weight').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-week-number-color',
    value: 'rgb(0, 100, 50)',
    async setup(element) {
      element.showWeekNumbers = true;
      element.i18n = { ...element.i18n, firstDayOfWeek: 1 };
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const weekNumber = calendar.shadowRoot.querySelector('[part~="week-number"]');
        if (weekNumber) {
          return getComputedStyle(weekNumber).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-week-number-font-size',
    value: '14px',
    async setup(element) {
      element.showWeekNumbers = true;
      element.i18n = { ...element.i18n, firstDayOfWeek: 1 };
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const weekNumber = calendar.shadowRoot.querySelector('[part~="week-number"]');
        if (weekNumber) {
          return getComputedStyle(weekNumber).getPropertyValue('font-size').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-week-divider-color',
    value: 'rgb(255, 128, 0)',
    async setup(element) {
      element.showWeekNumbers = true;
      element.i18n = { ...element.i18n, firstDayOfWeek: 1 };
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const weekNumber = calendar.shadowRoot.querySelector('[part~="week-number"]');
        if (weekNumber) {
          return getComputedStyle(weekNumber, '::after').getPropertyValue('background-color').trim();
        }
      }
      return '';
    },
  },

  // === Date Cells ===
  {
    name: '--vaadin-date-picker-date-width',
    value: '40px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const date = monthCalendar.shadowRoot.querySelector('[part~="date"]');
      return getComputedStyle(date).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-date-picker-date-height',
    value: '40px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const date = monthCalendar.shadowRoot.querySelector('[part~="date"]');
      return getComputedStyle(date).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-date-picker-date-border-radius',
    value: '10px',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const monthCalendar = element.querySelector('vaadin-month-calendar');
      const date = monthCalendar.shadowRoot.querySelector('[part~="date"]');
      return getComputedStyle(date).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-date-picker-date-today-color',
    value: 'rgb(255, 0, 128)',
    async setup(element) {
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const today = calendar.shadowRoot.querySelector('[part~="today"]');
        if (today) {
          return getComputedStyle(today).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-date-selected-color',
    value: 'rgb(128, 0, 255)',
    async setup(element) {
      element.value = '2026-02-17';
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const selected = calendar.shadowRoot.querySelector('[part~="selected"]');
        if (selected) {
          return getComputedStyle(selected).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-date-selected-background',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.value = '2026-02-17';
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const selected = calendar.shadowRoot.querySelector('[part~="selected"]');
        if (selected) {
          return getComputedStyle(selected, '::after').getPropertyValue('background-color').trim();
        }
      }
      return '';
    },
  },
  {
    name: '--vaadin-date-picker-date-disabled-color',
    value: 'rgb(128, 128, 128)',
    async setup(element) {
      element.min = '2026-02-10';
      await openOverlay(element);
    },
    compute(element) {
      const calendars = element.querySelectorAll('vaadin-month-calendar');
      for (const calendar of calendars) {
        const disabled = calendar.shadowRoot.querySelector('[disabled]');
        if (disabled) {
          return getComputedStyle(disabled).getPropertyValue('color').trim();
        }
      }
      return '';
    },
  },
];

describe('date-picker', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
