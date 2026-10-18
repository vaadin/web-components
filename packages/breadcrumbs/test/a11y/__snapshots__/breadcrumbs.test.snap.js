/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs default"] = 
`- link "Home"
- link "Documents"
- link "Projects"
- text: Summary report`;
/* end snapshot vaadin-breadcrumbs default */

snapshots["vaadin-breadcrumbs overflow"] = 
`- button "More items" [haspopup=menu]
- text: Summary report`;
/* end snapshot vaadin-breadcrumbs overflow */

snapshots["vaadin-breadcrumbs overflow opened"] = 
`- button "More items" [expanded, haspopup=menu]
- text: Summary report
- link "Home"
- link "Documents"
- link "Projects"`;
/* end snapshot vaadin-breadcrumbs overflow opened */

