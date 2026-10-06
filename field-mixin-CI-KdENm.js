import{a as e}from"./style-props-CNAjUT68.js";import{i as t}from"./lit-element-auhBwOEL.js";import{s as i,r as a,c as r}from"./dom-utils-Y63l1ijb.js";import{a as l}from"./announce-CPgagP4G.js";import{S as s}from"./slot-child-observe-controller-Bl1ii4Bi.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const o=t`
  :host {
    --_helper-below-field: initial;
    --_helper-above-field: ;
    --_no-helper: initial;
    --_has-helper: ;
    --_no-error: initial;
    --_has-error: ;
    --_rows-after-input: ;
    --_gap: var(--vaadin-input-field-container-gap, var(--vaadin-gap-xs));
    --_gap-s: round(var(--_gap) / 3, 2px);
    /* Single-line input-field height, 1lh resolves on ::before */
    --_field-input-default-height: calc(
      1lh + var(--vaadin-padding-block-container) * 2 + var(--vaadin-input-field-border-width, 1px) * 2
    );
    /* Input-field height mirrored by the baseline guide */
    --_field-input-height: var(--_field-input-default-height);
    display: inline-grid;
    grid-template:
      '                           label' auto
      var(--_helper-above-field, 'helper' auto)
      '                           baseline' 0
      '                           input' 1fr
      var(--_rows-after-input)
      var(--_helper-below-field, 'helper' auto)
      '                           error' auto
      / 100%;
    height: fit-content;
    outline: none;
    cursor: default;
    -webkit-tap-highlight-color: transparent;
  }

  :host([has-helper]) {
    --_has-helper: initial;
    --_no-helper: ;
  }

  :host([has-error-message]) {
    --_has-error: initial;
    --_no-error: ;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-label])) [part='label'],
  :host(:not([has-helper])) [part='helper-text'],
  :host(:not([has-error-message])) [part='error-message'] {
    display: none;
  }

  /* Baseline alignment guide */
  :host::before {
    --_baseline-height: var(--vaadin-field-baseline-input-height, var(--_field-input-height));
    content: '\\2003' / '';
    grid-column: baseline;
    grid-row: 1 / baseline;
    align-self: end;
    /* Center text like the input container */
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--_baseline-height);
    font-size: var(--vaadin-input-field-value-font-size, inherit);
    line-height: var(--vaadin-input-field-value-line-height, inherit);
    padding: var(
      --vaadin-input-field-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    border: var(--vaadin-input-field-border-width, 1px) solid transparent;
    pointer-events: none;
    margin-bottom: calc(var(--_baseline-height) * -1);
  }

  [class$='container'] {
    display: contents;
  }

  [part] {
    grid-column: 1;
  }

  [part='label'] {
    font-size: var(--vaadin-input-field-label-font-size, inherit);
    line-height: var(--vaadin-input-field-label-line-height, inherit);
    font-weight: var(--vaadin-input-field-label-font-weight, 500);
    color: var(--vaadin-input-field-label-color, var(--vaadin-text-color));
    word-break: break-word;
    position: relative;
    grid-area: label;
    margin-bottom: var(--_helper-below-field, var(--_gap)) var(--_helper-above-field, var(--_no-helper, var(--_gap)));
  }

  ::slotted(label) {
    cursor: inherit;
  }

  :host([disabled]) [part='label'],
  :host([disabled]) ::slotted(label) {
    opacity: 0.5;
  }

  :host([disabled]) [part='label'] ::slotted(label) {
    opacity: 1;
  }

  :host([required]) [part='label'] {
    padding-inline-end: 1em;
  }

  [part='required-indicator'] {
    display: inline-block;
    position: absolute;
    width: 1em;
    text-align: center;
    color: var(--vaadin-input-field-required-indicator-color, var(--vaadin-text-color-secondary));
  }

  [part='required-indicator']::after {
    content: var(--vaadin-input-field-required-indicator, '*');
  }

  :host(:not([required])) [part='required-indicator'] {
    display: none;
  }

  [part='label'],
  [part='helper-text'],
  [part='error-message'] {
    width: min-content;
    min-width: 100%;
    box-sizing: border-box;
  }

  [part='input-field'],
  [part='group-field'],
  [part='input-fields'] {
    grid-area: input;
  }

  [part='input-field'] {
    width: var(--vaadin-field-default-width, 12em);
    max-width: 100%;
    min-width: 100%;
  }

  :host([readonly]) [part='input-field'] {
    cursor: default;
  }

  :host([disabled]) [part='input-field'] {
    cursor: var(--vaadin-disabled-cursor);
  }

  [part='helper-text'] {
    font-size: var(--vaadin-input-field-helper-font-size, inherit);
    line-height: var(--vaadin-input-field-helper-line-height, inherit);
    font-weight: var(--vaadin-input-field-helper-font-weight, 400);
    color: var(--vaadin-input-field-helper-color, var(--vaadin-text-color-secondary));
    grid-area: helper;
    margin-top: var(--_helper-above-field, var(--_gap-s)) var(--_helper-below-field, var(--_gap));
    margin-bottom: var(--_helper-above-field, var(--_gap));
  }

  [part='error-message'] {
    font-size: var(--vaadin-input-field-error-font-size, inherit);
    line-height: var(--vaadin-input-field-error-line-height, inherit);
    font-weight: var(--vaadin-input-field-error-font-weight, 400);
    color: var(--vaadin-input-field-error-color, var(--vaadin-text-color));
    display: flex;
    gap: var(--vaadin-gap-xs);
    grid-area: error;
    margin-top: var(--_has-helper, var(--_helper-below-field, var(--_gap-s)) var(--_helper-above-field, var(--_gap)))
      var(--_no-helper, var(--_gap));
  }

  [part='error-message']::before {
    content: '';
    display: inline-block;
    flex: none;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-warn) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    background: currentColor;
  }

  :host([theme~='helper-above-field']) {
    --_helper-above-field: initial;
    --_helper-below-field: ;
  }

  @media (forced-colors: active) {
    [part='error-message']::before {
      background: CanvasText;
    }
  }
