/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-picker default"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog]`;
/* end snapshot vaadin-date-picker default */

snapshots["vaadin-date-picker value"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog]: "2/15/2020"`;
/* end snapshot vaadin-date-picker value */

snapshots["vaadin-date-picker placeholder"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog]`;
/* end snapshot vaadin-date-picker placeholder */

snapshots["vaadin-date-picker disabled"] = 
`- text: Start date
- combobox "Start date" [disabled, haspopup=dialog]`;
/* end snapshot vaadin-date-picker disabled */

snapshots["vaadin-date-picker readonly"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog]`;
/* end snapshot vaadin-date-picker readonly */

snapshots["vaadin-date-picker required"] = 
`- text: Start date
- combobox "Start date" [required, haspopup=dialog]`;
/* end snapshot vaadin-date-picker required */

snapshots["vaadin-date-picker helper"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog]:
  - /description: "Format: DD/MM/YYYY"
- text: "Format: DD/MM/YYYY"`;
/* end snapshot vaadin-date-picker helper */

snapshots["vaadin-date-picker error"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, invalid]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-date-picker error */

snapshots["vaadin-date-picker opened"] = 
`- text: Start date
- combobox "Start date" [expanded, focused, haspopup=dialog]: "2/15/2020"
- generic:
  - button "1 February 2020, Saturday"
  - button "2 February 2020, Sunday"
  - button "3 February 2020, Monday"
  - button "4 February 2020, Tuesday"
  - button "5 February 2020, Wednesday"
  - button "6 February 2020, Thursday"
  - button "7 February 2020, Friday"
  - button "8 February 2020, Saturday"
  - button "9 February 2020, Sunday"
  - button "10 February 2020, Monday"
  - button "11 February 2020, Tuesday"
  - button "12 February 2020, Wednesday"
  - button "13 February 2020, Thursday"
  - button "14 February 2020, Friday"
  - button "15 February 2020, Saturday"
  - button "16 February 2020, Sunday"
  - button "17 February 2020, Monday"
  - button "18 February 2020, Tuesday"
  - button "19 February 2020, Wednesday"
  - button "20 February 2020, Thursday"
  - button "21 February 2020, Friday"
  - button "22 February 2020, Saturday"
  - button "23 February 2020, Sunday"
  - button "24 February 2020, Monday"
  - button "25 February 2020, Tuesday"
  - button "26 February 2020, Wednesday"
  - button "27 February 2020, Thursday"
  - button "28 February 2020, Friday"
  - button "29 February 2020, Saturday"
- button "Today"
- button "Cancel"`;
/* end snapshot vaadin-date-picker opened */

