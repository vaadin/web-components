/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-combo-box default"] = 
`- text: Country
- combobox "Country"`;
/* end snapshot vaadin-combo-box default */

snapshots["vaadin-combo-box value"] = 
`- text: Country
- combobox "Country": Germany`;
/* end snapshot vaadin-combo-box value */

snapshots["vaadin-combo-box placeholder"] = 
`- text: Country
- combobox "Country"`;
/* end snapshot vaadin-combo-box placeholder */

snapshots["vaadin-combo-box disabled"] = 
`- text: Country
- combobox "Country" [disabled]`;
/* end snapshot vaadin-combo-box disabled */

snapshots["vaadin-combo-box readonly"] = 
`- text: Country
- combobox "Country"`;
/* end snapshot vaadin-combo-box readonly */

snapshots["vaadin-combo-box required"] = 
`- text: Country
- combobox "Country"`;
/* end snapshot vaadin-combo-box required */

snapshots["vaadin-combo-box error"] = 
`- text: Country
- combobox "Country" [invalid]
- text: Error message`;
/* end snapshot vaadin-combo-box error */

snapshots["vaadin-combo-box opened"] = 
`- text: Country
- combobox "Country" [expanded]: Germany
- listbox:
  - option "Finland"
  - option "Germany" [selected]
  - option "Sweden"`;
/* end snapshot vaadin-combo-box opened */

