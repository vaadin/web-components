/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav default"] = 
`- text: Main menu
- link "Inbox"
- link "Sent"`;
/* end snapshot vaadin-side-nav default */

snapshots["vaadin-side-nav collapsible"] = 
`- button "Main menu" [expanded]
- link "Inbox"
- link "Sent"`;
/* end snapshot vaadin-side-nav collapsible */

snapshots["vaadin-side-nav collapsed"] = 
`- button "Main menu"`;
/* end snapshot vaadin-side-nav collapsed */

snapshots["vaadin-side-nav no label"] = 
`- link "Inbox"
- link "Sent"`;
/* end snapshot vaadin-side-nav no label */

snapshots["vaadin-side-nav current item"] = 
`- text: Main menu
- link "Home"
- link "Sent"`;
/* end snapshot vaadin-side-nav current item */

snapshots["vaadin-side-nav disabled item"] = 
`- text: Main menu
- generic [disabled]:
  - text: Inbox
- link "Sent"`;
/* end snapshot vaadin-side-nav disabled item */

snapshots["vaadin-side-nav item without path"] = 
`- text: Main menu
- generic:
  - text: Inbox
- link "Sent"`;
/* end snapshot vaadin-side-nav item without path */

snapshots["vaadin-side-nav prefix and suffix"] = 
`- text: Main menu
- link "Inbox 12"
- link "Sent"`;
/* end snapshot vaadin-side-nav prefix and suffix */

snapshots["vaadin-side-nav nested items collapsed"] = 
`- text: Main menu
- link "Messages"
- button "Messages Toggle child items"`;
/* end snapshot vaadin-side-nav nested items collapsed */

snapshots["vaadin-side-nav nested items expanded"] = 
`- text: Main menu
- link "Messages"
- button "Messages Toggle child items" [expanded]
- link "Inbox"
- link "Sent"`;
/* end snapshot vaadin-side-nav nested items expanded */

snapshots["vaadin-side-nav nested items parent without path"] = 
`- text: Main menu
- generic:
  - text: Messages
- button "Messages Toggle child items" [expanded]
- link "Inbox"
- link "Sent"`;
/* end snapshot vaadin-side-nav nested items parent without path */

