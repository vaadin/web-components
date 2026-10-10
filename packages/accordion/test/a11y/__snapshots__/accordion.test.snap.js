/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-accordion default"] = 
`- heading "Panel 1":
  - button "Panel 1" [expanded]
- region "Panel 1": Content 1
- heading "Panel 2":
  - button "Panel 2"
- heading "Panel 3":
  - button "Panel 3"`;
/* end snapshot vaadin-accordion default */

snapshots["vaadin-accordion opened"] = 
`- heading "Panel 1":
  - button "Panel 1"
- heading "Panel 2":
  - button "Panel 2" [expanded]
- region "Panel 2": Content 2
- heading "Panel 3":
  - button "Panel 3"`;
/* end snapshot vaadin-accordion opened */

snapshots["vaadin-accordion closed"] = 
`- heading "Panel 1":
  - button "Panel 1"
- heading "Panel 2":
  - button "Panel 2"
- heading "Panel 3":
  - button "Panel 3"`;
/* end snapshot vaadin-accordion closed */

snapshots["vaadin-accordion disabled panel"] = 
`- heading "Panel 1":
  - button "Panel 1" [expanded]
- region "Panel 1": Content 1
- heading "Panel 2":
  - button "Panel 2"
- heading "Panel 3":
  - button "Panel 3" [disabled]`;
/* end snapshot vaadin-accordion disabled panel */

