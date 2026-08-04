import type { CSSResult } from 'lit';
import { aiFieldMarkerHostStyles, aiFieldMarkerStyles } from '../../src/styles/vaadin-ai-field-marker-base-styles.js';
import type { AiFieldMarkerI18n, AiFieldRevertEvent } from '../../src/vaadin-ai-field-marker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

// Styles
assertType<CSSResult>(aiFieldMarkerStyles);
assertType<CSSResult>(aiFieldMarkerHostStyles);

// Element
const marker = document.createElement('vaadin-ai-field-marker');
assertType<AiFieldMarkerI18n>(marker.i18n);
assertType<boolean>(marker.working);

// Revert event
assertType<CustomEvent<{ value: unknown }>>({} as AiFieldRevertEvent);

// The revert event is fired from the field, so it must not be declared on the
// global HTMLElementEventMap, which would offer the listener overload on every
// element in an application.
// @ts-expect-error ai-field-revert is not a global element event
assertType<AiFieldRevertEvent>({} as HTMLElementEventMap['ai-field-revert']);
