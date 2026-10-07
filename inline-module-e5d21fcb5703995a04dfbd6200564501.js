import"./inline-module-e65a9c8118dedf25d263e16d12981680.js";import{a as t,c as e,e as s,g as i,h as a,i as n,b as r,j as o,d as l}from"./vaadin-date-picker-mixin-WssO35QW.js";import{i as h,a as _,x as u}from"./lit-element-auhBwOEL.js";import{o as d}from"./if-defined-B5fxE5ye.js";import{P as p,d as c}from"./style-props-CNAjUT68.js";import{E as m}from"./element-mixin-DsE5nz_5.js";import{S as v}from"./slot-controller-B41Apm_H.js";import{T as g}from"./tooltip-controller-Dzwl10F9.js";import{i as f}from"./input-field-shared-styles-p_eNY48D.js";import{L as D}from"./lumo-injection-mixin-DCcyC9oP.js";import{T as y}from"./vaadin-themable-mixin-CCn25V_x.js";import{a as I}from"./announce-CPgagP4G.js";import{h as b}from"./aria-hidden-BAQGNX-A.js";import{D as k}from"./delegate-focus-mixin-D4JWZ-KU.js";import{a as V,i as C}from"./focus-utils-Cdox8WfX.js";import{K as x}from"./keyboard-mixin-DELIYI1K.js";import{s as w}from"./dom-utils-Y63l1ijb.js";import{I as P}from"./i18n-mixin-DSrSkuxP.js";import{M as j}from"./media-query-controller-Cc7p4IyD.js";import{F as O}from"./field-mixin-CI-KdENm.js";import"./vaadin-overlay-mixin-CguQllmq.js";import"./vaadin-overlay-animation-base-styles-DYKIAtXf.js";import"./css-utils-CmmJrizo.js";import"./browser-utils-C937ySgG.js";import"./event-utils-DwKz1-tV.js";import"./focus-trap-controller-Dk0CltKN.js";import"./vaadin-overlay-position-mixin-B5tiv7TO.js";import"./vaadin-button-DVNW8DRQ.js";import"./vaadin-button-base-styles-DNtN-wHr.js";import"./vaadin-button-mixin-B73rIyss.js";import"./active-mixin-BwZlW32_.js";import"./gestures-D5a77k0H.js";import"./disabled-mixin-BaKaF6ef.js";import"./focus-mixin-BlF5WqSW.js";import"./tabindex-mixin-DVm1bh4M.js";import"./loader-styles-CKEJfdsd.js";import"./input-constraints-mixin-Cr5dFA7X.js";import"./delegate-state-mixin-7v4cEzgH.js";import"./input-mixin-bDdaN7c3.js";import"./slot-observer-BKwz62Gh.js";import"./object-utils-DKa8XIIk.js";import"./slot-child-observe-controller-Bl1ii4Bi.js";
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const A=h`
  :host {
    /* Fits two full dates with the clear button */
    width: var(--vaadin-date-range-picker-default-width, 20em);
  }

  [part='separator'] {
    flex: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0;
    min-height: 0;
    /* Themes may fade out overflowing slotted content, which does not apply here */
    mask-image: none;
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
  }

  ::slotted(input) {
    min-width: 0;
  }

  /* With a single input, the start input shows the whole range */
  :host([single-input]) ::slotted([slot='end-input']),
  :host([single-input]) [part='separator'] {
    display: none !important;
  }

  /* Highlight the input whose date a pick in the calendar sets */
  :host([opened][active-part='start']:not([single-input])) ::slotted([slot='input']),
  :host([opened][active-part='end']:not([single-input])) ::slotted([slot='end-input']) {
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
 */,S=Object.freeze({...t,startAccessibleName:"Start date",endAccessibleName:"End date",rangeAccessibleName:"Date range",rangeStart:"range start",rangeEnd:"range end",inRange:"in range"}),E=t=>class extends(P(O(k(x(t))))){static get properties(){return{startValue:{type:String,value:"",notify:!0,sync:!0},endValue:{type:String,value:"",notify:!0,sync:!0},min:{type:String},max:{type:String},isDateDisabled:{type:Function},startPlaceholder:{type:String},endPlaceholder:{type:String},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},showWeekNumbers:{type:Boolean,value:!1},separateDatePicking:{type:Boolean,value:!1},singleInput:{type:Boolean,value:!1,reflectToAttribute:!0},opened:{type:Boolean,reflectToAttribute:!0,notify:!0,sync:!0},_activePart:{type:String,value:"start",reflectToAttribute:!0,attribute:"active-part",sync:!0},_startDate:{type:Object,value:null,sync:!0},_endDate:{type:Object,value:null,sync:!0},_overlayContent:{type:Object,sync:!0},_fullscreen:{type:Boolean,value:!1,sync:!0},_fullscreenMediaQuery:{value:"(max-width: 450px), (max-height: 450px)"}}}static get defaultI18n(){return S}get i18n(){return super.i18n}set i18n(t){super.i18n=t}get _startInput(){return this.querySelector(':scope > input[slot="input"]')}get _endInput(){return this.querySelector(':scope > input[slot="end-input"]')}get __activeInput(){return"end"!==this._activePart||this.singleInput?this._startInput:this._endInput}get __isPickingWholeRange(){return this.singleInput||this.__pickingWholeRange}get __activeDate(){return"end"===this._activePart?this._endDate:this._startDate}get __minDate(){return e(this.min)}get __maxDate(){return e(this.max)}constructor(){super(),this._boundOnScroll=this.__onScroll.bind(this)}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","group"),this.ariaTarget=this,this.addEventListener("click",t=>this.__onHostClick(t)),this.addEventListener("focusin",t=>this.__onFocusIn(t)),this.addController(new j(this._fullscreenMediaQuery,t=>{this._fullscreen=t}))}willUpdate(t){super.willUpdate(t),t.has("opened")&&this.opened&&this.__ensureContent();let e=!1;t.has("startValue")&&(e||=this.startValue!==s(this._startDate),this._startDate=this.__parseValue(this.startValue,this._startDate)),t.has("endValue")&&(e||=this.endValue!==s(this._endDate),this._endDate=this.__parseValue(this.endValue,this._endDate)),e&&(this.__committedValue=this.__getRangeString())}updated(t){super.updated(t),(t.has("_startDate")||t.has("__effectiveI18n"))&&(this.startValue=s(this._startDate),this.__applyInputValue(this._startInput,this._startDate)),(t.has("_endDate")||t.has("__effectiveI18n"))&&(this.endValue=s(this._endDate),this.__applyInputValue(this._endInput,this._endDate)),t.has("singleInput")&&(this._endInput&&(this._endInput.value=this.__formatDate(this._endDate)),this._startInput&&(this._startInput.value=this.singleInput?this.__formatRange():this.__formatDate(this._startDate))),(t.has("_startDate")||t.has("_endDate"))&&(this.toggleAttribute("has-value",!(!this._startDate&&!this._endDate)),this.toggleAttribute("has-start-value",!!this._startDate),this.toggleAttribute("has-end-value",!!this._endDate)),(t.has("showWeekNumbers")||t.has("__effectiveI18n"))&&this.toggleAttribute("week-numbers",this.showWeekNumbers&&1===this.__effectiveI18n.firstDayOfWeek),this.__updateInputs(),this.__updateOverlayContent()}firstUpdated(t){super.firstUpdated(t),this.__committedValue=this.__getRangeString()}disconnectedCallback(){super.disconnectedCallback(),this.opened=!1}open(){this.disabled||this.readonly||(this.opened=!0)}close(){this.$.overlay.close()}checkValidity(){const t=this.singleInput?!this._startInput?.value||this._startInput.value===this.__formatRange():[[this._startInput,this._startDate],[this._endInput,this._endDate]].every(([t,e])=>!t||!t.value||!!e&&t.value===this.__formatDate(e)),e=[this._startDate,this._endDate].every(t=>!t||i(t,this.__minDate,this.__maxDate,this.isDateDisabled)),s=!this._startDate||!this._endDate||this._startDate<=this._endDate,a=!this.required||!!this._startDate&&!!this._endDate;return t&&e&&s&&a}_shouldRemoveFocus(t){const{relatedTarget:e}=t;return(!e||!this.contains(e))&&(!this.opened||null!==e&&e!==document.body)}_setFocused(t){super._setFocused(t),t||this.opened||(this.__commitInputValues(),document.hasFocus()&&this._requestValidation())}_onKeyDown(t){if(super._onKeyDown(t),!this.__isFromOverlay(t))switch(t.key){case"ArrowDown":case"ArrowUp":t.preventDefault(),this.opened?this._overlayContent.focusDateElement():(this.__focusOverlayOnOpen=!0,this.open());break;case"Tab":this.opened&&!t.shiftKey&&t.target===this._endInput&&(t.preventDefault(),t.stopPropagation(),this._overlayContent.focusDateElement()),this.opened&&t.shiftKey&&t.target===this._startInput&&(t.preventDefault(),t.stopPropagation(),this._overlayContent.focusCancel())}}_onEnter(t){this.__isFromOverlay(t)||(this.opened?this.close():(this.__commitInputValues(),this._requestValidation()))}_onEscape(t){if(this.opened)return t.stopPropagation(),this.__cancelled=!0,void this.close();const e=!(!this._startInput?.value&&!this._endInput?.value);if(this.clearButtonVisible&&e&&!this.readonly)return t.stopPropagation(),this._startDate=null,this._endDate=null,this.__applyInputValue(this._startInput,null),this.__applyInputValue(this._endInput,null),void this.__commitValueChange();this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)}_onOpenedChanged(t){this.opened=t.detail.value}_onOverlayOpened(){const t=this._overlayContent;t.reset(),this.__datesOnOpen=[this._startDate,this._endDate],this.__committedValue=this.__getRangeString();const e=this.__getInitialPosition();t.initialPosition=e,t.scrollToDate(e),t.focusedDate=e,window.addEventListener("scroll",this._boundOnScroll,!0),this.__focusOverlayOnOpen?(t.focusDateElement(),this.__focusOverlayOnOpen=!1):this.__activeInput.matches(":focus")||this.__focusActiveInput(),this.__showOthers=b(this)}_onOverlayClosing(){this._overlayContent?.cancelLoadVisibleDateMetadata(),this.__pickingWholeRange=!1,this.__showOthers&&(this.__showOthers(),this.__showOthers=null),window.removeEventListener("scroll",this._boundOnScroll,!0),this.__cancelled?(this.__cancelled=!1,[this._startDate,this._endDate]=this.__datesOnOpen,this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)):(this.__commitInputValues(),this._requestValidation()),this.__commitValueChange(),V(this._startInput)||V(this._endInput)||this._setFocused(!1)}_onVaadinOverlayClose(t){const e=t.detail.sourceEvent;e?.composedPath().includes(this)&&!e.composedPath().includes(this.$.overlay)&&t.preventDefault()}_onToggleClick(t){t.stopPropagation(),this.opened?this.close():(this._activePart="start",this.__pickingWholeRange=!0,this.__focusActiveInput(),this.open())}_onClearButtonClick(t){t.preventDefault(),t.stopPropagation(),this._startDate=null,this._endDate=null,this.__applyInputValue(this._startInput,null),this.__applyInputValue(this._endInput,null),this.__commitValueChange()}__onHostClick(t){const e=t.composedPath();e.includes(this.$.overlay)||e.some(t=>t.part?.contains?.("clear-button"))||(!this.singleInput&&this.separateDatePicking||this.opened?this.open():this._startWholeRangePick())}_startWholeRangePick(){this.disabled||this.readonly||(this._activePart="start",this.__pickingWholeRange=!0,this.__focusActiveInput(),this.open())}__onFocusIn(t){const e=!C()&&!this.__focusingProgrammatically;if(t.target!==this._endInput||!e||this.opened||this.separateDatePicking){if(t.target===this._startInput&&this.singleInput)this.opened||(this._activePart="start");else if(t.target===this._startInput)this._activePart="start";else{if(t.target!==this._endInput)return;this._activePart="end"}this.opened&&this.__revealActiveDate()}else this._startWholeRangePick()}_onInputTextChange(t){!this.opened&&t.target.value&&this.open();const e=this.singleInput?this.__splitRangeText(t.target.value).at(-1):t.target.value,s=this.__parseDateText(e);s&&this._overlayContent&&(this._overlayContent.focusedDate=s)}__onScroll(t){t.target!==window&&this._overlayContent.contains(t.target)||this._overlayContent._repositionYearScroller()}__isFromOverlay(t){return!!this._overlayContent&&t.composedPath().includes(this._overlayContent)}__ensureContent(){if(this._overlayContent)return;const t=document.createElement("vaadin-date-picker-overlay-content");t.setAttribute("slot","overlay"),this.appendChild(t),this._overlayContent=t,t.addEventListener("date-tap",t=>{this.__pickDate(t.detail.date)&&(this.__focusActiveInput(),this.close())}),t.addEventListener("range-drag-end",t=>{const{start:e,end:s}=t.detail;this._startDate=e,this._endDate=s,this.__applyInputValue(this._startInput,e),this.__applyInputValue(this._endInput,s),this.__focusActiveInput(),this.close()}),t.addEventListener("date-selected",t=>{this.__keepOpen=!this.__pickDate(t.detail.date)}),t.addEventListener("close",()=>{this.__keepOpen?this.__keepOpen=!1:(this.close(),this.__focusActiveInput())}),t.addEventListener("click",e=>{e.composedPath().includes(t._cancelButton)&&(this.__cancelled=!0)},!0),t.addEventListener("click",t=>t.stopPropagation()),t.addEventListener("focus-input",()=>this.__focusActiveInput()),this.__updateOverlayContent()}__pickDate(t){return t?"end"!==this._activePart||this._startDate?"end"===this._activePart&&t>=this._startDate?(this._endDate=t,!0):"start"===this._activePart&&this.__isPickingWholeRange&&this._endDate&&t<=this._endDate?(this._startDate=t,this._activePart="end",this.__focusActiveInput(),I(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(t)}`),!1):"start"===this._activePart&&this._endDate&&t<=this._endDate?(this._startDate=t,!0):(this._startDate=t,this._endDate=null,this.__applyInputValue(this._endInput,null),this._activePart="end",this.__focusActiveInput(),I(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(t)}`),!1):(this._endDate=t,this._activePart="start",this.__focusActiveInput(),I(`${this.__effectiveI18n.endAccessibleName}: ${this.__formatDate(t)}`),!1):("end"===this._activePart?this._endDate=null:this._startDate=null,!1)}__focusActiveInput(){const t=this.__activeInput;t&&!V(t)&&(this.__focusingProgrammatically=!0,t.focus({focusVisible:C()}),this.__focusingProgrammatically=!1)}__revealActiveDate(){const t=this._overlayContent;if(!t)return;const e=this.__activeDate||this._startDate||this._endDate;e&&(t.focusedDate=e)}__getInitialPosition(){const t=this.__activeDate||this._startDate||this._endDate||new Date,e=this.__minDate,s=this.__maxDate;return a(t,e,s)?t:n(t,[e,s])}__updateInputs(){const t=this.__effectiveI18n,{startPlaceholder:e,endPlaceholder:s}=this,i=e||s?`${e||""} – ${s||""}`:"";[this.singleInput?[this._startInput,i,t.rangeAccessibleName]:[this._startInput,e,t.startAccessibleName],[this._endInput,s,t.endAccessibleName]].forEach(([t,e,s])=>{t&&(t===this._endInput&&(t.hidden=this.singleInput),t.disabled=!!this.disabled,t.readOnly=!!this.readonly,t.placeholder=e||"",w(t,"inputmode",this._fullscreen?"none":null),t.setAttribute("aria-expanded",String(!!this.opened)),t.setAttribute("aria-label",s),w(t,"aria-required",this.required?"true":null))})}__updateOverlayContent(){const t=this._overlayContent;t&&(t.i18n=this.__effectiveI18n,t.label=this.label,t.minDate=this.__minDate,t.maxDate=this.__maxDate,t.isDateDisabled=this.isDateDisabled,t.showWeekNumbers=this.showWeekNumbers,t.selectedDate=this._startDate?null:this._endDate,t.rangeStart=this._startDate,t.rangeEnd=this._endDate,t.rangePreview=this._activePart,t.toggleAttribute("fullscreen",this._fullscreen),w(t,"theme",this._theme))}__commitInputValues(){this.singleInput?this.__commitRangeText():([[this._startInput,"_startDate"],[this._endInput,"_endDate"]].forEach(([t,e])=>{t&&t.value!==this.__formatDate(this[e])&&(this[e]=this.__parseDateText(t.value)||null,this[e]&&this.__applyInputValue(t,this[e]))}),this.__commitValueChange())}__commitValueChange(){const t=this.__getRangeString();this.__committedValue!==t&&(this._requestValidation(),this.dispatchEvent(new CustomEvent("change",{bubbles:!0}))),this.__committedValue=t}__getRangeString(){return`${s(this._startDate)}/${s(this._endDate)}`}__parseValue(t,s){const i=e(t);return t&&i?r(i,s)?s:i:null}__parseDateText(t){const s=this.__effectiveI18n;if(!t||!s.parseDate)return;const i=s.parseDate(t),a=i&&e(`${i.year}-${i.month+1}-${i.day}`);return a&&!isNaN(a.getTime())?a:void 0}__formatDate(t){return t?this.__effectiveI18n.formatDate(o(t)):""}__applyInputValue(t,e){this.singleInput?this._startInput&&(this._startInput.value=this.__formatRange()):t&&(t.value=this.__formatDate(e))}__formatRange(){const t=this.__formatDate(this._startDate),e=this.__formatDate(this._endDate);return t||e?`${t} – ${e}`.trim():""}__splitRangeText(t){return t.split(/\s*[–—]\s*|\s+-\s+|\s+to\s+/iu,2).map(t=>t.trim())}__commitRangeText(){const t=this._startInput;if(!t||t.value===this.__formatRange())return;const[e="",s=""]=this.__splitRangeText(t.value),i=this.__parseDateText(e)||null,a=this.__parseDateText(s)||null,n=(!e||i)&&(!s||a);this._startDate=n?i:null,this._endDate=n?a:null,n&&(t.value=this.__formatRange()),this.__commitValueChange()}};
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class $ extends(E(y(m(p(D(_)))))){static get is(){return"vaadin-date-range-picker"}static get styles(){return[f,l,A]}static get properties(){return{_positionTarget:{type:Object,sync:!0}}}render(){return u`
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
          theme="${d(this._theme)}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <span part="separator" aria-hidden="true">–</span>
          <slot name="end-input"></slot>
          <div
            part="field-button clear-button"
            slot="suffix"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this._onClearButtonClick}"
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
        theme="${d(this._theme)}"
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
    `}constructor(){super(),this.__inputFieldClickCapture={handleEvent:t=>this.__onInputFieldClick(t),capture:!0}}ready(){super.ready(),this.addController(new v(this,"input","input",{initializer:t=>this.__initInput(t),useUniqueId:!0})),this.addController(new v(this,"end-input","input",{initializer:t=>this.__initInput(t),useUniqueId:!0})),this._setFocusElement(this._startInput),this._tooltipController=new g(this),this.addController(this._tooltipController),this._tooltipController.setPosition("top"),this._tooltipController.setAriaTarget(this._startInput),this._tooltipController.setShouldShow(t=>!t.opened),this._positionTarget=this.shadowRoot.querySelector('[part="input-field"]')}__initInput(t){t.type="text",t.autocomplete="off",t.setAttribute("role","combobox"),t.setAttribute("aria-haspopup","dialog"),t.addEventListener("input",t=>this._onInputTextChange(t))}__onInputFieldClick(t){if(t.composedPath()[0]!==this._positionTarget)return;if(t.stopPropagation(),this.singleInput||!this.separateDatePicking)return void this._startWholeRangePick();const e=this.shadowRoot.querySelector('[part="separator"]').getBoundingClientRect();(t.clientX<e.left+e.width/2?this._startInput:this._endInput).focus({focusVisible:!1}),this.open()}__preventDefault(t){t.preventDefault()}}c($),document.querySelector("#single-input").addEventListener("change",t=>{document.querySelectorAll("vaadin-date-range-picker").forEach(e=>{e.singleInput=t.target.checked})}),document.querySelector("#separate-date-picking").addEventListener("change",t=>{document.querySelectorAll("vaadin-date-range-picker").forEach(e=>{e.separateDatePicking=t.target.checked})}),document.querySelector("#band-edges").addEventListener("change",t=>{document.documentElement.classList.toggle("band-edges",t.target.checked)});const T=t=>{const e=new Date;return e.setDate(e.getDate()+t),(t=>{const e=new Date(t);return e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),e.toISOString().slice(0,10)})(e)},R=document.querySelector("#basic"),q=document.querySelector("#basic-log"),L=t=>{q.textContent=`startValue: "${R.startValue}"  endValue: "${R.endValue}"  (last event: ${t?t.type:"-"})`};["change","start-value-changed","end-value-changed"].forEach(t=>R.addEventListener(t,L)),L();const F=document.querySelector("#constrained");F.min=T(-60),F.max=T(60);const W=(8-(new Date).getDay())%7||7;F.startValue=T(W),F.endValue=T(W+11),F.isDateDisabled=t=>{const e=new Date(t.year,t.month,t.day).getDay();return 0===e||6===e};const N=document.querySelector("#required");N.addEventListener("validated",()=>{const t=N.startValue,e=N.endValue,[s,i]=N.querySelectorAll("input"),a=s.value&&!t||i.value&&!e;N.errorMessage=a?"Enter a valid date":t&&e?t>e?"End date can't be before start date":"":"Enter both a start and an end date"}),document.querySelector("#disabled").startValue=T(0),document.querySelector("#disabled").endValue=T(4),document.querySelector("#readonly").startValue=T(0),document.querySelector("#readonly").endValue=T(4);
