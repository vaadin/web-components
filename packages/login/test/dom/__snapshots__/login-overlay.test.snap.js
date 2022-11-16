/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-overlay host default"] = 
`<vaadin-login-overlay-wrapper
  focus-trap=""
  id="vaadinLoginOverlayWrapper"
  opened=""
  with-backdrop=""
>
  <vaadin-login-form
    id="vaadinLoginForm"
    theme="with-overlay"
  >
    <vaadin-login-form-wrapper
      part="vaadin-login-native-form-wrapper"
      theme="with-overlay"
    >
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
</vaadin-login-overlay-wrapper>
`;
/* end snapshot vaadin-login-overlay host default */

snapshots["vaadin-login-overlay host i18n"] = 
`<vaadin-login-overlay-wrapper
  focus-trap=""
  id="vaadinLoginOverlayWrapper"
  opened=""
  with-backdrop=""
>
  <vaadin-login-form
    id="vaadinLoginForm"
    theme="with-overlay"
  >
    <vaadin-login-form-wrapper
      part="vaadin-login-native-form-wrapper"
      theme="with-overlay"
    >
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
</vaadin-login-overlay-wrapper>
`;
/* end snapshot vaadin-login-overlay host i18n */

snapshots["vaadin-login-overlay shadow default"] = 
`<div
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
  tabindex="0"
>
  <div
    id="content"
    part="content"
  >
    <section part="card">
      <div part="brand">
        <slot name="title">
          <h1 part="title">
            App name
          </h1>
        </slot>
        <p part="description">
          Application description
        </p>
      </div>
      <div part="form">
        <slot>
        </slot>
      </div>
    </section>
  </div>
</div>
`;
/* end snapshot vaadin-login-overlay shadow default */

snapshots["vaadin-login-overlay shadow i18n"] = 
`<div
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
  tabindex="0"
>
  <div
    id="content"
    part="content"
  >
    <section part="card">
      <div part="brand">
        <slot name="title">
          <h1 part="title">
            Sovelluksen nimi
          </h1>
        </slot>
        <p part="description">
          Sovelluksen kuvaus
        </p>
      </div>
      <div part="form">
        <slot>
        </slot>
      </div>
    </section>
  </div>
</div>
`;
/* end snapshot vaadin-login-overlay shadow i18n */

