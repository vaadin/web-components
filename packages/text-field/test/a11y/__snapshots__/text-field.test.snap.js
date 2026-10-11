/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-text-field default"] = 
`- text: Name
- textbox "Name"`;
/* end snapshot vaadin-text-field default */

snapshots["vaadin-text-field value"] = 
`- text: Name
- textbox "Name": John`;
/* end snapshot vaadin-text-field value */

snapshots["vaadin-text-field placeholder"] = 
`- text: Name
- textbox "Name":
  - /placeholder: Type here`;
/* end snapshot vaadin-text-field placeholder */

snapshots["vaadin-text-field disabled"] = 
`- text: Name
- textbox "Name" [disabled]`;
/* end snapshot vaadin-text-field disabled */

snapshots["vaadin-text-field readonly"] = 
`- text: Name
- textbox "Name"`;
/* end snapshot vaadin-text-field readonly */

snapshots["vaadin-text-field required"] = 
`- text: Name
- textbox "Name"`;
/* end snapshot vaadin-text-field required */

snapshots["vaadin-text-field helper"] = 
`- text: Name
- textbox "Name"
- text: Helper text`;
/* end snapshot vaadin-text-field helper */

snapshots["vaadin-text-field error"] = 
`- text: Name
- textbox "Name" [invalid]
- text: Error message`;
/* end snapshot vaadin-text-field error */

snapshots["vaadin-text-field clear button"] = 
`- text: Name
- textbox "Name": John`;
/* end snapshot vaadin-text-field clear button */

snapshots["vaadin-text-field prefix and suffix"] = 
`- text: Price $
- textbox "Price"
- text: USD`;
/* end snapshot vaadin-text-field prefix and suffix */

