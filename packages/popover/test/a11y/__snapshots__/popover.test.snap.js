/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-popover closed"] = 
`- button "Settings" [haspopup=dialog]`;
/* end snapshot vaadin-popover closed */

snapshots["vaadin-popover opened"] = 
`- button "Settings" [expanded, haspopup=dialog]
- dialog "Settings":
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover opened */

snapshots["vaadin-popover modal"] = 
`- button "Settings" [expanded, haspopup=dialog]
- dialog "Settings" [focused, modal]:
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover modal */

snapshots["vaadin-popover no accessible name"] = 
`- button "Settings" [expanded, haspopup=dialog]
- dialog:
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover no accessible name */

snapshots["vaadin-popover accessible name ref"] = 
`- button "Settings" [expanded, haspopup=dialog]
- dialog "Display settings":
  - heading "Display settings" [level=3]
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover accessible name ref */

snapshots["vaadin-popover overlay role"] = 
`- button "Settings" [expanded, haspopup=dialog]
- alertdialog "Settings":
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover overlay role */

snapshots["vaadin-popover hover trigger"] = 
`- button "Settings" [expanded, haspopup=dialog]
- dialog "Settings":
  - checkbox "Dark mode" [checked=false]`;
/* end snapshot vaadin-popover hover trigger */

