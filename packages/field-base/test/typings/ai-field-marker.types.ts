import type { CSSResult } from 'lit';
import {
  aiFieldMarkerHostStyles,
  aiFieldMarkerShadowStyles,
  aiFieldMarkerStyles,
} from '../../src/styles/vaadin-ai-field-marker-base-styles.js';

const assertType = <TExpected>(actual: TExpected) => actual;

// Styles
assertType<CSSResult>(aiFieldMarkerStyles);
assertType<CSSResult>(aiFieldMarkerHostStyles);
assertType<CSSResult>(aiFieldMarkerShadowStyles);