`,d=t`
  :host(:is([theme~='label-aside'], [data-form-layout-has-labels-aside])) {
    --_label-aside-width: 0px;
    --_label-aside-gap: 0px;

    grid-template:
      var(--_helper-above-field, '.     helper' auto)
      '                           .     baseline' 0
      '                           label input' 1fr
      var(--_rows-after-input)
      var(--_helper-below-field, 'label helper' auto)
      '                           label error' auto
      / var(--_label-aside-width) minmax(0, 1fr);
    column-gap: var(--_label-aside-gap);
  }

  :host(:is([theme~='label-aside'][has-label], [data-form-layout-has-labels-aside])) {
    --_label-aside-width: var(--vaadin-input-field-label-aside-width, auto);
    --_label-aside-gap: var(--vaadin-input-field-label-aside-gap, 1em);
  }

  :host(:is([theme~='label-aside'], [data-form-layout-has-labels-aside])) [part='label'] {
    width: auto;
    min-width: auto;
    align-self: baseline;
    margin-bottom: 0;
    text-align: var(--vaadin-input-field-label-aside-text-align, inherit);
  }

  :host(:is([theme~='label-aside'], [data-form-layout-has-labels-aside])) [part='input-field'],
  :host(:is([theme~='label-aside'], [data-form-layout-has-labels-aside])) [part='group-field'],
  :host(:is([theme~='label-aside'], [data-form-layout-has-labels-aside])) [part='input-fields'] {
    align-self: baseline;
  }
