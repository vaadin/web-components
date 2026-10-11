/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-password-field default"] = 
`- text: Password
- textbox "Password"
- button "Show password"`;
/* end snapshot vaadin-password-field default */

snapshots["vaadin-password-field value"] = 
`- text: Password
- textbox "Password": secret
- button "Show password"`;
/* end snapshot vaadin-password-field value */


snapshots["vaadin-password-field reveal button hidden"] = 
`- text: Password
- textbox "Password"`;
/* end snapshot vaadin-password-field reveal button hidden */

snapshots["vaadin-password-field disabled"] = 
`- text: Password
- textbox "Password" [disabled]
- button "Show password" [disabled]`;
/* end snapshot vaadin-password-field disabled */

snapshots["vaadin-password-field readonly"] = 
`- text: Password
- textbox "Password"
- button "Show password"`;
/* end snapshot vaadin-password-field readonly */

snapshots["vaadin-password-field required"] = 
`- text: Password
- textbox "Password"
- button "Show password"`;
/* end snapshot vaadin-password-field required */

snapshots["vaadin-password-field helper"] = 
`- text: Password
- textbox "Password"
- button "Show password"
- text: At least 8 characters`;
/* end snapshot vaadin-password-field helper */

snapshots["vaadin-password-field error"] = 
`- text: Password
- textbox "Password" [invalid]
- button "Show password"
- text: Error message`;
/* end snapshot vaadin-password-field error */

snapshots["vaadin-password-field password visible"] = 
`- text: Password
- textbox "Password": secret
- button "Show password" [pressed]`;
/* end snapshot vaadin-password-field password visible */

