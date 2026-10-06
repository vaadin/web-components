import{A as t}from"./active-mixin-BwZlW32_.js";import{F as e}from"./focus-mixin-BlF5WqSW.js";import{T as s}from"./tabindex-mixin-DVm1bh4M.js";
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const n=["mousedown","mouseup","click","dblclick","keypress","keydown","keyup"],i=i=>class extends(t(s(e(i)))){constructor(){super(),this.__onInteractionEvent=this.__onInteractionEvent.bind(this),n.forEach(t=>{this.addEventListener(t,this.__onInteractionEvent,!0)}),this.tabindex=0}get _activeKeys(){return["Enter"," "]}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","button"),this.__shouldAllowFocusWhenDisabled()&&this.style.setProperty("--_vaadin-button-disabled-pointer-events","auto")}_onKeyDown(t){super._onKeyDown(t),t.altKey||t.shiftKey||t.ctrlKey||t.metaKey||this._activeKeys.includes(t.key)&&(t.preventDefault(),this.click())}__onInteractionEvent(t){this.__shouldSuppressInteractionEvent(t)&&t.stopImmediatePropagation()}__shouldSuppressInteractionEvent(t){return this.disabled}};export{i as B};
