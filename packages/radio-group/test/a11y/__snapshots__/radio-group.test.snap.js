/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-radio-group default"] = 
`- text: Size
- radio "Small" [checked=false]
- text: Small
- radio "Medium" [checked=false]
- text: Medium
- radio "Large" [checked=false]
- text: Large`;
/* end snapshot vaadin-radio-group default */

snapshots["vaadin-radio-group value"] = 
`- text: Size
- radio "Small" [checked=false]
- text: Small
- radio "Medium" [checked]
- text: Medium
- radio "Large" [checked=false]
- text: Large`;
/* end snapshot vaadin-radio-group value */

snapshots["vaadin-radio-group disabled"] = 
`- text: Size
- radio "Small" [disabled, checked=false]
- text: Small
- radio "Medium" [disabled, checked=false]
- text: Medium
- radio "Large" [disabled, checked=false]
- text: Large`;
/* end snapshot vaadin-radio-group disabled */

snapshots["vaadin-radio-group readonly"] = 
`- text: Size
- radio "Small" [disabled, checked=false]
- text: Small
- radio "Medium" [checked]
- text: Medium
- radio "Large" [disabled, checked=false]
- text: Large`;
/* end snapshot vaadin-radio-group readonly */

snapshots["vaadin-radio-group required"] = 
`- text: Size
- radio "Small" [checked=false]
- text: Small
- radio "Medium" [checked=false]
- text: Medium
- radio "Large" [checked=false]
- text: Large`;
/* end snapshot vaadin-radio-group required */

snapshots["vaadin-radio-group helper"] = 
`- text: Size
- radio "Small" [checked=false]
- text: Small
- radio "Medium" [checked=false]
- text: Medium
- radio "Large" [checked=false]
- text: Large
- text: Choose one`;
/* end snapshot vaadin-radio-group helper */

snapshots["vaadin-radio-group error"] = 
`- text: Size
- radio "Small" [checked=false]
- text: Small
- radio "Medium" [checked=false]
- text: Medium
- radio "Large" [checked=false]
- text: Large
- text: Choose a size`;
/* end snapshot vaadin-radio-group error */

