/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tabsheet default"] = 
`- tablist:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"
- tabpanel "Tab 1": Content 1`;
/* end snapshot vaadin-tabsheet default */

snapshots["vaadin-tabsheet selected"] = 
`- tablist:
  - tab "Tab 1"
  - tab "Tab 2"
  - tab "Tab 3" [selected]
- tabpanel "Tab 3": Content 3`;
/* end snapshot vaadin-tabsheet selected */

snapshots["vaadin-tabsheet prefix and suffix"] = 
`- button "Back"
- tablist:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"
- button "Add"
- tabpanel "Tab 1": Content 1`;
/* end snapshot vaadin-tabsheet prefix and suffix */

