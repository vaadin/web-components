/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-step host"] = 
`<vaadin-step role="listitem">
  Step
  <span slot="description">
    Description
  </span>
</vaadin-step>
`;
/* end snapshot vaadin-step host */

snapshots["vaadin-step shadow default"] = 
`<div part="nolink">
  <span
    aria-hidden="true"
    part="indicator"
  >
    1
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow default */

snapshots["vaadin-step shadow current"] = 
`<div
  aria-current="step"
  part="nolink"
>
  <span
    aria-hidden="true"
    part="indicator"
  >
    1
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow current */

snapshots["vaadin-step shadow completed"] = 
`<div part="nolink">
  <span
    aria-hidden="true"
    part="indicator"
  >
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
  <span class="sr-only">
    Completed
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow completed */

snapshots["vaadin-step shadow invalid"] = 
`<div part="nolink">
  <span
    aria-hidden="true"
    part="indicator"
  >
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
  <span class="sr-only">
    Error
  </span>
</div>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow invalid */

snapshots["vaadin-step shadow path"] = 
`<a
  href="/shipping"
  part="link"
  tabindex="0"
>
  <span
    aria-hidden="true"
    part="indicator"
  >
    1
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
</a>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow path */

snapshots["vaadin-step shadow disabled"] = 
`<a
  part="link"
  tabindex="-1"
>
  <span
    aria-hidden="true"
    part="indicator"
  >
    1
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
</a>
<span
  aria-hidden="true"
  part="connector"
>
</span>
`;
/* end snapshot vaadin-step shadow disabled */

snapshots["vaadin-step shadow last"] = 
`<div part="nolink">
  <span
    aria-hidden="true"
    part="indicator"
  >
    1
  </span>
  <span part="content">
    <span part="label">
      <slot>
      </slot>
    </span>
    <span part="description">
      <slot name="description">
      </slot>
    </span>
  </span>
</div>
`;
/* end snapshot vaadin-step shadow last */

