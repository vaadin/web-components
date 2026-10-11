/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-select default"] = 
`- text: Size
- button "Size"`;
/* end snapshot vaadin-select default */

snapshots["vaadin-select value"] = 
`- text: Size
- button "Size Medium": Medium`;
/* end snapshot vaadin-select value */

snapshots["vaadin-select placeholder"] = 
`- text: Size
- button "Size Choose a size": Choose a size`;
/* end snapshot vaadin-select placeholder */

snapshots["vaadin-select disabled"] = 
`- text: Size
- button "Size" [disabled]`;
/* end snapshot vaadin-select disabled */

snapshots["vaadin-select readonly"] = 
`- text: Size
- button "Size"`;
/* end snapshot vaadin-select readonly */

snapshots["vaadin-select required"] = 
`- text: Size
- button "Size"`;
/* end snapshot vaadin-select required */

snapshots["vaadin-select error"] = 
`- text: Size
- button "Size"
- text: Error message`;
/* end snapshot vaadin-select error */

snapshots["vaadin-select opened"] = 
`- text: Size
- button "Size Medium" [expanded]: Medium
- listbox:
  - option "Small"
  - option "Medium" [selected]
  - option "Large" [disabled]`;
/* end snapshot vaadin-select opened */

