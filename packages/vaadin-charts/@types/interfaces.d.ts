import { PointOptionsObject, SeriesOptionsType } from 'highcharts';

export type ChartCategories = Array<string> | { [key: number]: string };

export type ChartCategoryPosition = 'left' | 'right' | 'top' | 'bottom';

export type ChartSeriesMarkers = 'shown' | 'hidden' | 'auto';

export interface ChartSeriesConfig {
  data?: ChartSeriesValues;
  marker?: { enabled: boolean | null }
  name?: string;
  neckWidth?: number | string;
  neckHeight?: number | string;
  stack?: number | string;
  type?: string;
  yAxis?: string;
  yAxisValueMin?: number;
  yAxisValueMax?: number;
}

export type ChartSeriesOptions = ChartSeriesConfig & SeriesOptionsType;

export type ChartSeriesValues = Array<number|Array<number>|PointOptionsObject>;

export type ChartStacking = 'normal' | 'percent' | null;
