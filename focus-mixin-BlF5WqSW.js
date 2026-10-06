import{i as s}from"./focus-utils-Cdox8WfX.js";import{a as t}from"./style-props-CNAjUT68.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const e=t(t=>class extends t{get _keyboardActive(){return s()}ready(){this.addEventListener("focusin",s=>{this._shouldSetFocus(s)&&this._setFocused(!0)}),this.addEventListener("focusout",s=>{this._shouldRemoveFocus(s)&&this._setFocused(!1)}),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}focus(s){super.focus(s),!1!==s?.focusVisible&&this.setAttribute("focus-ring","")}_setFocused(s){this.toggleAttribute("focused",s),this.toggleAttribute("focus-ring",s&&this._keyboardActive)}_shouldSetFocus(s){return!0}_shouldRemoveFocus(s){return!0}});export{e as F};
