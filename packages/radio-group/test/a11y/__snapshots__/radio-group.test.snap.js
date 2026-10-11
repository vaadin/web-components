/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-radio-group default"] = 
`- radiogroup "Size":
  - radio "Small"
  - text: Small
  - radio "Medium"
  - text: Medium
  - radio "Large"
  - text: Large`;
/* end snapshot vaadin-radio-group default */

snapshots["vaadin-radio-group value"] = 
`- radiogroup "Size":
  - radio "Small"
  - text: Small
  - radio "Medium" [checked]
  - text: Medium
  - radio "Large"
  - text: Large`;
/* end snapshot vaadin-radio-group value */

snapshots["vaadin-radio-group disabled"] = 
`- radiogroup "Size" [disabled]:
  - radio "Small" [disabled]
  - text: Small
  - radio "Medium" [disabled]
  - text: Medium
  - radio "Large" [disabled]
  - text: Large`;
/* end snapshot vaadin-radio-group disabled */

snapshots["vaadin-radio-group readonly"] = 
`- radiogroup "Size":
  - radio "Small" [disabled]
  - text: Small
  - radio "Medium" [checked]
  - text: Medium
  - radio "Large" [disabled]
  - text: Large`;
/* end snapshot vaadin-radio-group readonly */

snapshots["vaadin-radio-group required"] = 
`- radiogroup "Size" [required]:
  - radio "Small"
  - text: Small
  - radio "Medium"
  - text: Medium
  - radio "Large"
  - text: Large`;
/* end snapshot vaadin-radio-group required */

snapshots["vaadin-radio-group helper"] = 
`- radiogroup "Size":
  - /description: Choose one
  - radio "Small"
  - text: Small
  - radio "Medium"
  - text: Medium
  - radio "Large"
  - text: Large
  - text: Choose one`;
/* end snapshot vaadin-radio-group helper */

snapshots["vaadin-radio-group error"] = 
`- radiogroup "Size" [invalid]:
  - /description: Choose a size
  - radio "Small"
  - text: Small
  - radio "Medium"
  - text: Medium
  - radio "Large"
  - text: Large
  - text: Choose a size`;
/* end snapshot vaadin-radio-group error */