`,n=t`
  :host {
    --_field-input-height: max(var(--vaadin-input-field-height, 0px), var(--_field-input-default-height));
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class h{#e;#t=!1;#i;#a;#r;#l;#s;#o=[];#d=[];constructor(e){this.host=e}setTarget(e){this.#e=e,this.#n(),this.#h(),this.#p(),this.#u()}setRequired(e){this.#t=e,this.#u()}setLabel(e){this.#i=e,this.#n()}setLabelledBy(e){this.#a=e,this.#h()}setDescribedBy(e){this.#r=e,this.#p()}setErrorId(e){this.#l=e,this.#p()}setHelperId(e){this.#s=e,this.#p()}#n(){this.#e&&i(this.#e,"aria-label",this.#i)}#h(){this.#e&&(a(this.#e,"aria-labelledby",this.#o),this.#o=[this.#a],r(this.#e,"aria-labelledby",this.#o))}#p(){this.#e&&(a(this.#e,"aria-describedby",this.#d),this.#d=[this.#r,this.#s,this.#l],r(this.#e,"aria-describedby",this.#d))}#u(){this.#e&&(["input","textarea"].includes(this.#e.localName)||i(this.#e,"aria-required",this.#t))}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class p extends s{constructor(e){super(e,"error-message","div")}setErrorMessage(e){this.errorMessage=e,this.updateDefaultNode(this.node)}setInvalid(e){this.invalid=e,this.updateDefaultNode(this.node)}initAddedNode(e){e!==this.defaultNode&&this.initCustomNode(e)}initNode(e){this.updateDefaultNode(e)}initCustomNode(e){e.textContent&&!this.errorMessage&&(this.errorMessage=e.textContent.trim()),super.initCustomNode(e)}restoreDefaultNode(){this.attachDefaultNode()}updateDefaultNode(e){const{errorMessage:t,invalid:i}=this,a=Boolean(i&&t&&""!==t.trim());e&&(e.textContent=a?t:"",e.hidden=!a,a&&l(t,{mode:"assertive"})),super.updateDefaultNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class u extends s{constructor(e){super(e,"helper",null)}setHelperText(e){this.helperText=e;this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){const{helperText:e}=this;if(e&&""!==e.trim()){this.tagName="div";const e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(e){e&&(e.textContent=this.helperText),super.updateDefaultNode(e)}initCustomNode(e){super.initCustomNode(e),this.observeNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class b extends s{constructor(e){super(e,"label","label")}setLabel(e){this.label=e;this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){const{label:e}=this;if(e&&""!==e.trim()){const e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(e){e&&(e.textContent=this.label),super.updateDefaultNode(e)}initCustomNode(e){super.initCustomNode(e),this.observeNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const c=e=>class extends e{static get properties(){return{label:{type:String,observer:"_labelChanged"}}}constructor(){super(),this._labelController=new b(this),this._labelController.addEventListener("slot-content-changed",e=>{this.toggleAttribute("has-label",e.detail.hasContent)})}get _labelId(){const e=this._labelNode;return e?.id}get _labelNode(){return this._labelController.node}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(e){this._labelController.setLabel(e)}},v=e(e=>class extends e{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1,sync:!0},manualValidation:{type:Boolean,value:!1},required:{type:Boolean,reflectToAttribute:!0,sync:!0}}}validate(){const e=this.checkValidity();return this._setInvalid(!e),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:e}})),e}checkValidity(){return!this.required||!!this.value}_setInvalid(e){this._shouldSetInvalid(e)&&(this.invalid=e)}_shouldSetInvalid(e){return!0}_requestValidation(){this.manualValidation||this.validate()}}),g=e=>class extends(v(c(e))){static get properties(){return{ariaTarget:{type:Object},errorMessage:{type:String},helperText:{type:String},accessibleName:{type:String},accessibleNameRef:{type:String},accessibleDescriptionRef:{type:String}}}constructor(){super(),this._labelController.addEventListener("slot-content-changed",e=>{this.#b(e)}),this._helperController=new u(this),this._helperController.addEventListener("slot-content-changed",e=>{this.#c(e)}),this._errorController=new p(this),this._errorController.addEventListener("slot-content-changed",e=>{this.#v(e)}),this._fieldAriaController=new h(this)}get _errorNode(){return this._errorController.node}get _helperNode(){return this._helperController.node}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}updated(e){super.updated(e),e.has("invalid")&&this._errorController.setInvalid(this.invalid),e.has("errorMessage")&&this._errorController.setErrorMessage(this.errorMessage),e.has("helperText")&&this._helperController.setHelperText(this.helperText),e.has("ariaTarget")&&this._fieldAriaController.setTarget(this.ariaTarget),e.has("required")&&this._fieldAriaController.setRequired(this.required),e.has("accessibleName")&&this.__updateFieldAriaControllerLabel(),(e.has("accessibleName")||e.has("accessibleNameRef"))&&this.__updateFieldAriaControllerLabelledBy(),e.has("accessibleDescriptionRef")&&this.__updateFieldAriaControllerDescribedBy()}__updateFieldAriaControllerLabel(){this._fieldAriaController.setLabel(this.accessibleName)}__updateFieldAriaControllerLabelledBy(){let e=null;this.accessibleNameRef?e=this.accessibleNameRef:this.hasAttribute("has-label")&&!this.accessibleName&&(e=this._labelNode?.id),this._fieldAriaController.setLabelledBy(e)}__updateFieldAriaControllerDescribedBy(){this._fieldAriaController.setDescribedBy(this.accessibleDescriptionRef)}#b(e){this.__updateFieldAriaControllerLabelledBy()}#c(e){const{hasContent:t}=e.detail;this.toggleAttribute("has-helper",t),t?this._fieldAriaController.setHelperId(this._helperNode?.id):this._fieldAriaController.setHelperId(null)}#v(e){this.toggleAttribute("has-error-message",e.detail.hasContent),setTimeout(()=>{this.invalid?this._fieldAriaController.setErrorId(this._errorNode?.id):this._fieldAriaController.setErrorId(null)})}};
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */export{g as F,b as L,v as V,d as a,n as b,c,o as f};
