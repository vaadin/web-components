/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

type Props = {
  columnWidth?: string;
  maxColumns?: number;
  autoRows?: boolean;
  labelsAside?: boolean;
  expandColumns?: boolean;
};

/**
 * A controller that implements the auto-responsive layout algorithm.
 */
export class AutoResponsiveController implements ReactiveController {
  /**
   * The controller's host element.
   */
  host: HTMLElement;

  /**
   * The controller's properties.
   */
  props: Props;

  /**
   * Connects the controller to the host element.
   */
  connect(): void;

  /**
   * Disconnects the controller from the host element.
   */
  disconnect(): void;

  /**
   * Sets the controller's properties and updates the layout.
   */
  setProps(props: Props): void;

  /**
   * Updates the layout based on the current properties.
   */
  updateLayout(): void;
}
