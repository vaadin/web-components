import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-board>` is a web component to create flexible responsive layouts
 * and build nice looking dashboards.
 *
 * A `<vaadin-board>` is built using `<vaadin-board-row>` elements containing your child elements.
 * Each board row consists of four columns, and can contain up to four elements. Using column spans
 * you can tune the layout to your liking.
 *
 * ```html
 * <vaadin-board>
 *   <vaadin-board-row>
 *     <div>This could be chart 1</div>
 *     <div>This could be chart 2</div>
 *     <div>This could be chart 3</div>
 *     <div>This could be chart 4</div>
 *   </vaadin-board-row>
 * </vaadin-board>
 * ```
 */
declare class BoardElement extends ElementMixin(HTMLElement) {
  static _finalizeClass(): void;

  /**
   * Redraws the board and all rows inside it, if necessary.
   *
   * In most cases, board will redraw itself if your reconfigure it. If you dynamically change CSS
   * which affects this element, then you need to call this method.
   */
  redraw(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-board': BoardElement;
  }
}

export { BoardElement };
