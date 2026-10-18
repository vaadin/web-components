/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs default"] = 
`- navigation:
  - list:
    - listitem [level=1]:
      - link "Home"
    - listitem [level=1]:
      - link "Documents"
    - listitem [level=1]:
      - link "Projects"
    - listitem [level=1]: Summary report`;
/* end snapshot vaadin-breadcrumbs default */

snapshots["vaadin-breadcrumbs overflow"] = 
`- navigation:
  - list:
    - listitem [level=1]:
      - button "More items" [haspopup=menu, expanded=false]
    - listitem [level=1]: Summary report`;
/* end snapshot vaadin-breadcrumbs overflow */

snapshots["vaadin-breadcrumbs overflow opened"] = 
`- navigation:
  - list:
    - listitem [level=1]:
      - button "More items" [haspopup=menu, expanded]
    - listitem [level=1]: Summary report
  - group:
    - list:
      - listitem [level=1]:
        - link "Home"
      - listitem [level=1]:
        - link "Documents"
      - listitem [level=1]:
        - link "Projects"`;
/* end snapshot vaadin-breadcrumbs overflow opened */

