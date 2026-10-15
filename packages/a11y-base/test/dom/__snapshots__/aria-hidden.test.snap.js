/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["aria-hidden hide single target"] = 
`<div>
  <div id="parent">
    <div
      aria-hidden="true"
      data-aria-hidden="true"
    >
      hide me 1
    </div>
    <div id="target1">
      not me 2
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
    >
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="outside1"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="hidden1"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-aria-hidden="true"
      id="hidden2"
    >
      I am hidden in a wrong way 6
    </div>
    <div aria-live="polite">
      not-hidden life
    </div>
    <div aria-live="off">
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden hide single target */

snapshots["aria-hidden hide multiple targets"] = 
`<div>
  <div id="parent">
    <div
      aria-hidden="true"
      data-aria-hidden="true"
    >
      hide me 1
    </div>
    <div id="target1">
      not me 2
    </div>
    <div>
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="outside1"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="hidden1"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-aria-hidden="true"
      id="hidden2"
    >
      I am hidden in a wrong way 6
    </div>
    <div aria-live="polite">
      not-hidden life
    </div>
    <div aria-live="off">
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden hide multiple targets */

snapshots["aria-hidden hide multiple calls"] = 
`<div>
  <div id="parent">
    <div
      aria-hidden="true"
      data-aria-hidden="true"
    >
      hide me 1
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="target1"
    >
      not me 2
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
    >
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="outside1"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-aria-hidden="true"
      id="hidden1"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-aria-hidden="true"
      id="hidden2"
    >
      I am hidden in a wrong way 6
    </div>
    <div aria-live="polite">
      not-hidden life
    </div>
    <div aria-live="off">
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden hide multiple calls */

snapshots["aria-hidden inert single target"] = 
`<div>
  <div id="parent">
    <div
      data-inert-ed="true"
      inert="true"
    >
      hide me 1
    </div>
    <div id="target1">
      not me 2
    </div>
    <div
      data-inert-ed="true"
      inert="true"
    >
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      data-inert-ed="true"
      id="outside1"
      inert="true"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-inert-ed="true"
      id="hidden1"
      inert="true"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-inert-ed="true"
      id="hidden2"
      inert="true"
    >
      I am hidden in a wrong way 6
    </div>
    <div
      aria-live="polite"
      data-inert-ed="true"
      inert="true"
    >
      not-hidden life
    </div>
    <div
      aria-live="off"
      data-inert-ed="true"
      inert="true"
    >
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden inert single target */

snapshots["aria-hidden inert multiple targets"] = 
`<div>
  <div id="parent">
    <div
      data-inert-ed="true"
      inert="true"
    >
      hide me 1
    </div>
    <div id="target1">
      not me 2
    </div>
    <div>
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      data-inert-ed="true"
      id="outside1"
      inert="true"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-inert-ed="true"
      id="hidden1"
      inert="true"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-inert-ed="true"
      id="hidden2"
      inert="true"
    >
      I am hidden in a wrong way 6
    </div>
    <div
      aria-live="polite"
      data-inert-ed="true"
      inert="true"
    >
      not-hidden life
    </div>
    <div
      aria-live="off"
      data-inert-ed="true"
      inert="true"
    >
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden inert multiple targets */

snapshots["aria-hidden inert multiple calls"] = 
`<div>
  <div id="parent">
    <div
      data-inert-ed="true"
      inert="true"
    >
      hide me 1
    </div>
    <div
      data-inert-ed="true"
      id="target1"
      inert="true"
    >
      not me 2
    </div>
    <div
      data-inert-ed="true"
      inert="true"
    >
      <div id="target2">
        not me 3
      </div>
    </div>
    <div
      data-inert-ed="true"
      id="outside1"
      inert="true"
    >
      hide me 4
    </div>
    <div
      aria-hidden="true"
      data-inert-ed="true"
      id="hidden1"
      inert="true"
    >
      I am already hidden! 5
    </div>
    <div
      aria-hidden=""
      data-inert-ed="true"
      id="hidden2"
      inert="true"
    >
      I am hidden in a wrong way 6
    </div>
    <div
      aria-live="polite"
      data-inert-ed="true"
      inert="true"
    >
      not-hidden life
    </div>
    <div
      aria-live="off"
      data-inert-ed="true"
      inert="true"
    >
      hidden life
    </div>
  </div>
  <div>
    don't touch me 6
  </div>
</div>
`;
/* end snapshot aria-hidden inert multiple calls */

