import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// Aura defines `transition: color 120ms` on
// vaadin-grid-sorter::part(indicators)
// (packages/aura/src/components/grid.css:14-16). The sort visual tests
// click sorters to toggle direction, which flips the indicator colour
// and races the screenshot. Suppress the transition so captures land
// at the fully-applied colour deterministically.
registerStyles(
  'vaadin-grid-sorter',
  css`
    [part='indicators'] {
      transition: none !important;
    }
  `,
);
