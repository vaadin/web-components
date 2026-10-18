/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-list-box single"] = 
`- listbox "Size" [orientation=vertical]:
  - option "Small"
  - option "Medium" [selected]
  - option "Large" [disabled]`;
/* end snapshot vaadin-list-box single */

snapshots["vaadin-list-box multiple"] = 
`- listbox "Size" [multiselectable, orientation=vertical]:
  - option "Small" [selected]
  - option "Medium" [selected]
  - option "Large" [disabled]`;
/* end snapshot vaadin-list-box multiple */

