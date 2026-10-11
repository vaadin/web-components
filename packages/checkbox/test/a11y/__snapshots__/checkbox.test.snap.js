/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox default"] = 
`- checkbox "Accept terms" [checked=false]
- text: Accept terms`;
/* end snapshot vaadin-checkbox default */

snapshots["vaadin-checkbox checked"] = 
`- checkbox "Accept terms" [checked]
- text: Accept terms`;
/* end snapshot vaadin-checkbox checked */

snapshots["vaadin-checkbox indeterminate"] = 
`- checkbox "Accept terms" [checked=mixed]
- text: Accept terms`;
/* end snapshot vaadin-checkbox indeterminate */

snapshots["vaadin-checkbox disabled"] = 
`- checkbox "Accept terms" [disabled, checked=false]
- text: Accept terms`;
/* end snapshot vaadin-checkbox disabled */

snapshots["vaadin-checkbox readonly"] = 
`- checkbox "Accept terms" [checked=false]
- text: Accept terms`;
/* end snapshot vaadin-checkbox readonly */

snapshots["vaadin-checkbox required"] = 
`- checkbox "Accept terms" [checked=false, invalid]
- text: Accept terms
- text: "*"`;
/* end snapshot vaadin-checkbox required */

snapshots["vaadin-checkbox helper"] = 
`- checkbox "Accept terms" [checked=false]:
  - /description: Read the terms first
- text: Accept terms
- text: Read the terms first`;
/* end snapshot vaadin-checkbox helper */

snapshots["vaadin-checkbox error"] = 
`- checkbox "Accept terms" [checked=false, invalid]:
  - /description: You must accept the terms
- text: Accept terms
- text: You must accept the terms`;
/* end snapshot vaadin-checkbox error */

