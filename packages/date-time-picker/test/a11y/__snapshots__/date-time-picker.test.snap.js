/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-time-picker default"] = 
`- group "Meeting":
  - combobox "Meeting" [haspopup=dialog, expanded=false]
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-date-time-picker default */

snapshots["vaadin-date-time-picker value"] = 
`- group "Meeting":
  - combobox "Meeting" [haspopup=dialog, expanded=false]: "2/15/2020"
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, expanded=false]: "10:30"`;
/* end snapshot vaadin-date-time-picker value */

snapshots["vaadin-date-time-picker placeholder"] = 
`- group "Meeting":
  - combobox "Meeting" [haspopup=dialog, expanded=false]
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-date-time-picker placeholder */

snapshots["vaadin-date-time-picker disabled"] = 
`- group "Meeting" [disabled]:
  - combobox "Meeting" [disabled, haspopup=dialog, expanded=false]
  - combobox "Meeting" [disabled, autocomplete=list, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-date-time-picker disabled */

snapshots["vaadin-date-time-picker readonly"] = 
`- group "Meeting":
  - combobox "Meeting" [haspopup=dialog, expanded=false]
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-date-time-picker readonly */

snapshots["vaadin-date-time-picker required"] = 
`- group "Meeting":
  - combobox "Meeting" [haspopup=dialog, required, expanded=false]
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, required, expanded=false]`;
/* end snapshot vaadin-date-time-picker required */

snapshots["vaadin-date-time-picker helper"] = 
`- group "Meeting":
  - /description: Pick a date and time
  - combobox "Meeting" [haspopup=dialog, expanded=false]
  - combobox "Meeting" [autocomplete=list, haspopup=listbox, expanded=false]
  - text: Pick a date and time`;
/* end snapshot vaadin-date-time-picker helper */

snapshots["vaadin-date-time-picker error"] = 
`- group "Meeting":
  - /description: Error message
  - combobox "Meeting" [invalid, haspopup=dialog, expanded=false]
  - combobox "Meeting" [invalid, autocomplete=list, haspopup=listbox, expanded=false]
  - text: Error message`;
/* end snapshot vaadin-date-time-picker error */

snapshots["vaadin-date-time-picker date and time labels"] = 
`- group "Meeting":
  - combobox "Meeting Date" [haspopup=dialog, expanded=false]
  - combobox "Meeting Time" [autocomplete=list, haspopup=listbox, expanded=false]`;
/* end snapshot vaadin-date-time-picker date and time labels */

