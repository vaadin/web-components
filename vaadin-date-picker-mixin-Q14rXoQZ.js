import{i as e,a as t,x as a}from"./lit-element-auhBwOEL.js";import{D as i,P as n,d as s}from"./style-props-CNAjUT68.js";import{O as r,a as o}from"./vaadin-overlay-mixin-CguQllmq.js";import{L as l,i as d}from"./lumo-injection-mixin-DCcyC9oP.js";import{T as h}from"./vaadin-themable-mixin-CCn25V_x.js";import{d as c,i as u,a as _}from"./focus-utils-Cdox8WfX.js";import{P as p}from"./vaadin-overlay-position-mixin-B5tiv7TO.js";import"./vaadin-button-DVNW8DRQ.js";import{D as m,t as g,m as f}from"./element-mixin-DsE5nz_5.js";import{g as v,S as b}from"./slot-controller-B41Apm_H.js";import{F as y}from"./focus-mixin-BlF5WqSW.js";import{s as D}from"./dom-utils-Y63l1ijb.js";import{a as k}from"./gestures-D5a77k0H.js";import{l as w}from"./loader-styles-CKEJfdsd.js";import{M as C}from"./media-query-controller-Cc7p4IyD.js";import{h as S}from"./aria-hidden-BAQGNX-A.js";import{D as M}from"./delegate-focus-mixin-D4JWZ-KU.js";import{K as E}from"./keyboard-mixin-DELIYI1K.js";import{c as x}from"./browser-utils-C937ySgG.js";import{I as T}from"./i18n-mixin-DSrSkuxP.js";import{I as F}from"./input-constraints-mixin-Cr5dFA7X.js";
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const I=e`
  [part='overlay'] {
    display: flex;
    flex: auto;
    max-height: var(--vaadin-date-picker-overlay-max-height, 30rem);
    box-sizing: content-box;
    width: var(
      --vaadin-date-picker-overlay-width,
      round(
        var(--vaadin-date-picker-date-width, 2rem) * 7 +
          var(--vaadin-date-picker-month-padding, var(--vaadin-padding-s)) * 2 +
          var(--vaadin-date-picker-year-scroller-width, 3rem),
        1px
      )
    );
    cursor: default;
  }

  :host([fullscreen]) [part='backdrop'] {
    display: block;
  }

  :host([fullscreen]) [part='overlay'] {
    border: none;
    border-radius: 0;
    max-height: 75vh;
    width: 100%;
  }

  [part~='content'] {
    flex: auto;
  }

  @media (max-width: 450px), (max-height: 450px) {
    :host {
      inset: auto 0 0 !important;
    }
  }
`
/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,O=e=>class extends(p(r(e))){_initFocus(){}_shouldCloseOnOutsideClick(e){return!e.composedPath().includes(this.positionTarget)}_mouseDownListener(e){super._mouseDownListener(e),this._shouldCloseOnOutsideClick(e)&&!c(e.composedPath()[0])&&e.preventDefault()}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class A extends(O(i(h(n(l(t)))))){static get is(){return"vaadin-date-picker-overlay"}static get styles(){return[o,I]}render(){return a`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `}get _contentRoot(){return this.owner._overlayContent}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function P(e,t,a){const i=new Date(0,0);return i.setFullYear(e),i.setMonth(t),i.setDate(a),i}function V(e){return P(e.getFullYear(),e.getMonth(),1)}function B(e){return P(e.getFullYear(),e.getMonth()+1,0)}function j(e){return t=e.getFullYear(),a=e.getMonth(),12*t+a;var t,a}function Y(e){return P(0,e,1)}function L(e){const t=new Date(e);return t.setHours(0,0,0,0),t}function $(e){return new Date(Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),0,0,0,0))}function W(e,t,a=L){return e instanceof Date&&t instanceof Date&&a(e).getTime()===a(t).getTime()}function H(e){return{day:e.getDate(),month:e.getMonth(),year:e.getFullYear()}}function R(e,t,a,i){let n=!1;if("function"==typeof i&&e){n=i(H(e))}return(!t||e>=t)&&(!a||e<=a)&&!n}function N(e,t,a,i,n){return R(e,t,a,i)&&!n?.isDateDisabled(e)}function z(e,t){return t.filter(e=>void 0!==e).reduce((t,a)=>{if(!a)return t;if(!t)return a;return Math.abs(e.getTime()-a.getTime())<Math.abs(t.getTime()-e.getTime())?a:t})}function U(e){const t=new Date,a=new Date(t);return a.setDate(1),a.setMonth(parseInt(e)+t.getMonth()),a}s(A);const K=/^([-+]\d{1,6}|\d{2,4})-(\d{1,2})-(\d{1,2})$/u;function q(e){const t=K.exec(e);if(t)return{year:parseInt(t[1],10),month:parseInt(t[2],10)-1,day:parseInt(t[3],10)}}function G(e){const t=q(e);if(!t)return;const a=P(t.year,t.month,t.day);return a.getMonth()===t.month&&a.getDate()===t.day?a:void 0}function Q(e){const t=q(e);if(!t)return;const a=new Date(Date.UTC(0,0));return a.setUTCFullYear(t.year),a.setUTCMonth(t.month),a.setUTCDate(t.day),a.getUTCMonth()===t.month&&a.getUTCDate()===t.day?a:void 0}function X(e){const t=(e,t="00")=>(t+e).substr((t+e).length-t.length);let a="",i="0000",n=e.year;n<0?(n=-n,a="-",i="000000"):e.year>=1e4&&(a="+",i="000000");return[a+t(n,i),t(e.month+1),t(e.day)].join("-")}function J(e){return e instanceof Date?X({year:e.getFullYear(),month:e.getMonth(),day:e.getDate()}):""}function Z(e){return e instanceof Date?X({year:e.getUTCFullYear(),month:e.getUTCMonth(),day:e.getUTCDate()}):""}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ee=document.createElement("template");ee.innerHTML='\n  <style>\n    :host {\n      display: block;\n      overflow: hidden;\n      height: 500px;\n    }\n\n    #scroller {\n      position: relative;\n      height: 100%;\n      overflow: auto;\n      /* Prevent browser scroll anchoring from overriding the virtual scroll position. */\n      overflow-anchor: none;\n      outline: none;\n      overflow-x: hidden;\n      scrollbar-width: none;\n    }\n\n    #scroller::-webkit-scrollbar {\n      display: none;\n    }\n\n    .buffer {\n      position: absolute;\n      width: var(--vaadin-infinite-scroller-buffer-width, 100%);\n      box-sizing: border-box;\n      top: var(--vaadin-infinite-scroller-buffer-offset, 0);\n    }\n\n    ::slotted(div) {\n      height: var(--vaadin-infinite-scroller-item-height);\n    }\n  </style>\n\n  <div id="scroller" tabindex="-1">\n    <div class="buffer"></div>\n    <div class="buffer"></div>\n    <div id="fullHeight"></div>\n  </div>\n';class te extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}).appendChild(ee.content.cloneNode(!0)),this.bufferSize=20,this._initialScroll=5e5,this._initialIndex=0,this._activated=!1}get active(){return this._activated}set active(e){e&&!this._activated&&(this._createPool(),this._activated=!0)}get bufferOffset(){return this._buffers[0].offsetTop}get itemHeight(){if(!this._itemHeightVal){const e=getComputedStyle(this).getPropertyValue("--vaadin-infinite-scroller-item-height"),t="background-position";this.$.fullHeight.style.setProperty(t,e);const a=getComputedStyle(this.$.fullHeight).getPropertyValue(t);this.$.fullHeight.style.removeProperty(t),this._itemHeightVal=parseFloat(a)}return this._itemHeightVal}get _bufferHeight(){return this.itemHeight*this.bufferSize}get position(){return(this.$.scroller.scrollTop-this._buffers[0].translateY)/this.itemHeight+this._firstIndex}set position(e){this._preventScrollEvent=!0,e>this._firstIndex&&e<this._firstIndex+2*this.bufferSize?this.$.scroller.scrollTop=this.itemHeight*(e-this._firstIndex)+this._buffers[0].translateY:(this._initialIndex=~~e,this.reset(),this._scrollDisabled=!0,this.$.scroller.scrollTop+=e%1*this.itemHeight,this._scrollDisabled=!1)}connectedCallback(){this._ready||(this._ready=!0,this.$={},this.shadowRoot.querySelectorAll("[id]").forEach(e=>{this.$[e.id]=e}),this.$.scroller.addEventListener("scroll",()=>this._scroll()),this._buffers=[...this.shadowRoot.querySelectorAll(".buffer")],this.$.fullHeight.style.height=2*this._initialScroll+"px")}disconnectedCallback(){this._debouncerScrollFinish&&this._debouncerScrollFinish.cancel(),this._debouncerUpdateClones&&this._debouncerUpdateClones.cancel(),this.__pendingFinishInit&&cancelAnimationFrame(this.__pendingFinishInit)}forceUpdate(){this._debouncerScrollFinish&&this._debouncerScrollFinish.flush(),this._debouncerUpdateClones&&(this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones(),this._debouncerUpdateClones.cancel())}_createElement(){}_updateElement(e,t){}_finishInit(){this._initDone||(this._buffers.forEach(e=>{[...e.children].forEach(e=>{this._ensureStampedInstance(e._itemWrapper)})}),this._buffers[0].translateY||this.reset(),this._initDone=!0,this.dispatchEvent(new CustomEvent("init-done")))}_translateBuffer(e){const t=e?1:0;this._buffers[t].translateY=this._buffers[t?0:1].translateY+this._bufferHeight*(t?-1:1),this._buffers[t].style.transform=`translate3d(0, ${this._buffers[t].translateY}px, 0)`,this._buffers[t].updated=!1,this._buffers.reverse()}_scroll(){if(this._scrollDisabled)return;const e=this.$.scroller.scrollTop;(e<this._bufferHeight||e>2*this._initialScroll-this._bufferHeight)&&(this._initialIndex=~~this.position,this.reset());const t=this.itemHeight+this.bufferOffset,a=e>this._buffers[1].translateY+t,i=e<this._buffers[0].translateY+t;(a||i)&&(this._translateBuffer(i),this._updateClones()),this._preventScrollEvent||this.dispatchEvent(new CustomEvent("custom-scroll",{bubbles:!1,composed:!0})),this._preventScrollEvent=!1,this._debouncerScrollFinish=m.debounce(this._debouncerScrollFinish,g.after(200),()=>{const e=this.$.scroller.getBoundingClientRect();this._isVisible(this._buffers[0],e)||this._isVisible(this._buffers[1],e)||(this.position=this.position)})}reset(){this._activated&&this.isConnected&&(this._itemHeightVal=null,this._scrollDisabled=!0,this.$.scroller.scrollTop=this._initialScroll,this._buffers[0].translateY=this._initialScroll-this._bufferHeight,this._buffers[1].translateY=this._initialScroll,this._buffers.forEach(e=>{e.style.transform=`translate3d(0, ${e.translateY}px, 0)`}),this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones(!0),this._debouncerUpdateClones=m.debounce(this._debouncerUpdateClones,g.after(200),()=>{this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones()}),this._scrollDisabled=!1)}_createPool(){const e=this.innerHeight;this._buffers.forEach(t=>{for(let a=0;a<this.bufferSize;a++){const i=document.createElement("div");i.instance={};const n=`vaadin-infinite-scroller-item-content-${v()}`,s=document.createElement("slot");s.setAttribute("name",n),s._itemWrapper=i,t.appendChild(s),i.setAttribute("slot",n),this.appendChild(i),this.itemHeight*a<=e&&this._ensureStampedInstance(i)}}),this.__pendingFinishInit=requestAnimationFrame(()=>{this._finishInit(),this.__pendingFinishInit=null})}_ensureStampedInstance(e){if(e.firstElementChild)return;const t=e.instance;e.instance=this._createElement(),e.appendChild(e.instance),Object.keys(t).forEach(a=>{e.instance[a]=t[a]})}_updateClones(e){this._firstIndex=Math.round((this._buffers[0].translateY-this._initialScroll)/this.itemHeight)+this._initialIndex;const t=e?this.$.scroller.getBoundingClientRect():void 0;this._buffers.forEach((a,i)=>{if(!a.updated){const n=this._firstIndex+this.bufferSize*i;[...a.children].forEach((a,i)=>{const s=a._itemWrapper;e&&!this._isVisible(s,t)||this._updateElement(s.instance,n+i)}),a.updated=!0}})}_isVisible(e,t){const a=e.getBoundingClientRect();return a.bottom>t.top&&a.top<t.bottom}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ae=document.createElement("template");ae.innerHTML="\n  <style>\n    :host {\n      --vaadin-infinite-scroller-item-height: 270px;\n      grid-area: months;\n      height: auto;\n    }\n  </style>\n";s(class extends te{static get is(){return"vaadin-date-picker-month-scroller"}constructor(){super(),this.bufferSize=3,this.shadowRoot.appendChild(ae.content.cloneNode(!0))}_createElement(){return document.createElement("vaadin-month-calendar")}_updateElement(e,t){e.month=U(t)}});
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ie=document.createElement("template");ie.innerHTML="\n  <style>\n    :host {\n      --vaadin-infinite-scroller-item-height: 80px;\n      width: 50px;\n      display: block;\n      position: relative;\n      grid-area: years;\n      height: auto;\n      -webkit-tap-highlight-color: transparent;\n      -webkit-user-select: none;\n      user-select: none;\n      /* Center the year scroller position. */\n      --vaadin-infinite-scroller-buffer-offset: 50%;\n    }\n\n    :host::before {\n      content: '';\n      display: block;\n      background: transparent;\n      width: 0;\n      height: 0;\n      position: absolute;\n      left: 0;\n      top: 50%;\n      transform: translateY(-50%);\n      border-width: 6px;\n      border-style: solid;\n      border-color: transparent;\n      border-left-color: #000;\n    }\n  </style>\n";s(class extends te{static get is(){return"vaadin-date-picker-year-scroller"}constructor(){super(),this.bufferSize=12,this.shadowRoot.appendChild(ie.content.cloneNode(!0))}_createElement(){return document.createElement("vaadin-date-picker-year")}_updateElement(e,t){e.year=this._yearAfterXYears(t)}_yearAfterXYears(e){const t=new Date,a=new Date(t);return a.setFullYear(parseInt(e)+t.getFullYear()),a.getFullYear()}});
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ne=e`
  :host {
    display: block;
    height: 100%;
  }

  [part='year-number'] {
    align-items: center;
    display: flex;
    height: 50%;
    justify-content: center;
    transform: translateY(-50%);
    color: var(--vaadin-text-color-secondary);
  }

  :host([current]) [part='year-number'] {
    color: var(--vaadin-date-picker-year-scroller-current-year-color, var(--vaadin-text-color));
  }
`
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class se extends(h(n(l(t)))){static get is(){return"vaadin-date-picker-year"}static get styles(){return ne}static get properties(){return{year:{type:String,sync:!0},selectedDate:{type:Object,sync:!0}}}render(){return a`
      <div part="year-number">${this.year}</div>
      <div part="year-separator" aria-hidden="true"></div>
    `}updated(e){super.updated(e),e.has("year")&&this.toggleAttribute("current",this.year===(new Date).getFullYear()),(e.has("year")||e.has("selectedDate"))&&this.toggleAttribute("selected",this.selectedDate&&this.selectedDate.getFullYear()===this.year)}}s(se);
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const re=e`
  :host {
    display: block;
    padding: var(--vaadin-date-picker-month-padding, var(--vaadin-padding-s));
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }

  [part='month-header'] {
    color: var(--vaadin-date-picker-month-header-color, var(--vaadin-text-color));
    font-size: var(--vaadin-date-picker-month-header-font-size, 0.9375rem);
    font-weight: var(--vaadin-date-picker-month-header-font-weight, 500);
    line-height: 1;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  table {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  thead,
  tbody,
  tr {
    display: contents;
  }

  [part~='weekday'] {
    color: var(--vaadin-date-picker-weekday-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-weekday-font-size, 0.75rem);
    font-weight: var(--vaadin-date-picker-weekday-font-weight, 500);
    margin-bottom: 0.375rem;
  }

  /* Week numbers are on a separate row, don't reserve space on weekday row. */
  [part~='weekday']:empty {
    display: none;
  }

  [part~='week-number'] {
    grid-column: -1 / 1;
    color: var(--vaadin-date-picker-week-number-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-week-number-font-size, 0.7rem);
    line-height: 1;
    margin-top: 0.125em;
    margin-bottom: 0.125em;
    gap: 0.25em;
  }

  [part~='week-number']::after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(
      --vaadin-date-picker-week-divider-color,
      var(--vaadin-divider-color, var(--vaadin-border-color-secondary))
    );
  }

  [part~='weekday'],
  [part~='week-number'],
  [part~='date'] {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 0;
  }

  [part~='date'] {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    position: relative;
    height: var(--vaadin-date-picker-date-height, 2rem);
    cursor: var(--vaadin-clickable-cursor);
    outline: none;
  }

  [part~='date']:empty {
    pointer-events: none !important;
  }

  [part~='date']::after {
    border-radius: inherit;
    content: '';
    position: absolute;
    z-index: -1;
    height: min(2em, 100%);
    aspect-ratio: 1;
  }

  :where([part~='date']:focus-visible)::after {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part~='today'] {
    color: var(--vaadin-date-picker-date-today-color, var(--vaadin-text-color));
  }

  [part~='selected'] {
    color: var(--vaadin-date-picker-date-selected-color, var(--vaadin-background-color));
  }

  [part~='selected']::after {
    background: var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color));
    outline-offset: 1px;
  }

  /* Range band, drawn behind the date indicators */
  [part~='in-range'] {
    --_range-band: var(
      --vaadin-date-picker-date-in-range-background,
      color-mix(in srgb, var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color)) 12%, transparent)
    );
    /* Edges in the selection color keep the band distinguishable for low vision (WCAG 1.4.11) */
    --_range-edge: var(
      --vaadin-date-picker-date-in-range-border-color,
      var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color))
    );
    --_range-edge-width: 2px;
    --_range-band-height: min(2em, 100%);
    isolation: isolate;
    border-radius: 0;
    background: linear-gradient(
        var(--_range-edge) var(--_range-edge-width),
        var(--_range-band) var(--_range-edge-width) calc(100% - var(--_range-edge-width)),
        var(--_range-edge) calc(100% - var(--_range-edge-width))
      )
      center / 100% var(--_range-band-height) no-repeat;
  }

  [part~='in-range'][part~='range-start'] {
    background-position: right center;
    background-size: 50% var(--_range-band-height);
  }

  [part~='in-range'][part~='range-end'] {
    background-position: left center;
    background-size: 50% var(--_range-band-height);
  }

  [part~='in-range']::after {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  /* The end of the range being edited is outlined, the other end stays filled */
  [part~='range-editing'] {
    color: var(--vaadin-date-picker-date-range-editing-color, var(--vaadin-text-color));
  }

  [part~='range-editing']::after {
    background: transparent;
    box-shadow: inset 0 0 0 2px var(--_range-edge);
  }

  [disabled] {
    cursor: var(--vaadin-disabled-cursor);
    color: var(--vaadin-date-picker-date-disabled-color, var(--vaadin-text-color-disabled));
    opacity: 0.7;
  }

  [hidden] {
    display: none;
  }

  @media (forced-colors: active) {
    [part~='week-number']::after {
      background: CanvasText;
    }

    [part~='today'] {
      font-weight: 600;
    }

    [part~='selected'] {
      forced-color-adjust: none;
      --vaadin-date-picker-date-selected-color: SelectedItemText;
      color: SelectedItemText !important;
      --vaadin-date-picker-date-selected-background: SelectedItem;
    }

    [disabled] {
      color: GrayText !important;
    }
  }
`
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,oe=e=>class extends(y(e)){static get properties(){return{month:{type:Object,value:new Date,sync:!0},selectedDate:{type:Object,notify:!0,sync:!0},focusedDate:{type:Object},rangeStart:{type:Object,sync:!0},rangeEnd:{type:Object,sync:!0},rangeEditing:{type:String,sync:!0},showWeekNumbers:{type:Boolean,value:!1},i18n:{type:Object},ignoreTaps:{type:Boolean},minDate:{type:Date,value:null,sync:!0},maxDate:{type:Date,value:null,sync:!0},isDateDisabled:{type:Function,value:()=>!1},_dateMetadataController:{type:Object,attribute:!1,sync:!0},enteredDate:{type:Date},disabled:{type:Boolean,reflectToAttribute:!0,computed:"__computeDisabled(month, minDate, maxDate)"},_days:{type:Array,computed:"__computeDays(month, i18n, minDate, maxDate, isDateDisabled)"},_weeks:{type:Array,computed:"__computeWeeks(_days)"},_notTapping:{type:Boolean},__hasFocus:{type:Boolean}}}static get observers(){return["__focusedDateChanged(focusedDate, _days)","_showWeekNumbersChanged(showWeekNumbers, i18n)"]}get focusableDateElement(){return[...this.shadowRoot.querySelectorAll("[part~=date]")].find(e=>W(e.date,this.focusedDate))}ready(){super.ready(),k(this.$.monthGrid,"tap",this._handleTap.bind(this))}_setFocused(e){super._setFocused(e),this.__hasFocus=e}__computeDisabled(e,t,a){const i=V(e),n=B(e);return!(t&&a&&t.getFullYear()===a.getFullYear()&&t.getFullYear()===e.getFullYear()&&t.getMonth()===a.getMonth()&&t.getMonth()===e.getMonth()&&a.getDate()-t.getDate()>=0)&&(!R(i,t,a)&&!R(n,t,a))}_getTitle(e,t){if(void 0!==e&&void 0!==t)return t.formatTitle(t.monthNames[e.getMonth()],e.getFullYear())}_onMonthGridTouchStart(){this._notTapping=!1,setTimeout(()=>{this._notTapping=!0},300)}_dateAdd(e,t){e.setDate(e.getDate()+t)}_applyFirstDayOfWeek(e,t){if(void 0!==e&&void 0!==t)return e.slice(t).concat(e.slice(0,t))}__computeWeekDayNames(e,t){if(void 0===e||void 0===t)return[];const{weekdays:a,weekdaysShort:i,firstDayOfWeek:n}=e,s=this._applyFirstDayOfWeek(i,n);return this._applyFirstDayOfWeek(a,n).map((e,t)=>({weekDay:e,weekDayShort:s[t]})).slice(0,7)}__focusedDateChanged(e,t){const a=Array.isArray(t)&&t.some(t=>W(t,e));D(this,"aria-hidden",!a)}_getDate(e){return e?e.getDate():""}__computeShowWeekSeparator(e,t){return e&&1===t?.firstDayOfWeek}_isToday(e){return W(new Date,e)}__computeDays(e,t){if(void 0===e||void 0===t)return[];const a=V(e);for(;a.getDay()!==t.firstDayOfWeek;)this._dateAdd(a,-1);const i=[],n=a.getMonth(),s=e.getMonth();for(;a.getMonth()===s||a.getMonth()===n;)i.push(a.getMonth()===s?new Date(a.getTime()):null),this._dateAdd(a,1);return i}__computeWeeks(e){return e.reduce((e,t,a)=>(a%7==0&&e.push([]),e[e.length-1].push(t),e),[])}_handleTap(e){this.ignoreTaps||this._notTapping||!e.target.date||e.target.hasAttribute("disabled")||(this.selectedDate=e.target.date,this.dispatchEvent(new CustomEvent("date-tap",{detail:{date:e.target.date},bubbles:!0,composed:!0})))}_preventDefault(e){e.preventDefault()}__computeWeekNumber(e){return function(e){let t=e.getDay();0===t&&(t=7);const a=4-t,i=new Date(e.getTime()+24*a*3600*1e3),n=new Date(0,0);n.setFullYear(i.getFullYear());const s=i.getTime()-n.getTime(),r=Math.round(s/864e5);return Math.floor(r/7+1)}(e.reduce((e,t)=>!e&&t?t:e))}__computeDayAriaLabel(e){if(!e)return"";let t=`${this._getDate(e)} ${this.i18n.monthNames[e.getMonth()]} ${e.getFullYear()}, ${this.i18n.weekdays[e.getDay()]}`;this._isToday(e)&&(t+=`, ${this.i18n.today}`);const a=this.__getRangeRole(e);if(a){const{rangeStart:e,rangeEnd:i,inRange:n}=this.i18n;t+=`, ${{"range-start":e,"range-end":i,"in-range":n}[a]||a.replace("-"," ")}`}return t}_showWeekNumbersChanged(e,t){this.toggleAttribute("week-numbers",this.__computeShowWeekSeparator(e,t))}__computeDatePart(e,t,a,i,n,s,r,o){const l=["date"];this.__isDayDisabled(e,i,n,s)&&l.push("disabled"),e&&this.__isMonthPending()&&l.push("loading"),W(e,t)&&(o||W(e,r))&&l.push("focused"),this.__isDaySelected(e,a)&&l.push("selected"),W(e,this.rangeStart)&&l.push("range-start"),this.rangeStart&&W(e,this.rangeEnd)&&l.push("range-end"),this.__getRangeRole(e)&&this.rangeEnd&&!W(this.rangeStart,this.rangeEnd)&&l.push("in-range"),this.__isRangeEditingDate(e)&&l.push("range-editing"),this._isToday(e)&&l.push("today"),e<L(new Date)&&l.push("past"),e>L(new Date)&&l.push("future");const d=e&&this._dateMetadataController?.getMetadata(e)?.part;return d&&"string"==typeof d&&l.push(d),l.join(" ")}__isDaySelected(e,t){const a=this.__getRangeRole(e);return W(e,t)||"range-start"===a||"range-end"===a}__isRangeEditingDate(e){const{rangeStart:t,rangeEnd:a,rangeEditing:i}=this;return!(!(e&&t&&a)||W(t,a))&&W(e,"start"===i?t:"end"===i?a:null)}__getRangeRole(e){const{rangeStart:t,rangeEnd:a}=this;if(e&&t){if(W(e,t))return"range-start";if(a)return W(e,a)?"range-end":e>t&&e<a?"in-range":void 0}}__computeDayAriaSelected(e,t){return String(this.__isDaySelected(e,t))}__isMonthPending(){return!!this._dateMetadataController?.isMonthPending(this.month)}__isDayDisabled(e,t,a,i){return!N(e,t,a,i,this._dateMetadataController)}__computeDayAriaDisabled(e,t,a,i){if(void 0===e)return"false";return!!this._dateMetadataController?.provider||void 0!==t||void 0!==a||void 0!==i?String(this.__isDayDisabled(e,t,a,i)):"false"}__computeDayTabIndex(e,t){return W(e,t)?"0":"-1"}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class le extends(oe(h(n(l(t))))){static get is(){return"vaadin-month-calendar"}static get styles(){return re}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}render(){const e=this.__computeWeekDayNames(this.i18n,this.showWeekNumbers),t=this._weeks,i=!this.__computeShowWeekSeparator(this.showWeekNumbers,this.i18n);return a`
      <div part="month-header" id="month-header" aria-hidden="true">${this._getTitle(this.month,this.i18n)}</div>
      <table
        id="monthGrid"
        role="grid"
        aria-labelledby="month-header"
        @touchend="${this._preventDefault}"
        @touchstart="${this._onMonthGridTouchStart}"
      >
        <thead id="weekdays-container">
          <tr role="row" part="weekdays">
            <th part="weekday" aria-hidden="true" ?hidden="${i}"></th>
            ${e.map(e=>a`
                <th role="columnheader" part="weekday" scope="col" abbr="${e.weekDay}" aria-hidden="true">
                  ${e.weekDayShort}
                </th>
              `)}
          </tr>
        </thead>
        <tbody id="days-container">
          ${t.map(e=>a`
              <tr role="row">
                <td part="week-number" aria-hidden="true" ?hidden="${i}">
                  ${this.__computeWeekNumber(e)}
                </td>
                ${e.map(e=>a`
                    <td
                      role="gridcell"
                      part="${this.__computeDatePart(e,this.focusedDate,this.selectedDate,this.minDate,this.maxDate,this.isDateDisabled,this.enteredDate,this.__hasFocus)}"
                      .date="${e}"
                      ?disabled="${this.__isDayDisabled(e,this.minDate,this.maxDate,this.isDateDisabled)}"
                      tabindex="${this.__computeDayTabIndex(e,this.focusedDate)}"
                      aria-selected="${this.__computeDayAriaSelected(e,this.selectedDate)}"
                      aria-disabled="${this.__computeDayAriaDisabled(e,this.minDate,this.maxDate,this.isDateDisabled)}"
                      aria-label="${this.__computeDayAriaLabel(e)}"
                      >${this._getDate(e)}</td
                    >
                  `)}
              </tr>
            `)}
        </tbody>
      </table>
    `}}s(le);
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const de=e`
  :host {
    display: grid;
    grid-template-areas:
      'header header'
      'months years'
      'toolbar years';
    grid-template-columns: minmax(0, 1fr) 0;
    height: 100%;
    outline: none;
    overflow: hidden;
    position: relative;
  }

  :host([desktop]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([fullscreen][years-visible]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  [part='years-toggle-button'] {
    display: inline-flex;
    align-items: center;
    border-radius: var(--vaadin-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-text-color);
    font-size: var(--vaadin-button-font-size, inherit);
    font-weight: var(--vaadin-button-font-weight, 500);
    height: var(--vaadin-button-height, auto);
    line-height: var(--vaadin-button-line-height, inherit);
    padding: var(--vaadin-button-padding, var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container));
    cursor: var(--vaadin-clickable-cursor);
  }

  :host([years-visible]) [part='years-toggle-button'] {
    background: var(--vaadin-text-color);
    color: var(--vaadin-background-color);
  }

  [hidden] {
    display: none !important;
  }

  [part='loader'] {
    position: absolute;
    z-index: 1;
    inset-block-start: var(--vaadin-date-picker-month-header-font-size, 0.9375rem);
    inset-inline: 0;
    margin-inline: auto;
  }

  ::slotted([slot='months']) {
    --vaadin-infinite-scroller-item-height: round(
      var(--vaadin-date-picker-month-header-font-size, 0.9375rem) + 0.75rem +
        var(--vaadin-date-picker-date-height, 2rem) * 7 + var(--_vaadin-date-picker-week-numbers-visible, 0) *
        (
          var(--vaadin-date-picker-week-number-font-size, 0.7rem) * 6.25 +
            var(--vaadin-date-picker-month-padding, var(--vaadin-padding-s)) * 3
        ),
      1px
    );
  }

  :host(:not([fullscreen])) ::slotted([slot='months']) {
    border-bottom: 1px solid var(--vaadin-border-color-secondary);
  }

  ::slotted([slot='years']) {
    visibility: hidden;
    background: var(--vaadin-date-picker-year-scroller-background, var(--vaadin-background-container));
    width: var(--vaadin-date-picker-year-scroller-width, 3rem);
    box-sizing: border-box;
    border-inline-start: 1px solid
      var(--vaadin-date-picker-year-scroller-border-color, var(--vaadin-border-color-secondary));
    overflow: visible;
    min-height: 0;
    clip-path: inset(0);
  }

  ::slotted([slot='years'])::before {
    background: var(--vaadin-overlay-background, var(--vaadin-background-color));
    border: 1px solid var(--vaadin-date-picker-year-scroller-border-color, var(--vaadin-border-color-secondary));
    width: 16px;
    height: 16px;
    position: absolute;
    left: auto;
    z-index: 1;
    rotate: 45deg;
    translate: calc(-50% - 1px) -50%;
    transform: none;
  }

  :host([dir='rtl']) ::slotted([slot='years'])::before {
    translate: calc(50% + 1px) -50%;
  }

  :host([desktop]) ::slotted([slot='years']),
  :host([years-visible]) ::slotted([slot='years']) {
    visibility: visible;
  }

  [part='toolbar'] {
    display: flex;
    grid-area: toolbar;
    justify-content: space-between;
    padding: var(--vaadin-date-picker-toolbar-padding, var(--vaadin-padding-s));
  }

  :host([fullscreen]) [part='toolbar'] {
    grid-area: header;
    border-bottom: 1px solid var(--vaadin-border-color-secondary);
  }
`
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,he=e=>class extends e{static get properties(){return{scrollDuration:{type:Number,value:300},selectedDate:{type:Object,value:null,sync:!0},focusedDate:{type:Object,notify:!0,observer:"_focusedDateChanged",sync:!0},rangeStart:{type:Object,sync:!0},rangeEnd:{type:Object,sync:!0},rangePreview:{type:String,sync:!0},_hoveredDate:{type:Object,sync:!0},_calendarFocused:{type:Boolean,sync:!0},_focusedMonthDate:Number,initialPosition:{type:Object,observer:"_initialPositionChanged",sync:!0},_originDate:{type:Object,value:new Date},_visibleMonthIndex:Number,_desktopMode:{type:Boolean,observer:"_desktopModeChanged"},_desktopMediaQuery:{type:String,value:"(min-width: 375px)"},i18n:{type:Object},showWeekNumbers:{type:Boolean,value:!1},_ignoreTaps:Boolean,_notTapping:Boolean,minDate:{type:Object,sync:!0},maxDate:{type:Object,sync:!0},isDateDisabled:{type:Function},loading:{type:Boolean,value:!1,reflectToAttribute:!0},enteredDate:{type:Date,sync:!0},label:String,_cancelButton:{type:Object},_todayButton:{type:Object},_dateMetadataController:{type:Object,sync:!0},calendars:{type:Array,value:()=>[]},years:{type:Array,value:()=>[]}}}static get observers(){return["__updateCalendarsConfig(calendars, i18n, minDate, maxDate, showWeekNumbers, isDateDisabled, _theme, _dateMetadataController)","__updateCalendarsState(calendars, selectedDate, focusedDate, enteredDate, _ignoreTaps)","__updateCalendarsRange(calendars, rangeStart, rangeEnd, rangePreview, _hoveredDate, focusedDate, _calendarFocused)","__updateCancelButton(_cancelButton, i18n)","__updateYears(years, selectedDate, _theme)"]}disconnectedCallback(){super.disconnectedCallback(),this.cancelLoadVisibleDateMetadata()}updated(e){super.updated(e),e.has("loading")&&D(this,"aria-busy",this.loading),e.has("i18n")&&D(this,"aria-label",this.i18n?.dialogAccessibleName),(e.has("calendars")||e.has("_dateMetadataController"))&&this.loadVisibleDateMetadata(),(e.has("_todayButton")||e.has("i18n")||e.has("minDate")||e.has("maxDate")||e.has("isDateDisabled"))&&this.updateTodayButton()}get __useSubMonthScrolling(){return this._monthScroller.clientHeight<this._monthScroller.itemHeight+this._monthScroller.bufferOffset}get focusableDateElement(){return this.calendars.map(e=>e.focusableDateElement).find(Boolean)}_initControllers(){this.addController(new C(this._desktopMediaQuery,e=>{this._desktopMode=e})),this.addController(new b(this,"today-button","vaadin-button",{observe:!1,initializer:e=>{e.setAttribute("theme","tertiary"),e.addEventListener("keydown",e=>this.__onTodayButtonKeyDown(e)),e.addEventListener("click",this._onTodayTap.bind(this)),this._todayButton=e}})),this.addController(new b(this,"cancel-button","vaadin-button",{observe:!1,initializer:e=>{e.setAttribute("theme","tertiary"),e.addEventListener("keydown",e=>this.__onCancelButtonKeyDown(e)),e.addEventListener("click",this._cancel.bind(this)),this._cancelButton=e}})),this.__initMonthScroller(),this.__initYearScroller()}reset(){this._closeYearScroller(),this._monthScroller?.reset(),this._yearScroller?.reset()}focusCancel(){this._cancelButton.focus()}scrollToDate(e,t){const a=this.__useSubMonthScrolling?this._calculateWeekScrollOffset(e):0;this._scrollToPosition(this._differenceInMonths(e,this._originDate)+a,t),this._monthScroller.forceUpdate()}__initMonthScroller(){this.addController(new b(this,"months","vaadin-date-picker-month-scroller",{observe:!1,initializer:e=>{e.addEventListener("custom-scroll",()=>{this._onMonthScroll()}),e.addEventListener("touchstart",()=>{this._onMonthScrollTouchStart()}),e.addEventListener("keydown",e=>{this.__onMonthCalendarKeyDown(e)}),e.addEventListener("mousemove",e=>{const t=e.composedPath()[0].date||null;W(t,this._hoveredDate)||(this._hoveredDate=t)}),e.addEventListener("mouseleave",()=>{this._hoveredDate=null}),e.addEventListener("focusin",()=>{this._calendarFocused=!0}),e.addEventListener("focusout",()=>{this._calendarFocused=!1}),e.addEventListener("init-done",()=>{const e=[...this.querySelectorAll("vaadin-month-calendar")];e.forEach(e=>{e.addEventListener("selected-date-changed",e=>{this.selectedDate=e.detail.value})}),this.calendars=e}),this._monthScroller=e}}))}__initYearScroller(){this.addController(new b(this,"years","vaadin-date-picker-year-scroller",{observe:!1,initializer:e=>{e.setAttribute("aria-hidden","true"),k(e,"tap",e=>{this._onYearTap(e)}),e.addEventListener("custom-scroll",()=>{this._onYearScroll()}),e.addEventListener("touchstart",()=>{this._onYearScrollTouchStart()}),e.addEventListener("init-done",()=>{this.years=[...this.querySelectorAll("vaadin-date-picker-year")]}),this._yearScroller=e}}))}__updateCancelButton(e,t){e&&(e.textContent=t?.cancel)}updateTodayButton(){const e=this._todayButton;e&&(e.textContent=this.i18n?.today,e.disabled=!this._isTodayAllowed())}loadVisibleDateMetadata(){const e=this._dateMetadataController;if(!e)return;const t=(this.calendars??[]).map(e=>e.month).filter(Boolean).map(e=>j(e));0!==t.length&&e.ensureRangeLoaded(Y(Math.min(...t)),Y(Math.max(...t)))}cancelLoadVisibleDateMetadata(){this._loadDateMetadataDebouncer?.cancel()}__updateCalendarsConfig(e,t,a,i,n,s,r,o){e?.length&&e.forEach(e=>{e.i18n=t,e.minDate=a,e.maxDate=i,e.isDateDisabled=s,e._dateMetadataController=o,o?.subscribe(e),e.showWeekNumbers=n,D(e,"theme",r)})}__scheduleLoadVisibleDateMetadata(){this._loadDateMetadataDebouncer=m.debounce(this._loadDateMetadataDebouncer,g.after(200),()=>this.loadVisibleDateMetadata())}__updateCalendarsState(e,t,a,i,n){e?.length&&e.forEach(e=>{e.focusedDate=a,e.selectedDate=t,e.enteredDate=i,e.ignoreTaps=n})}__updateCalendarsRange(e,t,a,i,n,s,r){if(!e?.length)return;let o=t,l=a;const d=n||(r?s:null);d&&"end"===i&&t&&d>=t?l=d:d&&"start"===i&&a&&d<=a&&(o=d),e.forEach(e=>{e.rangeStart=o,e.rangeEnd=l,e.rangeEditing=i})}__updateYears(e,t,a){e?.length&&e.forEach(e=>{e.selectedDate=t,D(e,"theme",a)})}_selectDate(e){return!!this._dateSelectable(e)&&(this.selectedDate=e,this.dispatchEvent(new CustomEvent("date-selected",{detail:{date:e},bubbles:!0,composed:!0})),!0)}_desktopModeChanged(e){this.toggleAttribute("desktop",e)}_focusedDateChanged(e){this.revealDate(e)}revealDate(e,t=!0){if(!e)return;const a=this._differenceInMonths(e,this._originDate);if(this.__useSubMonthScrolling){const i=this._calculateWeekScrollOffset(e);return void this._scrollToPosition(a+i,t)}const i=this._monthScroller.position>a,n=Math.max(this._monthScroller.itemHeight,this._monthScroller.clientHeight-2*this._monthScroller.bufferOffset)/this._monthScroller.itemHeight,s=this._monthScroller.position+n-1<a;i?this._scrollToPosition(a,t):s&&this._scrollToPosition(a-n+1,t)}_calculateWeekScrollOffset(e){const t=V(e);let a=0;for(;t.getDate()<e.getDate();)t.setDate(t.getDate()+1),t.getDay()===this.i18n.firstDayOfWeek&&(a+=1);return a/6}_initialPositionChanged(e){this._monthScroller&&this._yearScroller&&(this._monthScroller.active=!0,this._yearScroller.active=!0),this.scrollToDate(e)}_repositionYearScroller(){const e=this._monthScroller.position;this._visibleMonthIndex=Math.floor(e),this._yearScroller.position=(e+this._originDate.getMonth())/12,this.__scheduleLoadVisibleDateMetadata()}_repositionMonthScroller(){this._monthScroller.position=12*this._yearScroller.position-this._originDate.getMonth(),this._visibleMonthIndex=Math.floor(this._monthScroller.position),this.__scheduleLoadVisibleDateMetadata()}_onMonthScroll(){this._repositionYearScroller(),this._doIgnoreTaps()}_onYearScroll(){this._repositionMonthScroller(),this._doIgnoreTaps()}_onYearScrollTouchStart(){this._notTapping=!1,setTimeout(()=>{this._notTapping=!0},300),this._repositionMonthScroller()}_onMonthScrollTouchStart(){this._repositionYearScroller()}_doIgnoreTaps(){this._ignoreTaps=!0,this._debouncer=m.debounce(this._debouncer,g.after(300),()=>{this._ignoreTaps=!1})}_onTodayTap(){const e=this._getTodayMidnight();Math.abs(this._monthScroller.position-this._differenceInMonths(e,this._originDate))<.001?(this._selectDate(e),this._close()):this._scrollToCurrentMonth()}_scrollToCurrentMonth(){this.focusedDate&&(this.focusedDate=new Date),this.scrollToDate(new Date,!0)}_onYearTap(e){if(!this._ignoreTaps&&!this._notTapping){const t=(e.detail.y-(this._yearScroller.getBoundingClientRect().top+this._yearScroller.clientHeight/2))/this._yearScroller.itemHeight;this._scrollToPosition(this._monthScroller.position+12*t,!0)}}_scrollToPosition(e,t){if(void 0!==this._targetPosition)return void(this._targetPosition=e);if(!t)return this._monthScroller.position=e,this._monthScroller.forceUpdate(),this._targetPosition=void 0,this._repositionYearScroller(),void this.__tryFocusDate();let a;this._targetPosition=e,this._revealPromise=new Promise(e=>{a=e});let i=0;const n=this._monthScroller.position,s=e=>{i||(i=e);const t=e-i;if(t<this.scrollDuration){const e=(r=t,o=n,l=this._targetPosition-n,d=this.scrollDuration,(r/=d/2)<1?l/2*r*r+o:-l/2*((r-=1)*(r-2)-1)+o);this._monthScroller.position=e,window.requestAnimationFrame(s)}else this.dispatchEvent(new CustomEvent("scroll-animation-finished",{bubbles:!0,composed:!0,detail:{position:this._targetPosition,oldPosition:n}})),this._monthScroller.position=this._targetPosition,this._monthScroller.forceUpdate(),this._targetPosition=void 0,a(),this._revealPromise=void 0;var r,o,l,d;setTimeout(this._repositionYearScroller.bind(this),1)};window.requestAnimationFrame(s)}_toggleYearScroller(){this.toggleAttribute("years-visible")}_closeYearScroller(){this.removeAttribute("years-visible")}_yearAfterXMonths(e){return U(e).getFullYear()}_differenceInMonths(e,t){return j(e)-j(t)}_clear(){this._selectDate("")}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_cancel(){this.focusedDate=this.selectedDate,this._close()}__toggleDate(e){W(e,this.selectedDate)?(this._clear(),this.focusedDate=e):this._selectDate(e)}__onMonthCalendarKeyDown(e){let t=!1;switch(e.key){case"ArrowDown":this._moveFocusByDays(7),t=!0;break;case"ArrowUp":this._moveFocusByDays(-7),t=!0;break;case"ArrowRight":this._moveFocusByDays(this.__isRTL?-1:1),t=!0;break;case"ArrowLeft":this._moveFocusByDays(this.__isRTL?1:-1),t=!0;break;case"Enter":this._selectDate(this.focusedDate)&&(this._close(),t=!0);break;case" ":this.__toggleDate(this.focusedDate),t=!0;break;case"Home":this._moveFocusInsideMonth(this.focusedDate,"minDate"),t=!0;break;case"End":this._moveFocusInsideMonth(this.focusedDate,"maxDate"),t=!0;break;case"PageDown":this._moveFocusByMonths(e.shiftKey?12:1),t=!0;break;case"PageUp":this._moveFocusByMonths(e.shiftKey?-12:-1),t=!0;break;case"Tab":this._onTabKeyDown(e,"calendar")}t&&(e.preventDefault(),e.stopPropagation())}_onTabKeyDown(e,t){switch(e.stopPropagation(),t){case"calendar":e.shiftKey&&(e.preventDefault(),this.hasAttribute("fullscreen")?this.focusCancel():this.__focusInput());break;case"today":e.shiftKey&&(e.preventDefault(),this.focusDateElement());break;case"cancel":e.shiftKey||(e.preventDefault(),this.hasAttribute("fullscreen")?this.focusDateElement():this.__focusInput())}}__onTodayButtonKeyDown(e){"Tab"===e.key&&this._onTabKeyDown(e,"today")}__onCancelButtonKeyDown(e){"Tab"===e.key&&this._onTabKeyDown(e,"cancel")}__focusInput(){this.dispatchEvent(new CustomEvent("focus-input",{bubbles:!0,composed:!0}))}__tryFocusDate(){if(this.__pendingDateFocus){const e=this.focusableDateElement;e&&W(e.date,this.__pendingDateFocus)&&(delete this.__pendingDateFocus,e.focus())}}async focusDate(e,t){const a=e||this.selectedDate||this.initialPosition||new Date;this.focusedDate=a,t||(this._focusedMonthDate=a.getDate()),await this.focusDateElement(!1)}async focusDateElement(e=!0){this.__pendingDateFocus=this.focusedDate,this.calendars.length||await new Promise(e=>{requestAnimationFrame(()=>{setTimeout(()=>{e()})})}),e&&this.revealDate(this.focusedDate),this._revealPromise&&await this._revealPromise,this.__tryFocusDate()}_focusClosestDate(e){this.focusDate(z(e,[this.minDate,this.maxDate]))}_focusAllowedDate(e,t,a){this._dateAllowed(e,void 0,void 0,()=>!1)?this.focusDate(e,a):this._dateAllowed(this.focusedDate)?t>0?this.focusDate(this.maxDate):this.focusDate(this.minDate):this._focusClosestDate(this.focusedDate)}_getDateDiff(e,t){return P(this.focusedDate.getFullYear(),this.focusedDate.getMonth()+e,t?this.focusedDate.getDate()+t:1)}_moveFocusByDays(e){const t=this._getDateDiff(0,e);this._focusAllowedDate(t,e,!1)}_moveFocusByMonths(e){const t=this._getDateDiff(e),a=t.getMonth();this._focusedMonthDate||(this._focusedMonthDate=this.focusedDate.getDate()),t.setDate(this._focusedMonthDate),t.getMonth()!==a&&t.setDate(0),this._focusAllowedDate(t,e,!0)}_moveFocusInsideMonth(e,t){const a="minDate"===t?V(e):B(e);this._dateAllowed(a)?this.focusDate(a):this._dateAllowed(e)?this.focusDate(this[t]):this._focusClosestDate(e)}_dateAllowed(e,t=this.minDate,a=this.maxDate,i=this.isDateDisabled){return R(e,t,a,i)}_dateSelectable(e){return N(e,this.minDate,this.maxDate,this.isDateDisabled,this._dateMetadataController)}_isTodayAllowed(){return this._dateSelectable(this._getTodayMidnight())}_getTodayMidnight(){const e=new Date;return P(e.getFullYear(),e.getMonth(),e.getDate())}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ce extends(he(h(i(n(l(t)))))){static get is(){return"vaadin-date-picker-overlay-content"}static get styles(){return[w,de]}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}render(){return a`
      <slot name="months"></slot>
      <slot name="years"></slot>

      <div part="loader" aria-hidden="true"></div>

      <div role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <div
          part="years-toggle-button"
          ?hidden="${this._desktopMode}"
          aria-hidden="true"
          @click="${this._toggleYearScroller}"
        >
          ${this._yearAfterXMonths(this._visibleMonthIndex)}
        </div>
        <slot name="cancel-button"></slot>
      </div>
    `}firstUpdated(){super.firstUpdated(),this.setAttribute("role","dialog"),this._initControllers()}}s(ce);
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ue=e`
  :host([opened]) {
    pointer-events: auto;
  }

  :host([week-numbers]) {
    --_vaadin-date-picker-week-numbers-visible: 1;
  }

  :host([dir='rtl']) [part='input-field'] {
    direction: ltr;
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
    direction: rtl;
    text-align: left;
  }

  [part~='toggle-button']::before {
    mask-image: var(--_vaadin-icon-calendar);
  }

  :host([readonly]) [part~='toggle-button'] {
    display: none;
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class _e{constructor(e){this.host=e,e.addEventListener("opened-changed",()=>{e.opened||this.#e(!1)}),e.addEventListener("blur",()=>this.#e(!0)),e.addEventListener("touchstart",()=>this.#e(!0))}#e(e){this.host.inputElement&&(this.host.inputElement.inputMode=e?"":"none")}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function pe(e){return 12*Math.floor(e/12)}const me=Object.freeze({pending:!0});function ge(e,t){const a=new Map(e.map(e=>[e,new Map]));return Array.isArray(t)?t.forEach(e=>{const t=function(e){return"string"==typeof e?.date?G(e.date):void 0}(e);t?a.get(j(t))?.set(t.getDate(),e):d("Ignored `dateMetadataProvider` entries whose `date` is not an ISO 8601 date.")}):null!=t&&d("Expected `dateMetadataProvider` to return an array of date metadata objects."),a}class fe{host;provider=null;#t;#a=new Map;#i=new Set;#n=0;#s;constructor(e,t){this.host=e,this.#t=t}hostConnected(){this.#r()}subscribe(e){this.#i.add(e)}isLoading(){for(const{pending:e}of this.#a.values())if(e)return!0;return!1}setProvider(e){const t=e??null;this.provider!==t&&(this.provider=t,this.clearCache())}clearCache(){this.#a.clear(),this.#n+=1,this.#r()}isMonthLoaded(e){return!!this.#o(e)}isMonthPending(e){return!!e&&!!this.#a.get(j(e))?.pending}getMetadata(e){return this.#o(e)?.entries.get(e.getDate())}isDateDisabled(e){return!!this.getMetadata(e)?.disabled}ensureRangeLoaded(e,t){if(!this.provider||!e||!t)return;const a=pe(j(e)),i=pe(j(t))+12-1,n=[];for(let e=a;e<=i;e++)this.#a.has(e)||n.push(e);n.length>0&&this.#l(n)}#o(e){const t=e&&this.#a.get(j(e));return t&&!t.pending?t:void 0}async#l(e){const t=this.#n;e.forEach(e=>this.#a.set(e,me)),this.#r();const a={start:J(Y(e[0])),end:J(B(Y(e.at(-1))))};let i;try{const t=await this.provider(a);i=ge(e,t)}catch(e){console.error(e)}t===this.#n&&(e.forEach(e=>{i?this.#a.set(e,{pending:!1,entries:i.get(e)}):this.#a.delete(e)}),this.#r())}#r(){this.#i.forEach(e=>e.requestUpdate()),this.#t&&(this.#s=m.debounce(this.#s,f,()=>{this.host.isConnected&&this.#t()}))}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ve=Object.freeze({monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],firstDayOfWeek:0,today:"Today",cancel:"Cancel",dialogAccessibleName:"Calendar",referenceDate:"",formatDate(e){const t=String(e.year).replace(/\d+/u,e=>"0000".substr(e.length)+e);return[e.month+1,e.day,t].join("/")},parseDate(e){const t=e.split("/"),a=new Date;let i,n=a.getMonth(),s=a.getFullYear();if(3===t.length){if(n=parseInt(t[0])-1,i=parseInt(t[1]),s=parseInt(t[2]),t[2].length<3&&s>=0){s=function(e,t,a=0,i=1){if(t>99)throw new Error("The provided year cannot have more than 2 digits.");if(t<0)throw new Error("The provided year cannot be negative.");let n=t+100*Math.floor(e.getFullYear()/100);return e<new Date(n-50,a,i)?n-=100:e>new Date(n+50,a,i)&&(n+=100),n}(G(this.referenceDate)||new Date,s,n,i)}}else 2===t.length?(n=parseInt(t[0])-1,i=parseInt(t[1])):1===t.length&&(i=parseInt(t[0]));if(void 0!==i)return{day:i,month:n,year:s}},formatTitle:(e,t)=>`${e} ${t}`}),be=e=>class extends(T(M(F(E(e))))){static get properties(){return{_selectedDate:{type:Object,sync:!0},_focusedDate:{type:Object,sync:!0},value:{type:String,notify:!0,value:"",sync:!0},initialPosition:{type:String},opened:{type:Boolean,reflectToAttribute:!0,notify:!0,observer:"_openedChanged",sync:!0},autoOpenDisabled:{type:Boolean,sync:!0},showWeekNumbers:{type:Boolean,value:!1,sync:!0},_fullscreen:{type:Boolean,value:!1,sync:!0},_fullscreenMediaQuery:{value:"(max-width: 450px), (max-height: 450px)"},min:{type:String,sync:!0},max:{type:String,sync:!0},isDateDisabled:{type:Function},dateMetadataProvider:{type:Function},_minDate:{type:Date,computed:"__computeMinOrMaxDate(min)"},_maxDate:{type:Date,computed:"__computeMinOrMaxDate(max)"},_noInput:{type:Boolean,computed:"_isNoInput(inputElement, _fullscreen, _ios, __effectiveI18n, opened, autoOpenDisabled)"},_ios:{type:Boolean,value:x},_focusOverlayOnOpen:Boolean,_overlayContent:{type:Object,sync:!0},__enteredDate:{type:Date,sync:!0}}}static get observers(){return["_selectedDateChanged(_selectedDate, __effectiveI18n)","_focusedDateChanged(_focusedDate, __effectiveI18n)","__updateOverlayContent(_overlayContent, __effectiveI18n, label, _minDate, _maxDate, _focusedDate, _selectedDate, showWeekNumbers, isDateDisabled, __enteredDate)","__updateOverlayContentTheme(_overlayContent, _theme)","__updateOverlayContentFullScreen(_overlayContent, _fullscreen)"]}static get defaultI18n(){return ve}static get constraints(){return[...super.constraints,"min","max","dateMetadataProvider"]}constructor(){super(),this._boundOnClick=this._onClick.bind(this),this._boundOnScroll=this._onScroll.bind(this),this._dateMetadataController=new fe(this,()=>this.__onDateMetadataChanged()),this.addController(this._dateMetadataController)}get i18n(){return super.i18n}set i18n(e){super.i18n=e}get _inputElementValue(){return super._inputElementValue}set _inputElementValue(e){super._inputElementValue=e;const t=this.__parseDate(e);this.__setEnteredDate(t)}get __unparsableValue(){return!this._inputElementValue||this.__parseDate(this._inputElementValue)?"":this._inputElementValue}_onFocus(e){super._onFocus(e),this._noInput&&!u()&&(this.__ignoreInternalBlur=!0,e.target.blur(),this.__ignoreInternalBlur=!1)}_onBlur(e){super._onBlur(e),this.__ignoreInternalBlur||this.opened||(this.__commitParsedOrFocusedDate(),document.hasFocus()&&this._requestValidation())}ready(){super.ready(),this.addEventListener("click",this._boundOnClick),this.addController(new C(this._fullscreenMediaQuery,e=>{this._fullscreen=e})),this.addController(new _e(this)),this._overlayElement=this.$.overlay}updated(e){super.updated(e),e.has("dateMetadataProvider")&&(this._dateMetadataController.setProvider(this.dateMetadataProvider),this.__reloadDateMetadata()),(e.has("showWeekNumbers")||e.has("__effectiveI18n"))&&this.toggleAttribute("week-numbers",this.showWeekNumbers&&1===this.__effectiveI18n.firstDayOfWeek)}disconnectedCallback(){super.disconnectedCallback(),this.opened=!1}focus(e){this._noInput&&!u()?this.open():super.focus(e)}open(){this.disabled||this.readonly||(this.opened=!0)}close(){this.$.overlay.close()}clearCache(){this._dateMetadataController.clearCache(),this.__reloadDateMetadata()}__reloadDateMetadata(){this.opened&&this._overlayContent?.loadVisibleDateMetadata(),this.__ensureSelectedDateLoaded()}__ensureContent(){if(this._overlayContent)return;const e=document.createElement("vaadin-date-picker-overlay-content");e.setAttribute("slot","overlay"),this.appendChild(e),this._overlayContent=e,e.addEventListener("close",()=>{this._close()}),e.addEventListener("focus-input",this._focusAndSelect.bind(this)),e.addEventListener("date-tap",e=>{this.__commitDate(e.detail.date),this._close()}),e.addEventListener("date-selected",e=>{this.__commitDate(e.detail.date)}),e.addEventListener("focusin",()=>{this._keyboardActive&&this._setFocused(!0)}),e.addEventListener("focusout",e=>{this._shouldRemoveFocus(e)&&this._setFocused(!1)}),e.addEventListener("focused-date-changed",e=>{this._focusedDate=e.detail.value}),e.addEventListener("click",e=>e.stopPropagation())}__parseDate(e){if(!this.__effectiveI18n.parseDate)return;let t=this.__effectiveI18n.parseDate(e);return t&&(t=G(`${t.year}-${t.month+1}-${t.day}`)),t&&!isNaN(t.getTime())?t:void 0}__formatDate(e){if(this.__effectiveI18n.formatDate)return this.__effectiveI18n.formatDate(H(e))}checkValidity(){const e=this._inputElementValue,t=!e||!!this._selectedDate&&e===this.__formatDate(this._selectedDate),a=!this._selectedDate||N(this._selectedDate,this._minDate,this._maxDate,this.isDateDisabled,this._dateMetadataController);let i=!0;return this.inputElement&&this.inputElement.checkValidity&&(i=this.inputElement.checkValidity()),t&&a&&i}__ensureSelectedDateLoaded(){const e=this._dateMetadataController,t=!(!e?.provider||!this._selectedDate||e.isMonthLoaded(this._selectedDate));this.__awaitingProviderValidation=t,t&&e.ensureRangeLoaded(this._selectedDate,this._selectedDate)}__onDateMetadataChanged(){const e=this._dateMetadataController;this._overlayContent&&(this._overlayContent.loading=e.isLoading(),this._overlayContent.updateTodayButton()),this.__awaitingProviderValidation&&this._selectedDate&&e.isMonthLoaded(this._selectedDate)&&(this.__awaitingProviderValidation=!1,this._requestValidation())}_shouldSetFocus(e){return!this._shouldKeepFocusRing}_shouldKeepFocusOnClearMousedown(){return!!this.opened||super._shouldKeepFocusOnClearMousedown()}_shouldRemoveFocus(e){const{relatedTarget:t}=e;return!(!this.opened||null===t||t===document.body||this.contains(t)||this._overlayContent.contains(t))||!this.opened}_setFocused(e){super._setFocused(e),this._shouldKeepFocusRing=e&&this._keyboardActive}__commitValueChange(){const e=this.__unparsableValue;this.__committedValue!==this.value?(this._requestValidation(),this.dispatchEvent(new CustomEvent("change",{bubbles:!0}))):this.__committedUnparsableValue!==e&&(this._requestValidation(),this.dispatchEvent(new CustomEvent("unparsable-change"))),this.__committedValue=this.value,this.__committedUnparsableValue=e}__commitDate(e){this.__keepCommittedValue=!0,this._selectedDate=e,this.__keepCommittedValue=!1,this.__commitValueChange()}_close(){this._focus(),this.close()}_isNoInput(e,t,a,i,n,s){return!e||t&&(!s||n)||a&&n||!i.parseDate}_formatISO(e){return J(e)}_inputElementChanged(e){super._inputElementChanged(e),e&&(e.autocomplete="off",e.setAttribute("role","combobox"),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded",!!this.opened),this._applyInputValue(this._selectedDate))}_openedChanged(e){e&&this.__ensureContent(),this.inputElement&&this.inputElement.setAttribute("aria-expanded",e)}_selectedDateChanged(e,t){void 0!==e&&void 0!==t&&(this.__keepInputValue||this._applyInputValue(e),this.value=this._formatISO(e),this._ignoreFocusedDateChange=!0,this._focusedDate=e,this._ignoreFocusedDateChange=!1,this.__ensureSelectedDateLoaded())}_focusedDateChanged(e,t){void 0!==e&&void 0!==t&&(this._ignoreFocusedDateChange||this._noInput||this._applyInputValue(e))}_valueChanged(e,t){const a=G(e);!e||a?(e?W(this._selectedDate,a)||(this._selectedDate=a,void 0!==t&&this._requestValidation()):this._selectedDate=null,this.__keepCommittedValue||(this.__committedValue=this.value,this.__committedUnparsableValue=""),this._toggleHasValue(this._hasValue)):this.value=t}__updateOverlayContent(e,t,a,i,n,s,r,o,l,d){e&&(e._dateMetadataController=this._dateMetadataController,e.i18n=t,e.label=a,e.minDate=i,e.maxDate=n,e.focusedDate=s,e.selectedDate=r,e.showWeekNumbers=o,e.isDateDisabled=l,e.enteredDate=d)}__updateOverlayContentTheme(e,t){e&&D(e,"theme",t)}__updateOverlayContentFullScreen(e,t){e&&e.toggleAttribute("fullscreen",t)}_onOverlayEscapePress(e){e.stopPropagation(),this._focusedDate=this._selectedDate,this._applyInputValue(this._selectedDate),this._close()}_onOverlayOpened(){const e=this._overlayContent;e.reset();const t=this._getInitialPosition();e.initialPosition=t;const a=e.focusedDate||t;e.scrollToDate(a),this._ignoreFocusedDateChange=!0,e.focusedDate=a,this._ignoreFocusedDateChange=!1,window.addEventListener("scroll",this._boundOnScroll,!0),this._focusOverlayOnOpen?(e.focusDateElement(),this._focusOverlayOnOpen=!1):this._focus();const i=this.inputElement;this._noInput&&i&&(i.blur(),this._overlayContent.focusDateElement());const n=this._noInput?e:this;this.__showOthers=S(n)}_getInitialPosition(){const e=G(this.initialPosition),t=this._selectedDate||this._overlayContent.initialPosition||e||new Date;return e||R(t,this._minDate,this._maxDate,this.isDateDisabled)?t:this._minDate||this._maxDate?z(t,[this._minDate,this._maxDate]):new Date}__commitParsedOrFocusedDate(){if(this._ignoreFocusedDateChange=!0,this.__effectiveI18n.parseDate){const e=this._inputElementValue||"",t=this.__parseDate(e);t?this.__commitDate(t):(this.__keepInputValue=!0,this.__commitDate(null),this.__keepInputValue=!1)}else this._focusedDate&&this.__commitDate(this._focusedDate);this._ignoreFocusedDateChange=!1}_onOverlayClosed(){this._overlayContent?.cancelLoadVisibleDateMetadata(),this.__showOthers&&(this.__showOthers(),this.__showOthers=null),window.removeEventListener("scroll",this._boundOnScroll,!0),this.__commitParsedOrFocusedDate(),this.inputElement&&this.inputElement.selectionStart&&(this.inputElement.selectionStart=this.inputElement.selectionEnd),this.value||this._keyboardActive||this._requestValidation(),this.inputElement&&_(this.inputElement)||this._setFocused(!1)}_onScroll(e){e.target!==window&&this._overlayContent.contains(e.target)||this._overlayContent._repositionYearScroller()}_focus(){this._noInput||this.inputElement.focus()}_focusAndSelect(){this._focus(),this._setSelectionRange(0,this._inputElementValue.length)}_applyInputValue(e){this._inputElementValue=e?this.__formatDate(e):""}_setSelectionRange(e,t){this.inputElement&&this.inputElement.setSelectionRange(e,t)}_onChange(e){e.stopPropagation()}_onClick(e){e.composedPath().includes(this._overlayElement)||this._isClearButton(e)||this._onHostClick(e)}_onHostClick(e){this.autoOpenDisabled&&!this._noInput||(e.preventDefault(),this.open())}_onClearButtonClick(e){e.preventDefault(),this.__commitDate(null)}_onKeyDown(e){if(super._onKeyDown(e),this._noInput){-1===["Tab","Escape"].indexOf(e.key)&&e.preventDefault()}switch(e.key){case"ArrowDown":case"ArrowUp":e.preventDefault(),this.opened?this._overlayContent.focusDateElement():(this._focusOverlayOnOpen=!0,this.open());break;case"Tab":this.opened&&(e.preventDefault(),e.stopPropagation(),this._setSelectionRange(0,0),e.shiftKey?this._overlayContent.focusCancel():this._overlayContent.focusDateElement())}}_onEnter(e){e.composedPath().includes(this._overlayContent)||(this.opened?this.close():this.__commitParsedOrFocusedDate())}_onEscape(e){if(!this.opened)return this.clearButtonVisible&&this.value&&!this.readonly?(e.stopPropagation(),void this._onClearButtonClick(e)):void(""===this.inputElement.value?this.__commitDate(null):this._applyInputValue(this._selectedDate));this._onOverlayEscapePress(e)}_isClearButton(e){return e.composedPath()[0]===this.clearElement}_onInput(){this.opened||!this._inputElementValue||this.autoOpenDisabled||this.open();const e=this.__parseDate(this._inputElementValue||"");e&&(this._ignoreFocusedDateChange=!0,W(e,this._focusedDate)||(this._focusedDate=e),this._ignoreFocusedDateChange=!1),this.__setEnteredDate(e)}__setEnteredDate(e){e?W(this.__enteredDate,e)||(this.__enteredDate=e):this.__enteredDate=null}__computeMinOrMaxDate(e){return G(e)}};export{be as D,ve as a,W as b,G as c,ue as d,J as e,Z as f,N as g,R as h,z as i,H as j,$ as n,Q as p};
