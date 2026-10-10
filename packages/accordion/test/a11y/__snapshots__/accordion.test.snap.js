/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-accordion default"] = 
`- button "Panel 1" [expanded]
- text: Content 1
- button "Panel 2"
- button "Panel 3"`;
/* end snapshot vaadin-accordion default */

snapshots["vaadin-accordion opened"] = 
`- button "Panel 1"
- button "Panel 2" [expanded]
- text: Content 2
- button "Panel 3"`;
/* end snapshot vaadin-accordion opened */

snapshots["vaadin-accordion closed"] = 
`- button "Panel 1"
- button "Panel 2"
- button "Panel 3"`;
/* end snapshot vaadin-accordion closed */

snapshots["vaadin-accordion disabled panel"] = 
`- button "Panel 1" [expanded]
- text: Content 1
- button "Panel 2"
- heading "Panel 3" [disabled, level=2]`;
/* end snapshot vaadin-accordion disabled panel */

