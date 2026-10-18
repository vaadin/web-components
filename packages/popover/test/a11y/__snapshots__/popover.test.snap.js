/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-popover closed"] = 
`- button "Settings" [haspopup=dialog, expanded=false]`;
/* end snapshot vaadin-popover closed */

snapshots["vaadin-popover opened"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: dialog "Settings"
- dialog "Settings":
  - group:
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover opened */

snapshots["vaadin-popover modal"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: dialog "Settings"
- dialog "Settings" [modal]:
  - group:
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover modal */

snapshots["vaadin-popover no accessible name"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: dialog
- dialog:
  - group:
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover no accessible name */

snapshots["vaadin-popover accessible name ref"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: dialog "Display settings"
- dialog "Display settings":
  - group:
    - heading "Display settings" [level=3]
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover accessible name ref */

snapshots["vaadin-popover overlay role"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: alertdialog "Settings"
- alertdialog "Settings":
  - group:
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover overlay role */

snapshots["vaadin-popover hover trigger"] = 
`- button "Settings" [haspopup=dialog, expanded]:
  - /controls: dialog "Settings"
- dialog "Settings":
  - group:
    - checkbox "Dark mode"`;
/* end snapshot vaadin-popover hover trigger */

