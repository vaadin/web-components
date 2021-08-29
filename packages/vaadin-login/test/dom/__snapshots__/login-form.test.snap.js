/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-form default"] = 
`<vaadin-login-form>
  <vaadin-login-form-wrapper part="vaadin-login-native-form-wrapper">
    <form
      method="POST"
      part="vaadin-login-native-form"
      slot="form"
    >
      <input type="hidden">
      <vaadin-text-field
        autocapitalize="none"
        autocorrect="off"
        focused=""
        has-label=""
        name="username"
        required=""
        spellcheck="false"
        tabindex="0"
      >
        <input
          autocapitalize="none"
          autocorrect="off"
          name="username"
          required=""
          slot="input"
          tabindex="0"
          type="text"
        >
      </vaadin-text-field>
      <vaadin-password-field
        has-label=""
        name="password"
        required=""
        spellcheck="false"
      >
        <input
          autocapitalize="off"
          name="password"
          required=""
          slot="input"
          type="password"
        >
        <div
          aria-live="assertive"
          slot="error-message"
        >
        </div>
        <label slot="label">
          Password
        </label>
        <div slot="helper">
        </div>
        <button
          aria-label="Show password"
          aria-pressed="false"
          slot="reveal"
          tabindex="0"
          type="button"
        >
        </button>
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
/* end snapshot vaadin-login-form default */

