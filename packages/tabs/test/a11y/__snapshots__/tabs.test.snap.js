/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tabs default"] = 
`- tablist:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"`;
/* end snapshot vaadin-tabs default */

snapshots["vaadin-tabs selected"] = 
`- tablist:
  - tab "Tab 1"
  - tab "Tab 2" [selected]
  - tab "Tab 3"`;
/* end snapshot vaadin-tabs selected */

snapshots["vaadin-tabs disabled tab"] = 
`- tablist:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3" [disabled]`;
/* end snapshot vaadin-tabs disabled tab */

snapshots["vaadin-tabs aria-label"] = 
`- tablist "Sections":
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"`;
/* end snapshot vaadin-tabs aria-label */

