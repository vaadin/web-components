/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-overlay host default"] =
`<vaadin-login-overlay-wrapper
  exportparts="backdrop, overlay, content, card, brand, description, form-wrapper"
  focus-trap=""
  id="overlay"
  opened=""
  popover="manual"
  with-backdrop=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <vaadin-login-form-wrapper
    aria-labelledby="title"
    exportparts="error-message, error-message-title, error-message-description, footer"
    id="form"
    part="form"
    role="region"
  >
    <div
      aria-level="2"
      id="title"
      part="form-title"
      role="heading"
      slot="form-title"
    >
      Log in
    </div>
    <slot
      name="form"
      slot="form"
    >
    </slot>
    <slot
      name="custom-form-area"
      slot="custom-form-area"
    >
    </slot>
    <slot
      name="submit"
      slot="submit"
    >
    </slot>
    <slot
      name="forgot-password"
      slot="forgot-password"
    >
    </slot>
    <slot
      name="footer"
      slot="footer"
    >
    </slot>
  </vaadin-login-form-wrapper>
</vaadin-login-overlay-wrapper>
`;
/* end snapshot vaadin-login-overlay host default */

snapshots["vaadin-login-overlay host i18n"] =
`<vaadin-login-overlay-wrapper
  exportparts="backdrop, overlay, content, card, brand, description, form-wrapper"
  focus-trap=""
  id="overlay"
  opened=""
  popover="manual"
  with-backdrop=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <vaadin-login-form-wrapper
    aria-labelledby="title"
    exportparts="error-message, error-message-title, error-message-description, footer"
    id="form"
    part="form"
    role="region"
  >
    <div
      aria-level="2"
      id="title"
      part="form-title"
      role="heading"
      slot="form-title"
    >
      Kirjaudu sisään
    </div>
    <slot
      name="form"
      slot="form"
    >
    </slot>
    <slot
      name="custom-form-area"
      slot="custom-form-area"
    >
    </slot>
    <slot
      name="submit"
      slot="submit"
    >
    </slot>
    <slot
      name="forgot-password"
      slot="forgot-password"
    >
    </slot>
    <slot
      name="footer"
      slot="footer"
    >
    </slot>
  </vaadin-login-form-wrapper>
</vaadin-login-overlay-wrapper>
`;
/* end snapshot vaadin-login-overlay host i18n */

snapshots["vaadin-login-overlay host i18n-partial"] =
`<vaadin-login-overlay-wrapper
  exportparts="backdrop, overlay, content, card, brand, description, form-wrapper"
  focus-trap=""
  id="overlay"
  opened=""
  popover="manual"
  with-backdrop=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <vaadin-login-form-wrapper
    aria-labelledby="title"
    exportparts="error-message, error-message-title, error-message-description, footer"
    id="form"
    part="form"
    role="region"
  >
    <div
      aria-level="2"
      id="title"
      part="form-title"
      role="heading"
      slot="form-title"
    >
      Log in
    </div>
    <slot
      name="form"
      slot="form"
    >
    </slot>
    <slot
      name="custom-form-area"
      slot="custom-form-area"
    >
    </slot>
    <slot
      name="submit"
      slot="submit"
    >
    </slot>
    <slot
      name="forgot-password"
      slot="forgot-password"
    >
    </slot>
    <slot
      name="footer"
      slot="footer"
    >
    </slot>
  </vaadin-login-form-wrapper>
</vaadin-login-overlay-wrapper>
`;
/* end snapshot vaadin-login-overlay host i18n-partial */

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
        </slot>
        <div part="description">
          Application description
        </div>
      </div>
      <div part="form-wrapper">
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
        </slot>
        <div part="description">
          Sovelluksen kuvaus
        </div>
      </div>
      <div part="form-wrapper">
        <slot>
        </slot>
      </div>
    </section>
  </div>
</div>
`;
/* end snapshot vaadin-login-overlay shadow i18n */

