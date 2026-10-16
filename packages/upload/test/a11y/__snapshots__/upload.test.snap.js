/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload default"] = 
`- button "Upload Files..."`;
/* end snapshot vaadin-upload default */

snapshots["vaadin-upload files"] = 
`- button "Upload Files..."
- generic:
  - text: Annual Report.docx
  - button "Remove":
    - /description: Annual Report.docx
- generic:
  - text: Workflow.pdf
  - text: "19.7 MB: 60% (remaining time: 00:12:34)"
  - button "Remove":
    - /description: Workflow.pdf
- generic:
  - text: Financials.xlsx
  - text: An error occurred
  - button "Retry":
    - /description: Financials.xlsx
  - button "Remove":
    - /description: Financials.xlsx
- generic:
  - text: Notes.txt
  - text: Queued
  - button "Start":
    - /description: Notes.txt
  - button "Remove":
    - /description: Notes.txt`;
/* end snapshot vaadin-upload files */

snapshots["vaadin-upload max files reached"] = 
`- button "Upload File..." [disabled]
- generic:
  - text: Annual Report.docx
  - button "Remove":
    - /description: Annual Report.docx`;
/* end snapshot vaadin-upload max files reached */

snapshots["vaadin-upload disabled"] = 
`- button "Upload Files..." [disabled]
- text: Annual Report.docx
- button "Remove" [disabled]:
  - /description: Annual Report.docx`;
/* end snapshot vaadin-upload disabled */

snapshots["vaadin-upload no drop"] = 
`- button "Upload Files..."`;
/* end snapshot vaadin-upload no drop */

snapshots["upload components with manager default"] = 
`- button "Add files"
- text: or drop files here`;
/* end snapshot upload components with manager default */

snapshots["upload components with manager files"] = 
`- button "Add files"
- text: or drop files here
- generic:
  - text: Report.pdf
  - text: Queued
  - button "Start":
    - /description: Report.pdf
  - button "Remove":
    - /description: Report.pdf`;
/* end snapshot upload components with manager files */

snapshots["upload components with manager no manager"] = 
`- button "Add files" [disabled]
- text: or drop files here`;
/* end snapshot upload components with manager no manager */

