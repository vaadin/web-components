/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-number-field default"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=0, valuemax=0]`;
/* end snapshot vaadin-number-field default */

snapshots["vaadin-number-field value"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=0, valuemax=0]: "5"`;
/* end snapshot vaadin-number-field value */

snapshots["vaadin-number-field min and max"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=1, valuemax=10]: "5"`;
/* end snapshot vaadin-number-field min and max */

snapshots["vaadin-number-field step buttons visible"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=0, valuemax=0]: "5"`;
/* end snapshot vaadin-number-field step buttons visible */

snapshots["vaadin-number-field disabled"] = 
`- text: Quantity
- spinbutton "Quantity" [disabled, valuemin=0, valuemax=0]`;
/* end snapshot vaadin-number-field disabled */

snapshots["vaadin-number-field readonly"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=0, valuemax=0]`;
/* end snapshot vaadin-number-field readonly */

snapshots["vaadin-number-field required"] = 
`- text: Quantity
- spinbutton "Quantity" [required, valuemin=0, valuemax=0]`;
/* end snapshot vaadin-number-field required */

snapshots["vaadin-number-field helper"] = 
`- text: Quantity
- spinbutton "Quantity" [valuemin=0, valuemax=0]:
  - /description: Helper text
- text: Helper text`;
/* end snapshot vaadin-number-field helper */

snapshots["vaadin-number-field error"] = 
`- text: Quantity
- spinbutton "Quantity" [invalid, valuemin=0, valuemax=0]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-number-field error */

