/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-avatar-group default"] = 
`- image "PM":
  - /description: PM
- image "YY":
  - /description: Yuriy Yevstihnyeyev
- image "SK":
  - /description: Serhii Kulykov
- image "JJ":
  - /description: Jens Jansson`;
/* end snapshot vaadin-avatar-group default */

snapshots["vaadin-avatar-group overflow"] = 
`- image "PM":
  - /description: PM
- button "+3" [haspopup=menu]:
  - /description: Yuriy Yevstihnyeyev Serhii Kulykov Jens Jansson`;
/* end snapshot vaadin-avatar-group overflow */

snapshots["vaadin-avatar-group overflow opened"] = 
`- image "PM":
  - /description: PM
- button "+3" [expanded, haspopup=menu]:
  - /description: Yuriy Yevstihnyeyev Serhii Kulykov Jens Jansson
- menu [orientation=vertical]:
  - menuitem "Yuriy Yevstihnyeyev" [focused]
  - menuitem "Serhii Kulykov"
  - menuitem "Jens Jansson"`;
/* end snapshot vaadin-avatar-group overflow opened */

snapshots["vaadin-avatar-group overflow by width"] = 
`- image "PM":
  - /description: PM
- image "YY":
  - /description: Yuriy Yevstihnyeyev
- button "+2" [haspopup=menu]:
  - /description: Serhii Kulykov Jens Jansson`;
/* end snapshot vaadin-avatar-group overflow by width */

