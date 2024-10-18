/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing } from 'lit';
import { Directive, directive, PartType } from 'lit/directive.js';
import { OverlayPositionManager } from './vaadin-overlay-position-manager.js';

export class OverlayPositionDirective extends Directive {
  constructor(part) {
    super(part);

    if (part.type !== PartType.ELEMENT) {
      throw new Error(`\`${this.constructor.name}\` must be bound to an element.`);
    }

    this._manager = new OverlayPositionManager(part.element, part.options.host);
  }

  /** @override */
  render() {
    return nothing;
  }

  /** @override */
  update(
    _part,
    [opened, target, noHorizontalOverlap, noVerticalOverlap, horizontalAlign, verticalAlign, requiredVerticalSpace],
  ) {
    this._manager.setState({
      opened,
      target,
      noHorizontalOverlap,
      noVerticalOverlap,
      horizontalAlign,
      verticalAlign,
      requiredVerticalSpace,
    });

    return nothing;
  }
}

export const overlayPosition = directive(OverlayPositionDirective);
