import{D as t}from"./disabled-mixin-BaKaF6ef.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const e=e=>class extends(t(e)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged",sync:!0},_lastTabIndex:{type:Number}}}_disabledChanged(t,e){super._disabledChanged(t,e),this.__shouldAllowFocusWhenDisabled()||(t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.setAttribute("tabindex","-1")):e&&(void 0!==this._lastTabIndex?this.setAttribute("tabindex",this._lastTabIndex):this.tabindex=void 0))}_tabindexChanged(t){this.__shouldAllowFocusWhenDisabled()||this.disabled&&-1!==t&&(this._lastTabIndex=t,this.setAttribute("tabindex","-1"))}focus(t){this.disabled&&!this.__shouldAllowFocusWhenDisabled()||super.focus(t)}__shouldAllowFocusWhenDisabled(){return!1}};export{e as T};
