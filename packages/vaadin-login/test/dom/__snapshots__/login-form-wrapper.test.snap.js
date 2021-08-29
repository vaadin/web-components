/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-form-wrapper default"] = 
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
/* end snapshot vaadin-login-form-wrapper default */

