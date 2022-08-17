/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

// Find a property definition from the prototype chain of a Polymer element class
function getPropertyFromPrototype(proto, prop) {
  while (proto) {
    if (proto.properties && proto.properties[prop]) {
      return proto.properties[prop];
    }
    proto = Object.getPrototypeOf(proto);
  }
}

function getDefaultProperty(prop) {
  // Restore default value for cooldown
  const Tooltip = customElements.get('vaadin-tooltip');
  return getPropertyFromPrototype(Tooltip, prop).value();
}

/**
 * A controller that manages the slotted tooltip element.
 */
export class TooltipController extends SlotController {
  constructor(host) {
    // Do not provide slot factory to create tooltip lazily.
    super(host, 'tooltip');
  }

  /**
   * Override to initialize the newly added custom tooltip.
   *
   * @param {Node} tooltipNode
   * @protected
   * @override
   */
  initCustomNode(tooltipNode) {
    tooltipNode.target = this.target;
    tooltipNode.manual = this.manual;
    tooltipNode.opened = this.opened;

    if (this.cooldown !== undefined) {
      tooltipNode.cooldown = this.cooldown;
    }

    if (this.delay !== undefined) {
      tooltipNode.delay = this.cooldown;
    }

    if (this.position !== undefined) {
      tooltipNode.position = this.position;
    }
  }

  /**
   * Override to cleanup tooltip node when it's removed.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    const tooltipNode = this.getSlotChild();

    if (this.__isDefaultTooltip(tooltipNode)) {
      // Restore default tooltip if a custom one was removed.
      this.__applyDefaultTooltip(this.tooltipText, tooltipNode);
    }
  }

  /**
   * Set the delay in milliseconds before the tooltip
   * is closed, when not using manual mode.
   * @param {number} cooldown
   */
  setCooldown(cooldown) {
    // When an invalid value is provided, fall back to the default one configured on the class.
    this.cooldown = cooldown != null && cooldown >= 0 ? cooldown : getDefaultProperty('cooldown');

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.cooldown = this.cooldown;
    }
  }

  /**
   * Set the delay in milliseconds before the tooltip
   * is opened, when not using manual mode.
   * @param {number} delay
   */
  setDelay(delay) {
    // When an invalid value is provided, fall back to the default one configured on the class.
    this.delay = delay != null && delay >= 0 ? delay : getDefaultProperty('delay');

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.delay = this.delay;
    }
  }

  /**
   * Toggle manual mode for the tooltip.
   * @param {boolean} manual
   */
  setManual(manual) {
    this.manual = manual;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.manual = manual;
    }
  }

  /**
   * Toggle opened state for the tooltip.
   * @param {boolean} opened
   */
  setOpened(opened) {
    this.opened = opened;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.opened = opened;
    }
  }

  /**
   * Set position for the tooltip.
   * @param {string} position
   */
  setPosition(position) {
    this.position = position;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.position = position;
    }
  }

  /**
   * Set an HTML element to attach the tooltip to.
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.target = target;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.target = target;
    }
  }

  /**
   * Set tooltip text based on corresponding host property.
   * @param {string} tooltipText
   */
  setTooltipText(tooltipText) {
    this.tooltipText = tooltipText;

    const tooltipNode = this.getSlotChild();
    if (this.__isDefaultTooltip(tooltipNode)) {
      this.__applyDefaultTooltip(tooltipText, tooltipNode);
    }
  }

  /** @private */
  __isDefaultTooltip(tooltipNode) {
    return !tooltipNode || tooltipNode === this.defaultNode;
  }

  /**
   * @param {string} helperText
   * @private
   */
  __isNotEmpty(helperText) {
    return Boolean(helperText && helperText.trim() !== '');
  }

  /**
   * @param {string} tooltipText
   * @param {Node} tooltipNode
   * @private
   */
  __applyDefaultTooltip(tooltipText, tooltipNode) {
    const hasTooltipText = this.__isNotEmpty(tooltipText);

    if (hasTooltipText) {
      if (!tooltipNode) {
        // Set slot factory lazily to only create tooltip node when needed.
        this.slotFactory = () => document.createElement('vaadin-tooltip');

        tooltipNode = this.attachDefaultNode();
      }
    } else if (tooltipNode) {
      // Tooltip text is cleared, detach listeners.
      this.setTarget(null);
      this.host.removeChild(tooltipNode);
    }

    if (tooltipNode) {
      tooltipNode.text = tooltipText;
      tooltipNode.manual = this.manual;
      tooltipNode.opened = this.opened;
      tooltipNode.target = this.target;

      if (this.cooldown !== undefined) {
        tooltipNode.cooldown = this.cooldown;
      }

      if (this.delay !== undefined) {
        tooltipNode.delay = this.cooldown;
      }

      if (this.position !== undefined) {
        tooltipNode.position = this.position;
      }
    }
  }
}
