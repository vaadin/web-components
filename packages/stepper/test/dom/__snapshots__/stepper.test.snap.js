/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-stepper stepper host default"] = 
`<vaadin-stepper
  aria-label="Progress"
  orientation="vertical"
  role="navigation"
>
  <vaadin-step
    href="/step1"
    label="Step 1"
    orientation="vertical"
    role="listitem"
    state="completed"
  >
  </vaadin-step>
  <vaadin-step
    href="/step2"
    label="Step 2"
    orientation="vertical"
    role="listitem"
    state="active"
  >
  </vaadin-step>
  <vaadin-step
    description="Third step"
    label="Step 3"
    orientation="vertical"
    role="listitem"
    state="inactive"
  >
  </vaadin-step>
</vaadin-stepper>
`;
/* end snapshot vaadin-stepper stepper host default */

snapshots["vaadin-stepper stepper host horizontal"] = 
`<vaadin-stepper
  aria-label="Progress"
  orientation="vertical"
  role="navigation"
>
  <vaadin-step
    href="/step1"
    label="Step 1"
    orientation="vertical"
    role="listitem"
    state="completed"
  >
  </vaadin-step>
  <vaadin-step
    href="/step2"
    label="Step 2"
    orientation="vertical"
    role="listitem"
    state="active"
  >
  </vaadin-step>
  <vaadin-step
    description="Third step"
    label="Step 3"
    orientation="vertical"
    role="listitem"
    state="inactive"
  >
  </vaadin-step>
</vaadin-stepper>
`;
/* end snapshot vaadin-stepper stepper host horizontal */

snapshots["vaadin-stepper stepper host small theme"] = 
`<vaadin-stepper
  aria-label="Progress"
  orientation="vertical"
  role="navigation"
  theme="small"
>
  <vaadin-step
    href="/step1"
    label="Step 1"
    orientation="vertical"
    role="listitem"
    state="completed"
  >
  </vaadin-step>
  <vaadin-step
    href="/step2"
    label="Step 2"
    orientation="vertical"
    role="listitem"
    state="active"
  >
  </vaadin-step>
  <vaadin-step
    description="Third step"
    label="Step 3"
    orientation="vertical"
    role="listitem"
    state="inactive"
  >
  </vaadin-step>
</vaadin-stepper>
`;
/* end snapshot vaadin-stepper stepper host small theme */

snapshots["vaadin-stepper stepper shadow default"] = 
`<nav
  part="nav"
  role="navigation"
>
  <ol
    part="list"
    role="list"
  >
    <slot>
    </slot>
  </ol>
</nav>
`;
/* end snapshot vaadin-stepper stepper shadow default */

snapshots["vaadin-step step host default with href"] = 
`<vaadin-step
  href="/test"
  label="Test Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host default with href */

snapshots["vaadin-step step host default without href"] = 
`<vaadin-step
  label="Test Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host default without href */

snapshots["vaadin-step step host with description"] = 
`<vaadin-step
  description="Step description"
  label="Test Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host with description */

snapshots["vaadin-step step host active state"] = 
`<vaadin-step
  label="Active Step"
  orientation="vertical"
  role="listitem"
  state="active"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host active state */

snapshots["vaadin-step step host completed state"] = 
`<vaadin-step
  label="Completed Step"
  orientation="vertical"
  role="listitem"
  state="completed"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host completed state */

snapshots["vaadin-step step host error state"] = 
`<vaadin-step
  label="Error Step"
  orientation="vertical"
  role="listitem"
  state="error"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host error state */

snapshots["vaadin-step step host disabled"] = 
`<vaadin-step
  aria-disabled="true"
  disabled=""
  href="/test"
  label="Disabled Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host disabled */

snapshots["vaadin-step step host with target"] = 
`<vaadin-step
  href="https://example.com"
  label="External"
  orientation="vertical"
  role="listitem"
  state="inactive"
  target="_blank"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host with target */

snapshots["vaadin-step step host router-ignore"] = 
`<vaadin-step
  href="/api"
  label="No Router"
  orientation="vertical"
  role="listitem"
  router-ignore=""
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host router-ignore */

snapshots["vaadin-step step host focused"] = 
`<vaadin-step
  href="/test"
  label="Test Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host focused */

snapshots["vaadin-step step host focus-ring"] = 
`<vaadin-step
  href="/test"
  label="Test Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host focus-ring */

snapshots["vaadin-step step host last step"] = 
`<vaadin-step
  label="Last Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host last step */

snapshots["vaadin-step step host horizontal orientation"] = 
`<vaadin-step
  description="With long description text"
  label="Horizontal Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host horizontal orientation */

snapshots["vaadin-step step host small size"] = 
`<vaadin-step
  description="Small description"
  label="Small Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host small size */

snapshots["vaadin-step step host with step number"] = 
`<vaadin-step
  label="Step"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host with step number */

snapshots["vaadin-step step host current"] = 
`<vaadin-step
  href="/"
  label="Current"
  orientation="vertical"
  role="listitem"
  state="inactive"
>
</vaadin-step>
`;
/* end snapshot vaadin-step step host current */

snapshots["vaadin-step step shadow default with href"] = 
`<a
  aria-current="false"
  href="/test"
  tabindex="0"
>
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Test Step
    </span>
  </span>
</a>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow default with href */

snapshots["vaadin-step step shadow default without href"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Test Step
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow default without href */

snapshots["vaadin-step step shadow with description"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Test Step
    </span>
    <span part="description">
      Step description
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow with description */

snapshots["vaadin-step step shadow completed state"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Completed Step
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow completed state */

snapshots["vaadin-step step shadow error state"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Error Step
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow error state */

snapshots["vaadin-step step shadow disabled"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Disabled Step
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow disabled */

snapshots["vaadin-step step shadow last step"] = 
`<div aria-current="false">
  <span
    aria-hidden="true"
    part="indicator"
  >
    <span class="step-number">
      0
    </span>
  </span>
  <span part="content">
    <span part="label">
      Last Step
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step step shadow last step */

