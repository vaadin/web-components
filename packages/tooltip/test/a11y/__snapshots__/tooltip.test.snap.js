/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tooltip default"] = 
`- button "Save":
  - /description: Save the document`;
/* end snapshot vaadin-tooltip default */

snapshots["vaadin-tooltip opened"] = 
`- button "Save":
  - /description: Save the document
- group:
  - tooltip "Save the document"`;
/* end snapshot vaadin-tooltip opened */

snapshots["vaadin-tooltip aria-labelledby link mode"] = 
`- button "Save the document"`;
/* end snapshot vaadin-tooltip aria-labelledby link mode */

snapshots["vaadin-tooltip no link mode"] = 
`- button "Save"`;
/* end snapshot vaadin-tooltip no link mode */

snapshots["vaadin-tooltip aria target"] = 
`- textbox "Name":
  - /description: Save the document
- button "Save"`;
/* end snapshot vaadin-tooltip aria target */

snapshots["vaadin-tooltip markdown"] = 
`- button "Save":
  - /description: Save the document`;
/* end snapshot vaadin-tooltip markdown */

