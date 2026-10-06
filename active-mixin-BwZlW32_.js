import{a as e}from"./gestures-D5a77k0H.js";import{D as t}from"./disabled-mixin-BaKaF6ef.js";import{K as s}from"./keyboard-mixin-DELIYI1K.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const i=i=>class extends(t(s(i))){get _activeKeys(){return[" "]}ready(){super.ready(),e(this,"down",e=>{this._shouldSetActive(e)&&this._setActive(!0)}),e(this,"up",()=>{this._setActive(!1)})}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(e){return!this.disabled}_onKeyDown(e){super._onKeyDown(e),this._shouldSetActive(e)&&this._activeKeys.includes(e.key)&&(this._setActive(!0),document.addEventListener("keyup",e=>{this._activeKeys.includes(e.key)&&this._setActive(!1)},{once:!0}))}_setActive(e){this.toggleAttribute("active",e)}};export{i as A};
