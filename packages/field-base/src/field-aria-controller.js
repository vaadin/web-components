/**
 * A controller for managing ARIA attributes for a field element:
 * either the component itself or slotted `<input>` element.
 */
export class FieldAriaController {
  constructor(host) {
    this.host = host;
    this.__required = false;
  }

  /**
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.__target = target;
    this.__setAriaRequiredAttribute(this.__required);
    this.__setLabelIdToAriaAttribute(this.__labelId);
    this.__setErrorIdToAriaAttribute(this.__errorId);
    this.__setHelperIdToAriaAttribute(this.__helperId);
  }

  /**
   * @param {boolean} required
   */
  setRequired(required) {
    this.__setAriaRequiredAttribute(required);
    this.__required = required;
  }

  /**
   * @param {string | null} labelId
   */
  setLabelId(labelId) {
    this.__setLabelIdToAriaAttribute(labelId, this.__labelId);
    this.__labelId = labelId;
  }

  /**
   * @param {string | null} errorId
   */
  setErrorId(errorId) {
    this.__setErrorIdToAriaAttribute(errorId, this.__errorId);
    this.__errorId = errorId;
  }

  /**
   * @param {string | null} helperId
   */
  setHelperId(helperId) {
    this.__setHelperIdToAriaAttribute(helperId, this.__helperId);
    this.__helperId = helperId;
  }

  /**
   * @return {boolean}
   * @private
   */
  get __isGroupField() {
    return this.__target === this.host;
  }

  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @private
   */
  __setLabelIdToAriaAttribute(labelId, oldLabelId) {
    this.__setAriaAttributeId('aria-labelledby', labelId, oldLabelId);
  }

  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   * @private
   */
  __setErrorIdToAriaAttribute(errorId, oldErrorId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', errorId, oldErrorId);
    } else {
      this.__setAriaAttributeId('aria-describedby', errorId, oldErrorId);
    }
  }

  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   * @private
   */
  __setHelperIdToAriaAttribute(helperId, oldHelperId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', helperId, oldHelperId);
    } else {
      this.__setAriaAttributeId('aria-describedby', helperId, oldHelperId);
    }
  }

  /**
   * @param {boolean} required
   * @private
   */
  __setAriaRequiredAttribute(required) {
    if (!this.__target) {
      return;
    }

    if (!this.__isGroupField) {
      // native <input> or <textarea>, required is enough
      return;
    }

    if (required) {
      this.__target.setAttribute('aria-required', 'true');
    } else {
      this.__target.removeAttribute('aria-required');
    }
  }

  /**
   * @param {string | null | undefined} newId
   * @param {string | null | undefined} oldId
   * @private
   */
  __setAriaAttributeId(attr, newId, oldId) {
    if (!this.__target) {
      return;
    }

    let ids = this.__target.getAttribute(attr);
    if (ids) {
      ids = new Set(ids.split(' '));
      ids.delete(oldId);
    } else {
      ids = new Set();
    }

    if (newId) {
      ids.add(newId);
    }

    this.__target.setAttribute(attr, [...ids].join(' '));
  }
}
