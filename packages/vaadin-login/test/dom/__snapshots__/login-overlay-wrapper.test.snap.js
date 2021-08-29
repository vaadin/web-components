/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-login-overlay-wrapper default"] = 
`<div
  hidden=""
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
          </h1>
        </slot>
        <p part="description">
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
/* end snapshot vaadin-login-overlay-wrapper default */

snapshots["vaadin-login-overlay-wrapper title"] = 
`<div
  hidden=""
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
            App title
          </h1>
        </slot>
        <p part="description">
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
/* end snapshot vaadin-login-overlay-wrapper title */

snapshots["vaadin-login-overlay-wrapper description"] = 
`<div
  hidden=""
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
          </h1>
        </slot>
        <p part="description">
          App description
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
/* end snapshot vaadin-login-overlay-wrapper description */

