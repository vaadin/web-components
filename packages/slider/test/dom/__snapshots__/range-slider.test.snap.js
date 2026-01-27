/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-range-slider host default"] =
`<vaadin-range-slider>
  <input
    id="slider-0"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <input
    id="slider-1"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host default */

snapshots["vaadin-range-slider host value"] =
`<vaadin-range-slider>
  <input
    id="slider-0"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <input
    id="slider-1"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host value */

snapshots["vaadin-range-slider host min"] =
`<vaadin-range-slider>
  <input
    id="slider-0"
    max="100"
    min="20"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <input
    id="slider-1"
    max="100"
    min="20"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host min */

snapshots["vaadin-range-slider host max"] =
`<vaadin-range-slider>
  <input
    id="slider-0"
    max="80"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <input
    id="slider-1"
    max="80"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host max */

snapshots["vaadin-range-slider host step"] =
`<vaadin-range-slider>
  <input
    id="slider-0"
    max="100"
    min="0"
    slot="input"
    step="10"
    tabindex="0"
    type="range"
  >
  <input
    id="slider-1"
    max="100"
    min="0"
    slot="input"
    step="10"
    tabindex="0"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host step */

snapshots["vaadin-range-slider host disabled"] =
`<vaadin-range-slider
  aria-disabled="true"
  disabled=""
>
  <input
    disabled=""
    id="slider-0"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="-1"
    type="range"
  >
  <input
    disabled=""
    id="slider-1"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="-1"
    type="range"
  >
</vaadin-range-slider>
`;
/* end snapshot vaadin-range-slider host disabled */

snapshots["vaadin-range-slider shadow default"] = 
`<div id="controls">
  <div part="track">
    <div
      part="track-fill"
      style="inset-inline-start:0%;inset-inline-end:0%;"
    >
    </div>
  </div>
  <div
    part="thumb thumb-start"
    style="inset-inline-start:calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 0 / 100);"
  >
  </div>
  <div
    part="thumb thumb-end"
    style="inset-inline-start:calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 100 / 100);"
  >
  </div>
  <slot name="input">
  </slot>
</div>
`;
/* end snapshot vaadin-range-slider shadow default */

snapshots["vaadin-range-slider shadow value"] = 
`<div id="controls">
  <div part="track">
    <div
      part="track-fill"
      style="inset-inline: 10% 80%;"
    >
    </div>
  </div>
  <div
    part="thumb thumb-start"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 10 / 100);"
  >
  </div>
  <div
    part="thumb thumb-end"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 20 / 100);"
  >
  </div>
  <slot name="input">
  </slot>
</div>
`;
/* end snapshot vaadin-range-slider shadow value */

snapshots["vaadin-range-slider shadow min"] = 
`<div id="controls">
  <div part="track">
    <div
      part="track-fill"
      style="inset-inline: 25%;"
    >
    </div>
  </div>
  <div
    part="thumb thumb-start"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 25 / 100);"
  >
  </div>
  <div
    part="thumb thumb-end"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 75 / 100);"
  >
  </div>
  <slot name="input">
  </slot>
</div>
`;
/* end snapshot vaadin-range-slider shadow min */

snapshots["vaadin-range-slider shadow max"] = 
`<div id="controls">
  <div part="track">
    <div
      part="track-fill"
      style="inset-inline: 25%;"
    >
    </div>
  </div>
  <div
    part="thumb thumb-start"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 25 / 100);"
  >
  </div>
  <div
    part="thumb thumb-end"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 75 / 100);"
  >
  </div>
  <slot name="input">
  </slot>
</div>
`;
/* end snapshot vaadin-range-slider shadow max */

snapshots["vaadin-range-slider shadow step"] = 
`<div id="controls">
  <div part="track">
    <div
      part="track-fill"
      style="inset-inline: 20% 40%;"
    >
    </div>
  </div>
  <div
    part="thumb thumb-start"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 20 / 100);"
  >
  </div>
  <div
    part="thumb thumb-end"
    style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 60 / 100);"
  >
  </div>
  <slot name="input">
  </slot>
</div>
`;
/* end snapshot vaadin-range-slider shadow step */

