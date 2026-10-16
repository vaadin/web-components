/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload default"] = 
`- button "Upload Files..."
- list`;
/* end snapshot vaadin-upload default */

snapshots["vaadin-upload files"] = 
`- button "Upload Files..."
- list:
  - listitem [level=1]:
    - text: Annual Report.docx
    - button "Remove":
      - /description: Annual Report.docx
  - listitem [level=1]:
    - text: "Workflow.pdf 19.7 MB: 60% (remaining time: 00:12:34)"
    - button "Remove":
      - /description: Workflow.pdf
    - progressbar [valuemin=0, valuemax=1]: "0.6000000238418579"
  - listitem [level=1]:
    - text: Financials.xlsx An error occurred
    - button "Retry":
      - /description: Financials.xlsx
    - button "Remove":
      - /description: Financials.xlsx
  - listitem [level=1]:
    - text: Notes.txt Queued
    - button "Start":
      - /description: Notes.txt
    - button "Remove":
      - /description: Notes.txt
    - progressbar [valuemin=0, valuemax=1]: "0"`;
/* end snapshot vaadin-upload files */

snapshots["vaadin-upload max files reached"] = 
`- button "Upload File..." [disabled]
- list:
  - listitem [level=1]:
    - text: Annual Report.docx
    - button "Remove":
      - /description: Annual Report.docx`;
/* end snapshot vaadin-upload max files reached */

snapshots["vaadin-upload disabled"] = 
`- button "Upload Files..." [disabled]
- list:
  - listitem [level=1]:
    - text: Annual Report.docx
    - button "Remove" [disabled]:
      - /description: Annual Report.docx`;
/* end snapshot vaadin-upload disabled */

snapshots["vaadin-upload no drop"] = 
`- button "Upload Files..."
- list`;
/* end snapshot vaadin-upload no drop */

snapshots["upload components with manager default"] = 
`- button "Add files"
- text: or drop files here
- list`;
/* end snapshot upload components with manager default */

snapshots["upload components with manager files"] = 
`- button "Add files"
- text: or drop files here
- list:
  - listitem [level=1]:
    - text: Report.pdf Queued
    - button "Start":
      - /description: Report.pdf
    - button "Remove":
      - /description: Report.pdf
    - progressbar [valuemin=0, valuemax=1]: "0"`;
/* end snapshot upload components with manager files */

snapshots["upload components with manager no manager"] = 
`- button "Add files" [disabled]
- text: or drop files here
- list`;
/* end snapshot upload components with manager no manager */

