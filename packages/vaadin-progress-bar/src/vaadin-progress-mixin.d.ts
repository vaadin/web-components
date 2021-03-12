declare function ProgressMixin<T extends new (...args: any[]) => {}>(base: T): T & ProgressMixinConstructor;

interface ProgressMixinConstructor {
  new (...args: any[]): ProgressMixin;
}

interface ProgressMixin {
  /**
   * Current progress value.
   */
  value: number | null | undefined;

  /**
   * Minimum bound of the progress bar.
   */
  min: number;

  /**
   * Maximum bound of the progress bar.
   */
  max: number;

  /**
   * Indeterminate state of the progress bar.
   * This property takes precedence over other state properties (min, max, value).
   */
  indeterminate: boolean;
}

export { ProgressMixin, ProgressMixinConstructor };
