/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-time-picker default"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog]
- combobox "Meeting" [autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker default */

snapshots["vaadin-date-time-picker value"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog]: "2/15/2020"
- combobox "Meeting" [autocomplete=list, haspopup=listbox]: "10:30"`;
/* end snapshot vaadin-date-time-picker value */

snapshots["vaadin-date-time-picker placeholder"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog]
- combobox "Meeting" [autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker placeholder */

snapshots["vaadin-date-time-picker date and time labels"] = 
`- text: Meeting
- combobox "Meeting Date" [haspopup=dialog]
- combobox "Meeting Time" [autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker date and time labels */

snapshots["vaadin-date-time-picker disabled"] = 
`- text: Meeting
- combobox "Meeting" [disabled, haspopup=dialog]
- combobox "Meeting" [disabled, autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker disabled */

snapshots["vaadin-date-time-picker readonly"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog]
- combobox "Meeting" [autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker readonly */

snapshots["vaadin-date-time-picker required"] = 
`- text: Meeting
- combobox "Meeting" [required, haspopup=dialog]
- combobox "Meeting" [required, autocomplete=list, haspopup=listbox]`;
/* end snapshot vaadin-date-time-picker required */

snapshots["vaadin-date-time-picker helper"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog]
- combobox "Meeting" [autocomplete=list, haspopup=listbox]
- text: Pick a date and time`;
/* end snapshot vaadin-date-time-picker helper */

snapshots["vaadin-date-time-picker error"] = 
`- text: Meeting
- combobox "Meeting" [haspopup=dialog, invalid]
- combobox "Meeting" [autocomplete=list, haspopup=listbox, invalid]
- text: Error message`;
/* end snapshot vaadin-date-time-picker error */

