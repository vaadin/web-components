/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-menu-bar default"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu]
  - menuitem "Reports" [disabled]
  - menuitem "Help"`;
/* end snapshot vaadin-menu-bar default */

snapshots["vaadin-menu-bar sub-menu opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [expanded, haspopup=menu]
  - menuitem "Reports" [disabled]
  - menuitem "Help"
  - generic:
    - menu [orientation=vertical]:
      - menuitem "Grid" [focused]
      - menuitem "List"
      - menuitem "Sort" [haspopup=menu]`;
/* end snapshot vaadin-menu-bar sub-menu opened */

snapshots["vaadin-menu-bar nested sub-menu opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [expanded, haspopup=menu]
  - menuitem "Reports" [disabled]
  - menuitem "Help"
  - generic:
    - menu [orientation=vertical]:
      - menuitem "Grid"
      - menuitem "List"
      - menuitem "Sort" [expanded, haspopup=menu]
    - generic [focused]:
      - menu [orientation=vertical]:
        - menuitem "By name"
        - menuitem "By date"`;
/* end snapshot vaadin-menu-bar nested sub-menu opened */

snapshots["vaadin-menu-bar tab navigation"] = 
`- button "Home"
- button "View" [haspopup=menu]
- button "Reports" [disabled]
- button "Help"`;
/* end snapshot vaadin-menu-bar tab navigation */

snapshots["vaadin-menu-bar overflow"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu]
  - menuitem "More options" [haspopup=menu]`;
/* end snapshot vaadin-menu-bar overflow */

snapshots["vaadin-menu-bar overflow opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Home"
  - menuitem "View" [haspopup=menu]
  - menuitem "More options" [expanded, haspopup=menu]
  - generic:
    - menu [orientation=vertical]:
      - menuitem "Reports" [disabled]
      - menuitem "Help" [focused]`;
/* end snapshot vaadin-menu-bar overflow opened */

