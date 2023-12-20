import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  CookieConsentElement,
  CookieConsent as _CookieConsent,
  type CookieConsentProps as _CookieConsentProps,
} from './generated/CookieConsent.js';

export * from './generated/CookieConsent.js';

type OmittedCookieConsentHTMLAttributes = Omit<
  HTMLAttributes<CookieConsentElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot'
>;

export type CookieConsentProps = Partial<Omit<_CookieConsentProps, keyof OmittedCookieConsentHTMLAttributes>>;

export const CookieConsent = _CookieConsent as (
  props: CookieConsentProps & RefAttributes<CookieConsentElement>,
) => ReactElement | null;
