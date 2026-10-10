/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-accordion default"] = 
`- heading "Panel 1" [level=2]:
  - /controls: region "Panel 1"
  - button "Panel 1" [expanded]
- region "Panel 1": Content 1
- heading "Panel 2" [level=2]:
  - button "Panel 2" [expanded=false]
- heading "Panel 3" [level=2]:
  - button "Panel 3" [expanded=false]`;
/* end snapshot vaadin-accordion default */

snapshots["vaadin-accordion opened"] = 
`- heading "Panel 1" [level=2]:
  - button "Panel 1" [expanded=false]
- heading "Panel 2" [level=2]:
  - /controls: region "Panel 2"
  - button "Panel 2" [expanded]
- region "Panel 2": Content 2
- heading "Panel 3" [level=2]:
  - button "Panel 3" [expanded=false]`;
/* end snapshot vaadin-accordion opened */

snapshots["vaadin-accordion closed"] = 
`- heading "Panel 1" [level=2]:
  - button "Panel 1" [expanded=false]
- heading "Panel 2" [level=2]:
  - button "Panel 2" [expanded=false]
- heading "Panel 3" [level=2]:
  - button "Panel 3" [expanded=false]`;
/* end snapshot vaadin-accordion closed */

snapshots["vaadin-accordion disabled panel"] = 
`- heading "Panel 1" [level=2]:
  - /controls: region "Panel 1"
  - button "Panel 1" [expanded]
- region "Panel 1": Content 1
- heading "Panel 2" [level=2]:
  - button "Panel 2" [expanded=false]
- heading "Panel 3" [disabled, level=2]:
  - button "Panel 3" [disabled, expanded=false]`;
/* end snapshot vaadin-accordion disabled panel */

