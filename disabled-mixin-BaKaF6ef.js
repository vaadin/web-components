import{s}from"./dom-utils-Y63l1ijb.js";import{a as e}from"./style-props-CNAjUT68.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const t=e(e=>class extends e{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}_disabledChanged(s){this._setAriaDisabled(s)}_setAriaDisabled(e){s(this,"aria-disabled",e)}click(){this.disabled||super.click()}});export{t as D};
