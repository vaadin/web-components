/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-form host default"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper part="vaadin-login-native-form-wrapper">
    <form
      method="POST"
      part="vaadin-login-native-form"
      slot="form"
    >
      <input
        id="csrf"
        type="hidden"
      >
      <vaadin-text-field
        autocapitalize="none"
        autocomplete="username"
        autocorrect="off"
        focused=""
        has-label=""
        id="vaadinLoginUsername"
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-0"
          autocomplete="username"
          autocorrect="off"
          id="vaadin-text-field-0"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="vaadin-text-field-0"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Username
        </label>
        <div
          hidden=""
          id="error-message-vaadin-text-field-0"
          slot="error-message"
        >
        </div>
      </vaadin-text-field>
      <vaadin-password-field
        autocomplete="current-password"
        has-label=""
        id="vaadinLoginPassword"
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-1"
          autocapitalize="off"
          autocomplete="current-password"
          id="vaadin-password-field-1"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
        <label
          for="vaadin-password-field-1"
          id="label-vaadin-password-field-1"
          slot="label"
        >
          Password
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-1"
          slot="error-message"
        >
        </div>
      </vaadin-password-field>
      <vaadin-button
        part="vaadin-login-submit"
        role="button"
        tabindex="0"
        theme="primary contained"
      >
        Log in
      </vaadin-button>
    </form>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host default */

snapshots["vaadin-login-form host i18n"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper part="vaadin-login-native-form-wrapper">
    <form
      method="POST"
      part="vaadin-login-native-form"
      slot="form"
    >
      <input
        id="csrf"
        type="hidden"
      >
      <vaadin-text-field
        autocapitalize="none"
        autocomplete="username"
        autocorrect="off"
        focused=""
        has-label=""
        id="vaadinLoginUsername"
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-2"
          autocomplete="username"
          autocorrect="off"
          id="vaadin-text-field-2"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="vaadin-text-field-2"
          id="label-vaadin-text-field-2"
          slot="label"
        >
          Käyttäjänimi
        </label>
        <div
          hidden=""
          id="error-message-vaadin-text-field-2"
          slot="error-message"
        >
        </div>
      </vaadin-text-field>
      <vaadin-password-field
        autocomplete="current-password"
        has-label=""
        id="vaadinLoginPassword"
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="vaadin-password-field-3"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
        <label
          for="vaadin-password-field-3"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Salasana
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-3"
          slot="error-message"
        >
        </div>
      </vaadin-password-field>
      <vaadin-button
        part="vaadin-login-submit"
        role="button"
        tabindex="0"
        theme="primary contained"
      >
        Kirjaudu sisään
      </vaadin-button>
    </form>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host i18n */

snapshots["vaadin-login-form shadow default"] = 
`<section part="form">
  <h2 part="form-title">
    Log in
  </h2>
  <div
    hidden=""
    part="error-message"
  >
    <h5 part="error-message-title">
      Incorrect username or password
    </h5>
    <p part="error-message-description">
      Check that you have entered the correct username and password and try again.
    </p>
  </div>
  <slot name="form">
  </slot>
  <vaadin-button
    id="forgotPasswordButton"
    role="button"
    tabindex="0"
    theme="tertiary small forgot-password"
  >
    Forgot password
  </vaadin-button>
  <div part="footer">
    <p>
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow default */

snapshots["vaadin-login-form shadow error"] = 
`<section part="form">
  <h2 part="form-title">
    Log in
  </h2>
  <div part="error-message">
    <h5 part="error-message-title">
      Incorrect username or password
    </h5>
    <p part="error-message-description">
      Check that you have entered the correct username and password and try again.
    </p>
  </div>
  <slot name="form">
  </slot>
  <vaadin-button
    id="forgotPasswordButton"
    role="button"
    tabindex="0"
    theme="tertiary small forgot-password"
  >
    Forgot password
  </vaadin-button>
  <div part="footer">
    <p>
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow error */

snapshots["vaadin-login-form shadow noForgotPassword"] = 
`<section part="form">
  <h2 part="form-title">
    Log in
  </h2>
  <div
    hidden=""
    part="error-message"
  >
    <h5 part="error-message-title">
      Incorrect username or password
    </h5>
    <p part="error-message-description">
      Check that you have entered the correct username and password and try again.
    </p>
  </div>
  <slot name="form">
  </slot>
  <vaadin-button
    hidden=""
    id="forgotPasswordButton"
    role="button"
    tabindex="0"
    theme="tertiary small forgot-password"
  >
    Forgot password
  </vaadin-button>
  <div part="footer">
    <p>
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow noForgotPassword */

snapshots["vaadin-login-form shadow i18n"] = 
`<section part="form">
  <h2 part="form-title">
    Kirjaudu sisään
  </h2>
  <div
    hidden=""
    part="error-message"
  >
    <h5 part="error-message-title">
      Väärä käyttäjätunnus tai salasana
    </h5>
    <p part="error-message-description">
      Tarkista että käyttäjätunnus ja salasana ovat oikein ja yritä uudestaan.
    </p>
  </div>
  <slot name="form">
  </slot>
  <vaadin-button
    id="forgotPasswordButton"
    role="button"
    tabindex="0"
    theme="tertiary small forgot-password"
  >
    Unohtuiko salasana?
  </vaadin-button>
  <div part="footer">
    <p>
      Jos tarvitset lisätietoja käyttäjälle.
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow i18n */

