/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-form host default"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Username
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
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Password
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Log in
    </vaadin-button>
    <vaadin-button
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Forgot password
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host default */

snapshots["vaadin-login-form host required"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        has-error-message=""
        has-label=""
        id="vaadinLoginUsername"
        invalid=""
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-invalid="true"
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          invalid=""
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Username
        </label>
        <div
          id="error-message-vaadin-text-field-2"
          slot="error-message"
        >
          Username is required
        </div>
      </vaadin-text-field>
      <vaadin-password-field
        autocomplete="current-password"
        has-error-message=""
        has-label=""
        id="vaadinLoginPassword"
        invalid=""
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-invalid="true"
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          invalid=""
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Password
        </label>
        <div
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
          Password is required
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Log in
    </vaadin-button>
    <vaadin-button
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Forgot password
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host required */

snapshots["vaadin-login-form host i18n"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
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
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Salasana
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Kirjaudu sisään
    </vaadin-button>
    <vaadin-button
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Unohtuiko salasana?
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host i18n */

snapshots["vaadin-login-form host i18n-partial"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Username
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
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Password
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Log in
    </vaadin-button>
    <vaadin-button
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Custom forgot password
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host i18n-partial */

snapshots["vaadin-login-form host i18n-required"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        has-error-message=""
        has-label=""
        id="vaadinLoginUsername"
        invalid=""
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-invalid="true"
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          invalid=""
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Käyttäjänimi
        </label>
        <div
          id="error-message-vaadin-text-field-2"
          slot="error-message"
        >
          Käyttäjätunnus vaaditaan
        </div>
      </vaadin-text-field>
      <vaadin-password-field
        autocomplete="current-password"
        has-error-message=""
        has-label=""
        id="vaadinLoginPassword"
        invalid=""
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-invalid="true"
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          invalid=""
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Salasana
        </label>
        <div
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
          Salasana vaaditaan
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Kirjaudu sisään
    </vaadin-button>
    <vaadin-button
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Unohtuiko salasana?
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host i18n-required */

snapshots["vaadin-login-form host noForgotPassword"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper id="vaadinLoginFormWrapper">
    <form
      method="POST"
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
        manual-validation=""
        name="username"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-text-field-0"
          autocapitalize="none"
          autocomplete="username"
          autocorrect="off"
          id="input-vaadin-text-field-6"
          name="username"
          required=""
          slot="input"
          type="text"
        >
        <label
          for="input-vaadin-text-field-6"
          id="label-vaadin-text-field-0"
          slot="label"
        >
          Username
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
        manual-validation=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          aria-labelledby="label-vaadin-password-field-3"
          autocapitalize="off"
          autocomplete="current-password"
          id="input-vaadin-password-field-7"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <label
          for="input-vaadin-password-field-7"
          id="label-vaadin-password-field-3"
          slot="label"
        >
          Password
        </label>
        <div
          hidden=""
          id="error-message-vaadin-password-field-5"
          slot="error-message"
        >
        </div>
        <vaadin-password-field-button
          aria-label="Show password"
          aria-pressed="false"
          role="button"
          slot="reveal"
          tabindex="0"
        >
        </vaadin-password-field-button>
      </vaadin-password-field>
    </form>
    <vaadin-button
      role="button"
      slot="submit"
      tabindex="0"
      theme="primary contained submit"
    >
      Log in
    </vaadin-button>
    <vaadin-button
      hidden=""
      role="button"
      slot="forgot-password"
      tabindex="0"
      theme="tertiary small"
    >
      Forgot password
    </vaadin-button>
  </vaadin-login-form-wrapper>
</vaadin-login-form>
`;
/* end snapshot vaadin-login-form host noForgotPassword */

snapshots["vaadin-login-form shadow default"] = 
`<section part="form">
  <div
    aria-level="1"
    part="form-title"
    role="heading"
  >
    Log in
  </div>
  <div
    hidden=""
    part="error-message"
  >
    <strong part="error-message-title">
      Incorrect username or password
    </strong>
    <p part="error-message-description">
      Check that you have entered the correct username and password and try again.
    </p>
  </div>
  <slot name="form">
  </slot>
  <slot name="custom-form-area">
  </slot>
  <slot name="submit">
  </slot>
  <slot name="forgot-password">
  </slot>
  <div part="footer">
    <slot name="footer">
    </slot>
    <p>
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow default */

snapshots["vaadin-login-form shadow error"] = 
`<section part="form">
  <div
    aria-level="1"
    part="form-title"
    role="heading"
  >
    Log in
  </div>
  <div part="error-message">
    <strong part="error-message-title">
      Incorrect username or password
    </strong>
    <p part="error-message-description">
      Check that you have entered the correct username and password and try again.
    </p>
  </div>
  <slot name="form">
  </slot>
  <slot name="custom-form-area">
  </slot>
  <slot name="submit">
  </slot>
  <slot name="forgot-password">
  </slot>
  <div part="footer">
    <slot name="footer">
    </slot>
    <p>
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow error */

snapshots["vaadin-login-form shadow i18n"] = 
`<section part="form">
  <div
    aria-level="1"
    part="form-title"
    role="heading"
  >
    Kirjaudu sisään
  </div>
  <div
    hidden=""
    part="error-message"
  >
    <strong part="error-message-title">
      Väärä käyttäjätunnus tai salasana
    </strong>
    <p part="error-message-description">
      Tarkista että käyttäjätunnus ja salasana ovat oikein ja yritä uudestaan.
    </p>
  </div>
  <slot name="form">
  </slot>
  <slot name="custom-form-area">
  </slot>
  <slot name="submit">
  </slot>
  <slot name="forgot-password">
  </slot>
  <div part="footer">
    <slot name="footer">
    </slot>
    <p>
      Jos tarvitset lisätietoja käyttäjälle.
    </p>
  </div>
</section>
`;
/* end snapshot vaadin-login-form shadow i18n */

