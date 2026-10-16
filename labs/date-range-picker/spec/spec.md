# Date Range Picker specification

## Summary

Date Range Picker is a field that lets the user select a start date and an end date in 1 calendar.

## Prototype

| Item             | Link                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| Feature request  | https://github.com/vaadin/web-components/issues/1946                            |
| Web component PR | https://github.com/vaadin/web-components/pull/13053                             |
| Use-case app     | https://github.com/vaadin/use-cases/pull/391                                    |
| API gaps         | `date-range-picker/API-GAPS.md` in https://github.com/vaadin/use-cases/pull/391 |

### Prototype results

{Fill in when the labs component reaches the first use case.}

## Problem

Users often select a period, for example a hotel stay, a vacation or the period of a report.
Today the developer puts 2 Date Pickers next to each other.
The 2 calendars do not show the range, and the developer writes the rules between the 2 fields.
For example, the developer must make sure that the end date is not before the start date.

## Use cases

### UC1: Book a stay

A guest wants to select the nights of a hotel stay, so that the hotel can reserve a room.

_Example: A guest opens the reservation page of a hotel. The calendar shows the booked nights as not available. The guest selects 12 May as the check-in date and 15 May as the check-out date. The page shows "3 nights"._

### UC2: Filter by period

An analyst wants to see the orders of a period, so that the analyst can compare the sales of 2 months.

_Example: An analyst opens the order list. The analyst selects 1 September as the start date and 30 September as the end date. The list shows only the orders of September. The analyst can also give only a start date to see all orders since that date._

### UC3: Request time off

An employee wants to request a vacation, so that the manager can approve it.

_Example: An employee opens the time-off form. The employee selects 3 August as the first day and 14 August as the last day. The form shows "10 working days". When the employee does not select dates, the form shows an error and does not send the request._

### UC4: Change the return date

A customer wants to extend a car rental, so that the customer can keep the car longer.

_Example: A customer opens a rental that started on 2 June. The start date is fixed. The customer changes the return date from 6 June to 9 June._

### UC5: Show dates in the user's format

A user wants to type and read dates in the format of the user's country, so that the user does not make mistakes.

_Example: A user in Germany opens a booking form. The field shows the range as "12.05.2026 – 15.05.2026". The calendar starts the week on Monday and shows the month names in German._

### UC6: Show the range in 1 field

A user on a phone wants to filter a list from a narrow toolbar, so that the list stays visible.

_Example: A user opens a list of deliveries on a phone. The toolbar has 1 input for the period. The user types "1.9.2026 – 30.9.2026" or selects the dates in the calendar._

## Scope

### Use other components for

- **Date Picker**: When the user selects 1 date, use it.
- **2 Date Pickers**: When the start date and the end date are far apart or are separate data, use them. {To confirm.}

### Out of scope

{Fill in as we build.}

### Later enhancements

{Fill in as we build.}

## Terms

| Term        | Meaning                                                   |
| ----------- | --------------------------------------------------------- |
| user        | The person who uses the application.                      |
| developer   | The person who builds the application with the component. |
| application | The software that the developer builds and the user uses. |
| start date  | The first date of the range.                              |
| end date    | The last date of the range.                               |
| range       | The start date, the end date and the dates between them.  |

## Acceptance criteria

### 1. Deliverables

- [x] **AC-1.1**: The web component `vaadin-date-range-picker` is available in the `@vaadin/labs` package.
- [ ] **AC-1.2**: The Flow component `DateRangePicker` is available. {Module to decide.}
- [ ] **AC-1.4**: The component has styles for the Lumo theme and the Aura theme.
- [x] **AC-1.5**: The component is available under the Apache License 2.0.
- [x] **AC-1.6**: The component is available behind the `dateRangePickerComponent` feature flag.

## General criteria

- [ ] **API review**: {Link to the API review}
- [ ] **Design**: {Link to the Figma file or to the design issue}
- [ ] **Documentation**: {Link to the documentation PR}

## Security

- [ ] **Security implications**: {Describe the implications. When there are none, write "None".}

## Discussion

**Q: Where does the component start?**

The component starts in `labs/date-range-picker/`, not in `packages/date-picker/`. Labs lets the API change without a deprecation cycle until the component graduates.

**Q: What is the tag name?**

The tag name is `vaadin-date-range-picker`. The feature request and the prototype use the same name.
