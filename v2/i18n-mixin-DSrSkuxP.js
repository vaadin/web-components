import{d as t}from"./object-utils-DKa8XIIk.js";
/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const e=e=>class extends e{static get properties(){return{i18n:{type:Object},__effectiveI18n:{type:Object,sync:!0}}}static get defaultI18n(){return{}}constructor(){super(),this.__updateEffectiveI18n()}get i18n(){return this.__customI18n}set i18n(t){t!==this.__customI18n&&(this.__customI18n=t,this.__updateEffectiveI18n())}__updateEffectiveI18n(){this.__effectiveI18n=t({},this.constructor.defaultI18n,this.__customI18n)}};export{e as I};
