/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav default"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - link "Inbox"
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav default */

snapshots["vaadin-side-nav collapsible"] = 
`- navigation "Main menu":
  - button "Main menu" [expanded]:
    - /controls: list
  - list:
    - listitem [level=1]:
      - link "Inbox"
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav collapsible */

snapshots["vaadin-side-nav collapsed"] = 
`- navigation "Main menu":
  - button "Main menu" [expanded=false]`;
/* end snapshot vaadin-side-nav collapsed */

snapshots["vaadin-side-nav no label"] = 
`- navigation:
  - list:
    - listitem [level=1]:
      - link "Inbox"
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav no label */

snapshots["vaadin-side-nav current item"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - link "Home"
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav current item */

snapshots["vaadin-side-nav disabled item"] = 
`- navigation "Main menu":
  - list:
    - listitem [disabled, level=1]: Inbox
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav disabled item */

snapshots["vaadin-side-nav item without path"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]: Inbox
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav item without path */

snapshots["vaadin-side-nav prefix and suffix"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - link "Inbox 12":
        - text: Inbox
        - text: "12"
    - listitem [level=1]:
      - link "Sent"`;
/* end snapshot vaadin-side-nav prefix and suffix */

snapshots["vaadin-side-nav nested items collapsed"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - link "Messages"
      - button "Messages Toggle child items" [expanded=false]`;
/* end snapshot vaadin-side-nav nested items collapsed */

snapshots["vaadin-side-nav nested items expanded"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - link "Messages"
      - button "Messages Toggle child items" [expanded]:
        - /controls: list
      - list:
        - listitem [level=2]:
          - link "Inbox"
        - listitem [level=2]:
          - link "Sent"`;
/* end snapshot vaadin-side-nav nested items expanded */

snapshots["vaadin-side-nav nested items parent without path"] = 
`- navigation "Main menu":
  - list:
    - listitem [level=1]:
      - text: Messages
      - button "Messages Toggle child items" [expanded]:
        - /controls: list
      - list:
        - listitem [level=2]:
          - link "Inbox"
        - listitem [level=2]:
          - link "Sent"`;
/* end snapshot vaadin-side-nav nested items parent without path */

