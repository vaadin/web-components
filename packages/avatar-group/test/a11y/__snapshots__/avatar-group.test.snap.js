/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-avatar-group default"] = 
`- generic "Currently 4 active users":
  - image "PM":
    - /description: PM
  - image "YY":
    - /description: Yuriy Yevstihnyeyev
  - image "SK":
    - /description: Serhii Kulykov
  - image "JJ":
    - /description: Jens Jansson`;
/* end snapshot vaadin-avatar-group default */

snapshots["vaadin-avatar-group overflow"] = 
`- generic "Currently 4 active users":
  - image "PM":
    - /description: PM
  - button "+3" [haspopup=menu, expanded=false]:
    - /description: Yuriy Yevstihnyeyev Serhii Kulykov Jens Jansson`;
/* end snapshot vaadin-avatar-group overflow */

snapshots["vaadin-avatar-group overflow opened"] = 
`- generic "Currently 4 active users":
  - image "PM":
    - /description: PM
  - button "+3" [haspopup=menu, expanded]:
    - /description: Yuriy Yevstihnyeyev Serhii Kulykov Jens Jansson
  - group:
    - menu [orientation=vertical]:
      - menuitem "Yuriy Yevstihnyeyev"
      - menuitem "Serhii Kulykov"
      - menuitem "Jens Jansson"`;
/* end snapshot vaadin-avatar-group overflow opened */

snapshots["vaadin-avatar-group overflow by width"] = 
`- generic "Currently 4 active users":
  - image "PM":
    - /description: PM
  - image "YY":
    - /description: Yuriy Yevstihnyeyev
  - button "+2" [haspopup=menu, expanded=false]:
    - /description: Serhii Kulykov Jens Jansson`;
/* end snapshot vaadin-avatar-group overflow by width */

