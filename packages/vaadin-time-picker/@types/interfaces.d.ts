export interface TimePickerTime {
  hours: string | number;
  minutes: string | number;
  seconds?: string | number;
  milliseconds?: string | number;
}

export interface TimePickerI18n {
  parseTime: (time: string) => TimePickerTime | undefined;
  formatTime: (time: TimePickerTime) => string;
  clear: string;
  selector: string;
}
