/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-switch default"] = 
`- switch "Notifications" [checked=false]
- text: Notifications`;
/* end snapshot vaadin-switch default */

snapshots["vaadin-switch checked"] = 
`- switch "Notifications" [checked]
- text: Notifications`;
/* end snapshot vaadin-switch checked */

snapshots["vaadin-switch disabled"] = 
`- switch "Notifications" [disabled, checked=false]
- text: Notifications`;
/* end snapshot vaadin-switch disabled */

snapshots["vaadin-switch readonly"] = 
`- switch "Notifications" [checked=false]
- text: Notifications`;
/* end snapshot vaadin-switch readonly */

snapshots["vaadin-switch error"] = 
`- switch "Notifications" [checked=false, invalid]:
  - /description: Notifications must be enabled
- text: Notifications
- text: Notifications must be enabled`;
/* end snapshot vaadin-switch error */

