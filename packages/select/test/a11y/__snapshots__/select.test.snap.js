/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-select default"] = 
`- text: Size
- button "Size" [haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-select default */

snapshots["vaadin-select value"] = 
`- text: Size
- button "Size Medium" [haspopup=listbox, expanded=false]: Medium`;
/* end snapshot vaadin-select value */

snapshots["vaadin-select placeholder"] = 
`- text: Size
- button "Size Choose a size" [haspopup=listbox, expanded=false]: Choose a size`;
/* end snapshot vaadin-select placeholder */

snapshots["vaadin-select disabled"] = 
`- text: Size
- button "Size" [disabled, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-select disabled */

snapshots["vaadin-select readonly"] = 
`- text: Size
- button "Size" [haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-select readonly */

snapshots["vaadin-select required"] = 
`- text: Size
- button "Size" [haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-select required */

snapshots["vaadin-select error"] = 
`- text: Size
- button "Size" [invalid, haspopup=listbox, expanded=false]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-select error */

snapshots["vaadin-select opened"] = 
`- text: Size
- button "Size Medium" [haspopup=listbox, expanded]: Medium
- group:
  - listbox [orientation=vertical]:
    - option "Small"
    - option "Medium" [selected]
    - option "Large" [disabled]`;
/* end snapshot vaadin-select opened */

snapshots["vaadin-select helper text"] = 
`- text: Size
- button "Size" [haspopup=listbox, expanded=false]:
  - /description: Pick one size
- text: Pick one size`;
/* end snapshot vaadin-select helper text */

snapshots["vaadin-select accessible name"] = 
`- text: Size
- button "T-shirt size" [haspopup=listbox, expanded=false]
- text: "T-shirt size"`;
/* end snapshot vaadin-select accessible name */

