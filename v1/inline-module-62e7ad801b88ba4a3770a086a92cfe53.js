import"./inline-module-e65a9c8118dedf25d263e16d12981680.js";import{a as t,c as e,e as s,g as a,h as i,i as n,b as r,j as o,d as l}from"./vaadin-date-picker-mixin-DeI_IM5H.js";import{i as h,a as u,x as d}from"./lit-element-auhBwOEL.js";import{o as _}from"./if-defined-B5fxE5ye.js";import{P as c,d as p}from"./style-props-CNAjUT68.js";import{E as v}from"./element-mixin-DsE5nz_5.js";import{S as m}from"./slot-controller-B41Apm_H.js";import{T as f}from"./tooltip-controller-Dzwl10F9.js";import{i as g}from"./input-field-shared-styles-p_eNY48D.js";import{L as y}from"./lumo-injection-mixin-DCcyC9oP.js";import{T as D}from"./vaadin-themable-mixin-CCn25V_x.js";import{a as b}from"./announce-CPgagP4G.js";import{h as I}from"./aria-hidden-BAQGNX-A.js";import{D as C}from"./delegate-focus-mixin-D4JWZ-KU.js";import{a as V,i as k}from"./focus-utils-Cdox8WfX.js";import{K as w}from"./keyboard-mixin-DELIYI1K.js";import{s as x}from"./dom-utils-Y63l1ijb.js";import{I as j}from"./i18n-mixin-DSrSkuxP.js";import{M as O}from"./media-query-controller-Cc7p4IyD.js";import{F as S}from"./field-mixin-CI-KdENm.js";import"./vaadin-overlay-mixin-CguQllmq.js";import"./vaadin-overlay-animation-base-styles-DYKIAtXf.js";import"./css-utils-CmmJrizo.js";import"./browser-utils-C937ySgG.js";import"./event-utils-DwKz1-tV.js";import"./focus-trap-controller-Dk0CltKN.js";import"./vaadin-overlay-position-mixin-B5tiv7TO.js";import"./vaadin-button-DVNW8DRQ.js";import"./vaadin-button-base-styles-DNtN-wHr.js";import"./vaadin-button-mixin-B73rIyss.js";import"./active-mixin-BwZlW32_.js";import"./gestures-D5a77k0H.js";import"./disabled-mixin-BaKaF6ef.js";import"./focus-mixin-BlF5WqSW.js";import"./tabindex-mixin-DVm1bh4M.js";import"./loader-styles-CKEJfdsd.js";import"./input-constraints-mixin-Cr5dFA7X.js";import"./delegate-state-mixin-7v4cEzgH.js";import"./input-mixin-bDdaN7c3.js";import"./slot-observer-BKwz62Gh.js";import"./object-utils-DKa8XIIk.js";import"./slot-child-observe-controller-Bl1ii4Bi.js";
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const A=h`
  :host {
    /* Fits two full dates with their clear buttons */
    width: var(--vaadin-date-range-picker-default-width, 20em);
  }

  [part='separator'] {
    flex: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0;
    min-height: 0;
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
  }

  /* Themes may fade out overflowing slotted content, which does not apply here */
  [part='separator'],
  [part~='start-clear-button'] {
    mask-image: none;
  }

  ::slotted(input) {
    min-width: 0;
  }

  /* Show each clear button only for its own value, overriding the shared has-value rule */
  :host([clear-button-visible][has-value]:not([has-start-value]):not([disabled]))
    [part~='clear-button'][part~='start-clear-button'],
  :host([clear-button-visible][has-value]:not([has-end-value]):not([disabled]))
    [part~='clear-button'][part~='end-clear-button'] {
    display: none;
  }

  /* Highlight the input whose date a pick in the calendar sets */
  :host([opened][active-part='start']) ::slotted([slot='input']),
  :host([opened][active-part='end']) ::slotted([slot='end-input']) {
    border-radius: var(--vaadin-radius-s);
    background: var(
      --vaadin-date-range-picker-active-input-background,
      color-mix(in srgb, var(--vaadin-focus-ring-color, currentColor) 12%, transparent)
    );
  }
`
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,E=Object.freeze({...t,startAccessibleName:"Start date",endAccessibleName:"End date",rangeStart:"range start",rangeEnd:"range end",inRange:"in range"}),P=t=>class extends(j(S(C(w(t))))){static get properties(){return{startValue:{type:String,value:"",notify:!0,sync:!0},endValue:{type:String,value:"",notify:!0,sync:!0},min:{type:String},max:{type:String},isDateDisabled:{type:Function},startPlaceholder:{type:String},endPlaceholder:{type:String},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},showWeekNumbers:{type:Boolean,value:!1},opened:{type:Boolean,reflectToAttribute:!0,notify:!0,sync:!0},_activePart:{type:String,value:"start",reflectToAttribute:!0,attribute:"active-part",sync:!0},_startDate:{type:Object,value:null,sync:!0},_endDate:{type:Object,value:null,sync:!0},_overlayContent:{type:Object,sync:!0},_fullscreen:{type:Boolean,value:!1,sync:!0},_fullscreenMediaQuery:{value:"(max-width: 450px), (max-height: 450px)"}}}static get defaultI18n(){return E}get i18n(){return super.i18n}set i18n(t){super.i18n=t}get _startInput(){return this.querySelector(':scope > input[slot="input"]')}get _endInput(){return this.querySelector(':scope > input[slot="end-input"]')}get __activeInput(){return"end"===this._activePart?this._endInput:this._startInput}get __activeDate(){return"end"===this._activePart?this._endDate:this._startDate}get __minDate(){return e(this.min)}get __maxDate(){return e(this.max)}constructor(){super(),this._boundOnScroll=this.__onScroll.bind(this)}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","group"),this.ariaTarget=this,this.addEventListener("click",t=>this.__onHostClick(t)),this.addEventListener("focusin",t=>this.__onFocusIn(t)),this.addController(new O(this._fullscreenMediaQuery,t=>{this._fullscreen=t}))}willUpdate(t){super.willUpdate(t),t.has("opened")&&this.opened&&this.__ensureContent(),t.has("startValue")&&(this._startDate=this.__parseValue(this.startValue,this._startDate)),t.has("endValue")&&(this._endDate=this.__parseValue(this.endValue,this._endDate))}updated(t){super.updated(t),(t.has("_startDate")||t.has("__effectiveI18n"))&&(this.startValue=s(this._startDate),this.__applyInputValue(this._startInput,this._startDate)),(t.has("_endDate")||t.has("__effectiveI18n"))&&(this.endValue=s(this._endDate),this.__applyInputValue(this._endInput,this._endDate)),(t.has("_startDate")||t.has("_endDate"))&&(this.toggleAttribute("has-value",!(!this._startDate&&!this._endDate)),this.toggleAttribute("has-start-value",!!this._startDate),this.toggleAttribute("has-end-value",!!this._endDate)),(t.has("showWeekNumbers")||t.has("__effectiveI18n"))&&this.toggleAttribute("week-numbers",this.showWeekNumbers&&1===this.__effectiveI18n.firstDayOfWeek),this.__updateInputs(),this.__updateOverlayContent()}firstUpdated(t){super.firstUpdated(t),this.__committedValue=this.__getRangeString()}disconnectedCallback(){super.disconnectedCallback(),this.opened=!1}open(){this.disabled||this.readonly||(this.opened=!0)}close(){this.$.overlay.close()}checkValidity(){const t=[[this._startInput,this._startDate],[this._endInput,this._endDate]].every(([t,e])=>!t||!t.value||!!e&&t.value===this.__formatDate(e)),e=[this._startDate,this._endDate].every(t=>!t||a(t,this.__minDate,this.__maxDate,this.isDateDisabled)),s=!this._startDate||!this._endDate||this._startDate<=this._endDate,i=!this.required||!!this._startDate&&!!this._endDate;return t&&e&&s&&i}_shouldRemoveFocus(t){const{relatedTarget:e}=t;return(!e||!this.contains(e))&&(!this.opened||null!==e&&e!==document.body)}_setFocused(t){super._setFocused(t),t||this.opened||(this.__commitInputValues(),document.hasFocus()&&this._requestValidation())}_onKeyDown(t){if(super._onKeyDown(t),!this.__isFromOverlay(t))switch(t.key){case"ArrowDown":case"ArrowUp":t.preventDefault(),this.opened?this._overlayContent.focusDateElement():(this.__focusOverlayOnOpen=!0,this.open());break;case"Tab":this.opened&&!t.shiftKey&&t.target===this._endInput&&(t.preventDefault(),t.stopPropagation(),this._overlayContent.focusDateElement()),this.opened&&t.shiftKey&&t.target===this._startInput&&(t.preventDefault(),t.stopPropagation(),this._overlayContent.focusCancel())}}_onEnter(t){this.__isFromOverlay(t)||(this.opened?this.close():(this.__commitInputValues(),this._requestValidation()))}_onEscape(t){if(this.opened)return t.stopPropagation(),this.__cancelled=!0,void this.close();const e=!(!this._startInput?.value&&!this._endInput?.value);if(this.clearButtonVisible&&e&&!this.readonly)return t.stopPropagation(),this._startDate=null,this._endDate=null,this.__applyInputValue(this._startInput,null),this.__applyInputValue(this._endInput,null),void this.__commitValueChange();this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)}_onOpenedChanged(t){this.opened=t.detail.value}_onOverlayOpened(){const t=this._overlayContent;t.reset(),this.__datesOnOpen=[this._startDate,this._endDate],this.__committedValue=this.__getRangeString();const e=this.__getInitialPosition();t.initialPosition=e,t.scrollToDate(e),t.focusedDate=e,window.addEventListener("scroll",this._boundOnScroll,!0),this.__focusOverlayOnOpen?(t.focusDateElement(),this.__focusOverlayOnOpen=!1):this.__activeInput.matches(":focus")||this.__focusActiveInput(),this.__showOthers=I(this)}_onOverlayClosing(){this._overlayContent?.cancelLoadVisibleDateMetadata(),this.__pickingWholeRange=!1,this.__showOthers&&(this.__showOthers(),this.__showOthers=null),window.removeEventListener("scroll",this._boundOnScroll,!0),this.__cancelled?(this.__cancelled=!1,[this._startDate,this._endDate]=this.__datesOnOpen,this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)):(this.__commitInputValues(),this._requestValidation()),this.__commitValueChange(),V(this._startInput)||V(this._endInput)||this._setFocused(!1)}_onVaadinOverlayClose(t){const e=t.detail.sourceEvent;e?.composedPath().includes(this)&&!e.composedPath().includes(this.$.overlay)&&t.preventDefault()}_onToggleClick(t){t.stopPropagation(),this.opened?this.close():(this._activePart="start",this.__pickingWholeRange=!0,this.__focusActiveInput(),this.open())}_onClearButtonClick(t,e){t.preventDefault(),t.stopPropagation(),"start"===e?(this._startDate=null,this.__applyInputValue(this._startInput,null)):(this._endDate=null,this.__applyInputValue(this._endInput,null)),this.__commitValueChange()}__onHostClick(t){const e=t.composedPath();e.includes(this.$.overlay)||e.some(t=>t.part?.contains?.("clear-button"))||this.open()}__onFocusIn(t){if(t.target===this._startInput)this._activePart="start";else{if(t.target!==this._endInput)return;this._activePart="end"}this.opened&&this.__revealActiveDate()}_onInputTextChange(t){!this.opened&&t.target.value&&this.open();const e=this.__parseDateText(t.target.value);e&&this._overlayContent&&(this._overlayContent.focusedDate=e)}__onScroll(t){t.target!==window&&this._overlayContent.contains(t.target)||this._overlayContent._repositionYearScroller()}__isFromOverlay(t){return!!this._overlayContent&&t.composedPath().includes(this._overlayContent)}__ensureContent(){if(this._overlayContent)return;const t=document.createElement("vaadin-date-picker-overlay-content");t.setAttribute("slot","overlay"),this.appendChild(t),this._overlayContent=t,t.addEventListener("date-tap",t=>{this.__pickDate(t.detail.date)&&(this.__focusActiveInput(),this.close())}),t.addEventListener("range-drag-end",t=>{const{start:e,end:s}=t.detail;this._startDate=e,this._endDate=s,this.__applyInputValue(this._startInput,e),this.__applyInputValue(this._endInput,s),this.__focusActiveInput(),this.close()}),t.addEventListener("date-selected",t=>{this.__keepOpen=!this.__pickDate(t.detail.date)}),t.addEventListener("close",()=>{this.__keepOpen?this.__keepOpen=!1:(this.close(),this.__focusActiveInput())}),t.addEventListener("click",e=>{e.composedPath().includes(t._cancelButton)&&(this.__cancelled=!0)},!0),t.addEventListener("click",t=>t.stopPropagation()),t.addEventListener("focus-input",()=>this.__focusActiveInput()),this.__updateOverlayContent()}__pickDate(t){return t?"end"!==this._activePart||this._startDate?"end"===this._activePart&&t>=this._startDate?(this._endDate=t,!0):"start"===this._activePart&&this.__pickingWholeRange&&this._endDate&&t<=this._endDate?(this._startDate=t,this._activePart="end",this.__focusActiveInput(),b(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(t)}`),!1):"start"===this._activePart&&this._endDate&&t<=this._endDate?(this._startDate=t,!0):(this._startDate=t,this._endDate=null,this.__applyInputValue(this._endInput,null),this._activePart="end",this.__focusActiveInput(),b(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(t)}`),!1):(this._endDate=t,this._activePart="start",this.__focusActiveInput(),b(`${this.__effectiveI18n.endAccessibleName}: ${this.__formatDate(t)}`),!1):("end"===this._activePart?this._endDate=null:this._startDate=null,!1)}__focusActiveInput(){const t=this.__activeInput;t&&!V(t)&&t.focus({focusVisible:k()})}__revealActiveDate(){const t=this._overlayContent;if(!t)return;const e=this.__activeDate||this._startDate||this._endDate;e&&(t.focusedDate=e)}__getInitialPosition(){const t=this.__activeDate||this._startDate||this._endDate||new Date,e=this.__minDate,s=this.__maxDate;return i(t,e,s)?t:n(t,[e,s])}__updateInputs(){const t=this.__effectiveI18n;[[this._startInput,this.startPlaceholder,t.startAccessibleName],[this._endInput,this.endPlaceholder,t.endAccessibleName]].forEach(([t,e,s])=>{t&&(t.disabled=!!this.disabled,t.readOnly=!!this.readonly,t.placeholder=e||"",x(t,"inputmode",this._fullscreen?"none":null),t.setAttribute("aria-expanded",String(!!this.opened)),t.setAttribute("aria-label",s),x(t,"aria-required",this.required?"true":null))})}__updateOverlayContent(){const t=this._overlayContent;t&&(t.i18n=this.__effectiveI18n,t.label=this.label,t.minDate=this.__minDate,t.maxDate=this.__maxDate,t.isDateDisabled=this.isDateDisabled,t.showWeekNumbers=this.showWeekNumbers,t.selectedDate=this._startDate?null:this._endDate,t.rangeStart=this._startDate,t.rangeEnd=this._endDate,t.rangePreview=this._activePart,t.toggleAttribute("fullscreen",this._fullscreen),x(t,"theme",this._theme))}__commitInputValues(){[[this._startInput,"_startDate"],[this._endInput,"_endDate"]].forEach(([t,e])=>{t&&t.value!==this.__formatDate(this[e])&&(this[e]=this.__parseDateText(t.value)||null,this[e]&&this.__applyInputValue(t,this[e]))}),this.__commitValueChange()}__commitValueChange(){const t=this.__getRangeString();this.__committedValue!==t&&(this._requestValidation(),this.dispatchEvent(new CustomEvent("change",{bubbles:!0}))),this.__committedValue=t}__getRangeString(){return`${s(this._startDate)}/${s(this._endDate)}`}__parseValue(t,s){const a=e(t);return t&&a?r(a,s)?s:a:null}__parseDateText(t){const s=this.__effectiveI18n;if(!t||!s.parseDate)return;const a=s.parseDate(t),i=a&&e(`${a.year}-${a.month+1}-${a.day}`);return i&&!isNaN(i.getTime())?i:void 0}__formatDate(t){return t?this.__effectiveI18n.formatDate(o(t)):""}__applyInputValue(t,e){t&&(t.value=this.__formatDate(e))}};
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $ extends(P(D(v(c(y(u)))))){static get is(){return"vaadin-date-range-picker"}static get styles(){return[g,l,A]}static get properties(){return{_positionTarget:{type:Object,sync:!0}}}render(){return d`
      <div class="vaadin-date-range-picker-container" @click="${this.__inputFieldClickCapture}">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${_(this._theme)}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div
            part="field-button clear-button start-clear-button"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this.__onStartClearClick}"
          ></div>
          <span part="separator" aria-hidden="true">–</span>
          <slot name="end-input"></slot>
          <div
            part="field-button clear-button end-clear-button"
            slot="suffix"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this.__onEndClearClick}"
          ></div>
          <div
            part="field-button toggle-button"
            slot="suffix"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this._onToggleClick}"
          ></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>

        <slot name="tooltip"></slot>
      </div>

      <vaadin-date-picker-overlay
        id="overlay"
        .owner="${this}"
        ?fullscreen="${this._fullscreen}"
        theme="${_(this._theme)}"
        .opened="${this.opened}"
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-open="${this._onOverlayOpened}"
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        @vaadin-overlay-closing="${this._onOverlayClosing}"
        no-vertical-overlap
        exportparts="backdrop, overlay, content"
        .positionTarget="${this._positionTarget}"
      >
        <slot name="overlay"></slot>
      </vaadin-date-picker-overlay>
    `}constructor(){super(),this.__inputFieldClickCapture={handleEvent:t=>this.__onInputFieldClick(t),capture:!0}}ready(){super.ready(),this.addController(new m(this,"input","input",{initializer:t=>this.__initInput(t),useUniqueId:!0})),this.addController(new m(this,"end-input","input",{initializer:t=>this.__initInput(t),useUniqueId:!0})),this._setFocusElement(this._startInput),this._tooltipController=new f(this),this.addController(this._tooltipController),this._tooltipController.setPosition("top"),this._tooltipController.setAriaTarget(this._startInput),this._tooltipController.setShouldShow(t=>!t.opened),this._positionTarget=this.shadowRoot.querySelector('[part="input-field"]')}__initInput(t){t.type="text",t.autocomplete="off",t.setAttribute("role","combobox"),t.setAttribute("aria-haspopup","dialog"),t.addEventListener("input",t=>this._onInputTextChange(t))}__onStartClearClick(t){this._onClearButtonClick(t,"start")}__onEndClearClick(t){this._onClearButtonClick(t,"end")}__onInputFieldClick(t){if(t.composedPath()[0]!==this._positionTarget)return;t.stopPropagation();const e=this.shadowRoot.querySelector('[part="separator"]').getBoundingClientRect();(t.clientX<e.left+e.width/2?this._startInput:this._endInput).focus({focusVisible:!1}),this.open()}__preventDefault(t){t.preventDefault()}}p($),document.querySelector("#band-edges").addEventListener("change",t=>{document.documentElement.classList.toggle("band-edges",t.target.checked)});const q=t=>{const e=new Date;return e.setDate(e.getDate()+t),(t=>{const e=new Date(t);return e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),e.toISOString().slice(0,10)})(e)},T=document.querySelector("#basic"),F=document.querySelector("#basic-log"),L=t=>{F.textContent=`startValue: "${T.startValue}"  endValue: "${T.endValue}"  (last event: ${t?t.type:"-"})`};["change","start-value-changed","end-value-changed"].forEach(t=>T.addEventListener(t,L)),L();const N=document.querySelector("#constrained");N.min=q(-60),N.max=q(60);const B=(8-(new Date).getDay())%7||7;N.startValue=q(B),N.endValue=q(B+11),N.isDateDisabled=t=>{const e=new Date(t.year,t.month,t.day).getDay();return 0===e||6===e};const R=document.querySelector("#required");R.addEventListener("validated",()=>{const t=R.startValue,e=R.endValue,[s,a]=R.querySelectorAll("input"),i=s.value&&!t||a.value&&!e;R.errorMessage=i?"Enter a valid date":t&&e?t>e?"End date can't be before start date":"":"Enter both a start and an end date"}),document.querySelector("#disabled").startValue=q(0),document.querySelector("#disabled").endValue=q(4),document.querySelector("#readonly").startValue=q(0),document.querySelector("#readonly").endValue=q(4);
