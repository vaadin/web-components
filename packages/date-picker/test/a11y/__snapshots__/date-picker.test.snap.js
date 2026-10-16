/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-picker default"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded=false]`;
/* end snapshot vaadin-date-picker default */

snapshots["vaadin-date-picker value"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded=false]: "2/15/2020"`;
/* end snapshot vaadin-date-picker value */

snapshots["vaadin-date-picker placeholder"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded=false]`;
/* end snapshot vaadin-date-picker placeholder */

snapshots["vaadin-date-picker disabled"] = 
`- text: Start date
- combobox "Start date" [disabled, haspopup=dialog, expanded=false]`;
/* end snapshot vaadin-date-picker disabled */

snapshots["vaadin-date-picker readonly"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded=false]`;
/* end snapshot vaadin-date-picker readonly */

snapshots["vaadin-date-picker required"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, required, expanded=false]`;
/* end snapshot vaadin-date-picker required */

snapshots["vaadin-date-picker helper"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded=false]:
  - /description: "Format: DD/MM/YYYY"
- text: "Format: DD/MM/YYYY"`;
/* end snapshot vaadin-date-picker helper */

snapshots["vaadin-date-picker error"] = 
`- text: Start date
- combobox "Start date" [invalid, haspopup=dialog, expanded=false]:
  - /description: Error message
- text: Error message`;
/* end snapshot vaadin-date-picker error */

snapshots["vaadin-date-picker opened"] = 
`- text: Start date
- combobox "Start date" [haspopup=dialog, expanded]: "2/15/2020"
- group:
  - dialog "Calendar":
    - grid "February 2020":
      - rowgroup:
        - row
      - row "1 February 2020, Saturday":
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell
        - gridcell "1 February 2020, Saturday": "1"
      - row "2 February 2020, Sunday 3 February 2020, Monday 4 February 2020, Tuesday 5 February 2020, Wednesday 6 February 2020, Thursday 7 February 2020, Friday 8 February 2020, Saturday":
        - gridcell "2 February 2020, Sunday": "2"
        - gridcell "3 February 2020, Monday": "3"
        - gridcell "4 February 2020, Tuesday": "4"
        - gridcell "5 February 2020, Wednesday": "5"
        - gridcell "6 February 2020, Thursday": "6"
        - gridcell "7 February 2020, Friday": "7"
        - gridcell "8 February 2020, Saturday": "8"
      - row "9 February 2020, Sunday 10 February 2020, Monday 11 February 2020, Tuesday 12 February 2020, Wednesday 13 February 2020, Thursday 14 February 2020, Friday 15 February 2020, Saturday":
        - gridcell "9 February 2020, Sunday": "9"
        - gridcell "10 February 2020, Monday": "10"
        - gridcell "11 February 2020, Tuesday": "11"
        - gridcell "12 February 2020, Wednesday": "12"
        - gridcell "13 February 2020, Thursday": "13"
        - gridcell "14 February 2020, Friday": "14"
        - gridcell "15 February 2020, Saturday" [selected]: "15"
      - row "16 February 2020, Sunday 17 February 2020, Monday 18 February 2020, Tuesday 19 February 2020, Wednesday 20 February 2020, Thursday 21 February 2020, Friday 22 February 2020, Saturday":
        - gridcell "16 February 2020, Sunday": "16"
        - gridcell "17 February 2020, Monday": "17"
        - gridcell "18 February 2020, Tuesday": "18"
        - gridcell "19 February 2020, Wednesday": "19"
        - gridcell "20 February 2020, Thursday": "20"
        - gridcell "21 February 2020, Friday": "21"
        - gridcell "22 February 2020, Saturday": "22"
      - row "23 February 2020, Sunday 24 February 2020, Monday 25 February 2020, Tuesday 26 February 2020, Wednesday 27 February 2020, Thursday 28 February 2020, Friday 29 February 2020, Saturday":
        - gridcell "23 February 2020, Sunday": "23"
        - gridcell "24 February 2020, Monday": "24"
        - gridcell "25 February 2020, Tuesday": "25"
        - gridcell "26 February 2020, Wednesday": "26"
        - gridcell "27 February 2020, Thursday": "27"
        - gridcell "28 February 2020, Friday": "28"
        - gridcell "29 February 2020, Saturday": "29"
    - toolbar [orientation=horizontal]:
      - button "Today"
      - button "Cancel"`;
/* end snapshot vaadin-date-picker opened */

