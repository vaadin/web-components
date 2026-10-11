/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-text-area default"] = 
`- text: Comment
- textbox "Comment"`;
/* end snapshot vaadin-text-area default */

snapshots["vaadin-text-area value"] = 
`- text: Comment
- textbox "Comment": "Line 1\nLine 2"`;
/* end snapshot vaadin-text-area value */

snapshots["vaadin-text-area placeholder"] = 
`- text: Comment
- textbox "Comment"`;
/* end snapshot vaadin-text-area placeholder */

snapshots["vaadin-text-area disabled"] = 
`- text: Comment
- textbox "Comment" [disabled]`;
/* end snapshot vaadin-text-area disabled */

snapshots["vaadin-text-area readonly"] = 
`- text: Comment
- textbox "Comment" [readonly]`;
/* end snapshot vaadin-text-area readonly */

snapshots["vaadin-text-area required"] = 
`- text: Comment
- textbox "Comment" [required]`;
/* end snapshot vaadin-text-area required */

snapshots["vaadin-text-area helper"] = 
`- text: Comment
- textbox "Comment":
  - /description: Helper text
- text: Helper text`;
/* end snapshot vaadin-text-area helper */

snapshots["vaadin-text-area error"] = 
`- text: Comment
- textbox "Comment" [invalid]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-text-area error */

