import"./style-props-CNAjUT68.js";import{i as e}from"./lit-element-auhBwOEL.js";import{o as t}from"./vaadin-overlay-animation-base-styles-DYKIAtXf.js";import{c as s}from"./browser-utils-C937ySgG.js";import{m as o}from"./event-utils-DwKz1-tV.js";import{c as i,b as n,g as r,a,i as d}from"./focus-utils-Cdox8WfX.js";import{F as l}from"./focus-trap-controller-Dk0CltKN.js";
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const h=[e`
  :host {
    z-index: 200;
    position: fixed;

    /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

    /* Default position constraints. Themes can
          override this to adjust the gap between the overlay and the viewport. */
    inset: max(env(safe-area-inset-top, 0px), var(--vaadin-overlay-viewport-inset, 8px))
      max(env(safe-area-inset-right, 0px), var(--vaadin-overlay-viewport-inset, 8px))
      max(env(safe-area-inset-bottom, 0px), var(--vaadin-overlay-viewport-bottom))
      max(env(safe-area-inset-left, 0px), var(--vaadin-overlay-viewport-inset, 8px));

    /* Override native [popover] user agent styles */
    width: auto;
    height: auto;
    border: none;
    padding: 0;
    background-color: transparent;
    overflow: visible;

    /* Use flexbox alignment for the overlay part. */
    display: flex;
    flex-direction: column; /* makes dropdowns sizing easier */
    /* Align to center by default. */
    align-items: center;
    justify-content: center;

    /* Allow centering when max-width/max-height applies. */
    margin: auto;

    /* The host is not clickable, only the overlay part is. */
    pointer-events: none;

    /* Remove tap highlight on touch devices. */
    -webkit-tap-highlight-color: transparent;

    /* CSS API for host */
    --vaadin-overlay-viewport-bottom: 8px;
  }

  :host([hidden]),
  :host(:not([opened]):not([closing])),
  :host(:not([opened]):not([closing])) [part='overlay'] {
    display: none !important;
  }

  :host([suppressed]) [part='overlay'],
  :host([suppressed]) ::slotted(*) {
    pointer-events: none !important;
  }

  [part='overlay'] {
    color: var(--vaadin-overlay-text-color, var(--vaadin-text-color));
    background: var(--vaadin-overlay-background, var(--vaadin-background-color));
    border: var(--vaadin-overlay-border-width, 1px) solid
      var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-overlay-border-radius, var(--vaadin-radius-m));
    box-shadow: var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3));
    box-sizing: border-box;
    max-width: 100%;
    overflow: auto;
    overscroll-behavior: contain;
    pointer-events: auto;
    -webkit-tap-highlight-color: initial;

    /* CSS reset for font styles */
    font: initial;
    letter-spacing: initial;
    text-align: initial;
    text-decoration: initial;
    text-indent: initial;
    text-transform: initial;
    user-select: text;
    white-space: initial;
    word-spacing: initial;

    /* Inherit font-family */
    font-family: inherit;
  }

  [part='backdrop'] {
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    content: '';
    inset: 0;
    pointer-events: auto;
    position: fixed;
    z-index: -1;
  }

  [part='overlay']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      border: 3px solid !important;
    }
  }
`,t];
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class c{saveFocus(e){this.focusNode=e||i()}restoreFocus(e){const t=this.focusNode;if(!t)return;const s={preventScroll:!!e&&e.preventScroll,focusVisible:!!e&&e.focusVisible};i()===document.body?setTimeout(()=>t.focus(s)):t.focus(s),this.focusNode=null}}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const u=e=>class extends e{static get properties(){return{focusTrap:{type:Boolean,value:!1},autofocus:{type:Boolean,value:!1},restoreFocusOnClose:{type:Boolean,value:!1},restoreFocusNode:{type:HTMLElement}}}static get manageFocus(){return!0}constructor(){super(),this.__manageFocus=this.constructor.manageFocus,this.__manageFocus&&(this.__focusTrapController=new l(this),this.__focusRestorationController=new c)}get _contentRoot(){return this}ready(){super.ready(),this.__manageFocus&&(this.addController(this.__focusTrapController),this.addController(this.__focusRestorationController))}get _focusRoot(){return this.$.overlay}_resetFocus(){if(this.__manageFocus&&(this.focusTrap&&this.__focusTrapController.releaseFocus(),this.restoreFocusOnClose&&this._shouldRestoreFocus())){const e=d(),t=!e;this.__focusRestorationController.restoreFocus({preventScroll:t,focusVisible:e})}}_saveFocus(){this.__manageFocus&&this.restoreFocusOnClose&&this.__focusRestorationController.saveFocus(this.restoreFocusNode)}_initFocus(){if(!this.__manageFocus||n(this._focusRoot))return;const e=r(this._focusRoot);if(!e.some(a)){const t=e.find(e=>this.#e(e))??(this.autofocus?e[0]:null);t?.focus({focusVisible:d()})}this.focusTrap&&this.__focusTrapController.trapFocus(this._focusRoot)}_shouldRestoreFocus(){const e=i();return e===document.body||this._deepContains(e)}_deepContains(e){if(this._contentRoot.contains(e))return!0;let t=e;const s=e.ownerDocument;for(;t&&t!==s&&t!==this._contentRoot;)t=t.parentNode||t.host;return t===this._contentRoot}#e(e){const t=this._focusRoot;let s=e;for(;s&&s!==t&&s!==this;){if(s.autofocus&&(s===e||customElements.get(s.localName)))return!0;s=s.assignedSlot||s.parentNode||s.host}return!1}},p=new Set,v=()=>[...p].filter(e=>!e.hasAttribute("closing")),_=e=>{const t=v(),s=t.indexOf(e);return-1===s?[]:t.slice(s+1)},m=(e,t)=>e._deepContains(t),f=(e,t=e=>!0)=>e===v().filter(t).pop(),b=e=>class extends e{get _last(){return f(this)}get _isAttached(){return p.has(this)}bringToFront(){if(f(this))return;const e=_(this),t=e.filter(e=>e._hasOverlayPositionMixin&&m(this,e));t.length!==e.length&&[this,...t].forEach(e=>{e.matches(":popover-open")&&(e.hidePopover(),e.showPopover()),e._removeAttachedInstance(),e._appendAttachedInstance()})}_enterModalState(){"none"!==document.body.style.pointerEvents&&(this._previousDocumentPointerEvents=document.body.style.pointerEvents,document.body.style.pointerEvents="none"),v().forEach(e=>{e!==this&&e.toggleAttribute("suppressed",!0)})}_exitModalState(){void 0!==this._previousDocumentPointerEvents&&(document.body.style.pointerEvents=this._previousDocumentPointerEvents,delete this._previousDocumentPointerEvents);const e=v();let t;for(;(t=e.pop())&&(t===this||(t.toggleAttribute("suppressed",!1),t.modeless)););}_appendAttachedInstance(){p.add(this)}_removeAttachedInstance(){this._isAttached&&p.delete(this)}};
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function g(e,t){let s,o=null;const i=document.documentElement;function n(){s&&clearTimeout(s),o?.disconnect(),o=null}return function r(a=!1,d=1){n();const{left:l,top:h,width:c,height:u}=e.getBoundingClientRect();if(a||t(),!c||!u)return;const p={rootMargin:`${-Math.floor(h)}px ${-Math.floor(i.clientWidth-(l+c))}px ${-Math.floor(i.clientHeight-(h+u))}px ${-Math.floor(l)}px`,threshold:Math.max(0,Math.min(1,d))||1};let v=!0;o=new IntersectionObserver(function(e){const t=e[0].intersectionRatio;if(t!==d){if(!v)return r();t?r(!1,t):s=setTimeout(()=>{r(!1,1e-7)},1e3)}v=!1},p),o.observe(e)}(!0),n}function y(e,t,s){const o=[e];e.owner&&o.push(e.owner),"string"==typeof s?o.forEach(e=>{e.setAttribute(t,s)}):s?o.forEach(e=>{e.setAttribute(t,"")}):o.forEach(e=>{e.removeAttribute(t)})}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const w=e=>class extends(u(b(e))){static get properties(){return{opened:{type:Boolean,notify:!0,observer:"_openedChanged",reflectToAttribute:!0,sync:!0},owner:{type:Object,sync:!0},model:{type:Object,sync:!0},renderer:{type:Object,sync:!0},modeless:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_modelessChanged",sync:!0},hidden:{type:Boolean,reflectToAttribute:!0,observer:"_hiddenChanged",sync:!0},withBackdrop:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_withBackdropChanged",sync:!0}}}static get observers(){return["_rendererOrDataChanged(renderer, owner, model, opened)"]}get _rendererRoot(){return this}constructor(){super(),this._boundMouseDownListener=this._mouseDownListener.bind(this),this._boundMouseUpListener=this._mouseUpListener.bind(this),this._boundOutsideClickListener=this._outsideClickListener.bind(this),this._boundKeydownListener=this._keydownListener.bind(this),s&&(this._boundIosResizeListener=()=>this._detectIosNavbar())}firstUpdated(){super.firstUpdated(),this.popover="manual",this.addEventListener("click",()=>{}),this.$.backdrop&&this.$.backdrop.addEventListener("click",()=>{})}connectedCallback(){super.connectedCallback(),this._boundIosResizeListener&&(this._detectIosNavbar(),window.addEventListener("resize",this._boundIosResizeListener)),this.opened&&this._attachOverlay()}disconnectedCallback(){super.disconnectedCallback(),this.__scheduledOpen&&(cancelAnimationFrame(this.__scheduledOpen),this.__scheduledOpen=null),this._boundIosResizeListener&&window.removeEventListener("resize",this._boundIosResizeListener)}requestContentUpdate(){this.renderer&&this.renderer.call(this.owner,this._rendererRoot,this.owner,this.model)}close(e){const t=new CustomEvent("vaadin-overlay-close",{bubbles:!0,cancelable:!0,detail:{overlay:this,sourceEvent:e}});this.dispatchEvent(t),document.body.dispatchEvent(t),t.defaultPrevented||(this.opened=!1)}setBounds(e,t=!0){const s=this.$.overlay,o={...e};t&&"absolute"!==s.style.position&&(s.style.position="absolute"),Object.keys(o).forEach(e=>{null===o[e]||isNaN(o[e])||(o[e]=`${o[e]}px`)}),Object.assign(s.style,o)}_detectIosNavbar(){if(!this.opened)return;const e=window.innerHeight,t=window.innerWidth>e,s=document.documentElement.clientHeight;t&&s>e?this.style.setProperty("--vaadin-overlay-viewport-bottom",s-e+"px"):this.style.setProperty("--vaadin-overlay-viewport-bottom","0px")}_shouldAddGlobalListeners(){return!this.modeless}_addGlobalListeners(){this.__hasGlobalListeners||(this.__hasGlobalListeners=!0,document.addEventListener("mousedown",this._boundMouseDownListener),document.addEventListener("mouseup",this._boundMouseUpListener),document.documentElement.addEventListener("click",this._boundOutsideClickListener,!0))}_removeGlobalListeners(){this.__hasGlobalListeners&&(this.__hasGlobalListeners=!1,document.removeEventListener("mousedown",this._boundMouseDownListener),document.removeEventListener("mouseup",this._boundMouseUpListener),document.documentElement.removeEventListener("click",this._boundOutsideClickListener,!0))}_rendererOrDataChanged(e,t,s,o){const i=this._oldOwner!==t||this._oldModel!==s;this._oldModel=s,this._oldOwner=t;const n=this._oldRenderer!==e,r=void 0!==this._oldRenderer;this._oldRenderer=e;const a=this._oldOpened!==o;this._oldOpened=o,n&&r&&(this._rendererRoot.innerHTML="",delete this._rendererRoot._$litPart$),o&&e&&(n||a||i)&&this.requestContentUpdate()}_modelessChanged(e){this.opened&&(this._shouldAddGlobalListeners()?this._addGlobalListeners():this._removeGlobalListeners()),e?this._exitModalState():this.opened&&this._enterModalState(),y(this,"modeless",e)}_withBackdropChanged(e){y(this,"with-backdrop",e)}_openedChanged(e,t){if(e){if(!this.isConnected)return void(this.opened=!1);this._saveFocus(),this._animatedOpening(),this.__scheduledOpen=requestAnimationFrame(()=>{setTimeout(()=>{this._initFocus();const e=new CustomEvent("vaadin-overlay-open",{detail:{overlay:this},bubbles:!0});this.dispatchEvent(e),document.body.dispatchEvent(e)})}),document.addEventListener("keydown",this._boundKeydownListener),this._shouldAddGlobalListeners()&&this._addGlobalListeners()}else t&&(this.__scheduledOpen&&(cancelAnimationFrame(this.__scheduledOpen),this.__scheduledOpen=null),this._resetFocus(),this._animatedClosing(),document.removeEventListener("keydown",this._boundKeydownListener),this._shouldAddGlobalListeners()&&this._removeGlobalListeners())}_hiddenChanged(e){e&&this.hasAttribute("closing")&&this._flushAnimation("closing")}_enqueueAnimation(e,t){const s=this.getAnimations().filter(e=>e instanceof CSSAnimation&&e.effect.getComputedTiming().activeDuration>0);if(0===s.length)return void t();const o=`__${e}Handler`,i=()=>{this[o]===i&&(delete this[o],t())};this[o]=i,Promise.all(s.map(e=>e.finished)).then(i,i)}_flushAnimation(e){const t=`__${e}Handler`;"function"==typeof this[t]&&this[t]()}_animatedOpening(){this._isAttached&&this.hasAttribute("closing")&&this._flushAnimation("closing"),this._attachOverlay(),this._appendAttachedInstance(),this.modeless||this._enterModalState(),y(this,"opening",!0),this._enqueueAnimation("opening",()=>{this._finishOpening()})}_attachOverlay(){this.matches(":popover-open")||this.showPopover()}_finishOpening(){y(this,"opening",!1)}_finishClosing(){this._detachOverlay(),this._removeAttachedInstance(),this.toggleAttribute("suppressed",!1),y(this,"closing",!1),this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"))}_animatedClosing(){this.hasAttribute("opening")&&this._flushAnimation("opening"),this._isAttached&&(this._exitModalState(),y(this,"closing",!0),this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")),this._enqueueAnimation("closing",()=>{this._finishClosing()}))}_detachOverlay(){this.hidePopover()}_mouseDownListener(e){this._mouseDownInside=e.composedPath().indexOf(this.$.overlay)>=0}_mouseUpListener(e){this._mouseUpInside=e.composedPath().indexOf(this.$.overlay)>=0}_shouldCloseOnOutsideClick(e){return this._last}_outsideClickListener(e){if(e.composedPath().includes(this.$.overlay)||this._mouseDownInside||this._mouseUpInside)return this._mouseDownInside=!1,void(this._mouseUpInside=!1);if(!this._shouldCloseOnOutsideClick(e))return;const t=new CustomEvent("vaadin-overlay-outside-click",{cancelable:!0,detail:{sourceEvent:e}});this.dispatchEvent(t),this.opened&&!t.defaultPrevented&&(this.close(e),this.opened||this.modeless||o(e))}_keydownListener(e){if(this._last&&!e.defaultPrevented&&(this._shouldAddGlobalListeners()||e.composedPath().includes(this._focusRoot))&&"Escape"===e.key){const t=new CustomEvent("vaadin-overlay-escape-press",{cancelable:!0,detail:{sourceEvent:e}});this.dispatchEvent(t),this.opened&&!t.defaultPrevented&&this.close(e)}}};export{c as F,w as O,h as a,m as b,u as c,_ as g,f as i,g as o,y as s};
