/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-menu-bar default"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu, expanded=false]
  - menuitem "Reports" [disabled]
  - menuitem "Help"`;
/* end snapshot vaadin-menu-bar default */

snapshots["vaadin-menu-bar sub-menu opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu, expanded]
  - menuitem "Reports" [disabled]
  - menuitem "Help"
  - group:
    - menu [orientation=vertical]:
      - menuitem "Grid"
      - menuitem "List"
      - separator [orientation=horizontal]
      - menuitem "Sort" [haspopup=menu, expanded=false]`;
/* end snapshot vaadin-menu-bar sub-menu opened */

snapshots["vaadin-menu-bar nested sub-menu opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu, expanded]
  - menuitem "Reports" [disabled]
  - menuitem "Help"
  - group:
    - menu [orientation=vertical]:
      - menuitem "Grid"
      - menuitem "List"
      - separator [orientation=horizontal]
      - menuitem "Sort" [haspopup=menu, expanded]
    - group:
      - menu [orientation=vertical]:
        - menuitem "By name"
        - menuitem "By date"`;
/* end snapshot vaadin-menu-bar nested sub-menu opened */

snapshots["vaadin-menu-bar tab navigation"] = 
`- group "Main":
  - button "Home"
  - button "View" [haspopup=menu, expanded=false]
  - button "Reports" [disabled]
  - button "Help"`;
/* end snapshot vaadin-menu-bar tab navigation */

snapshots["vaadin-menu-bar overflow"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu, expanded=false]
  - menuitem "More options" [haspopup=menu, expanded=false]`;
/* end snapshot vaadin-menu-bar overflow */

snapshots["vaadin-menu-bar overflow opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu, expanded=false]
  - menuitem "More options" [haspopup=menu, expanded]
  - group:
    - menu [orientation=vertical]:
      - menuitem "Reports" [disabled]
      - menuitem "Help"`;
/* end snapshot vaadin-menu-bar overflow opened */

