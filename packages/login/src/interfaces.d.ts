export interface LoginI18n {
  form: {
    title: string;
    username: string;
    password: string;
    submit: string;
    forgotPassword: string;
  };
  errorMessage: {
    title: string;
    message: string;
  };
  header?: {
    title?: string;
    description?: string;
  };
  additionalInformation?: string;
}

/**
 * Fired when a user submits the login.
 */
export type LoginEvent = CustomEvent<{ username: string; password: string }>;

export interface LoginElementEventMap {
  'forgot-password': Event;

  login: LoginEvent;
}

export interface LoginEventMap extends HTMLElementEventMap, LoginElementEventMap {}
