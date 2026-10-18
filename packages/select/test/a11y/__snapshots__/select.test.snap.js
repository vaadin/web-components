/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-select default"] = 
`- text: Size
- combobox "Size" [haspopup=listbox]`;
/* end snapshot vaadin-select default */

snapshots["vaadin-select value"] = 
`- text: Size
- combobox "Size" [haspopup=listbox]: Medium`;
/* end snapshot vaadin-select value */

snapshots["vaadin-select placeholder"] = 
`- text: Size
- combobox "Size" [haspopup=listbox]: Choose a size`;
/* end snapshot vaadin-select placeholder */

snapshots["vaadin-select helper text"] = 
`- text: Size
- combobox "Size" [haspopup=listbox]:
  - /description: Pick one size
- text: Pick one size`;
/* end snapshot vaadin-select helper text */

snapshots["vaadin-select accessible name"] = 
`- text: Size
- combobox "T-shirt size" [haspopup=listbox]`;
/* end snapshot vaadin-select accessible name */

snapshots["vaadin-select disabled"] = 
`- text: Size
- combobox "Size" [disabled, haspopup=listbox]`;
/* end snapshot vaadin-select disabled */

snapshots["vaadin-select readonly"] = 
`- text: Size
- combobox "Size" [haspopup=listbox]`;
/* end snapshot vaadin-select readonly */

snapshots["vaadin-select required"] = 
`- text: Size
- combobox "Size" [required, haspopup=listbox]`;
/* end snapshot vaadin-select required */

snapshots["vaadin-select error"] = 
`- text: Size
- combobox "Size" [haspopup=listbox, invalid]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-select error */

snapshots["vaadin-select opened"] = 
`- text: Size
- combobox "Size" [expanded, haspopup=listbox]: Medium
- listbox [orientation=vertical]:
  - option "Small"
  - option "Medium" [focused, selected]
  - option "Large" [disabled]`;
/* end snapshot vaadin-select opened */

