import{f as e,S as t,r as i,a as n,i as a,x as s,b as o,c as r,E as l}from"./css-utils-3M4j0S_f.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */window.Vaadin||={},window.Vaadin.featureFlags||={};const d={};function h(e,t="25.4.0-alpha1"){if(Object.defineProperty(e,"version",{get:()=>t}),e.experimental){const t="string"==typeof e.experimental?e.experimental:`${i=e.is.split("-").slice(1).join("-"),i.replace(/-[a-z]/gu,e=>e[1].toUpperCase())}Component`;if(!window.Vaadin.featureFlags[t]&&!d[t])return d[t]=new Set,d[t].add(e),void Object.defineProperty(window.Vaadin.featureFlags,t,{get:()=>0===d[t].size,set(e){e&&d[t].size>0&&(d[t].forEach(e=>{customElements.define(e.is,e)}),d[t].clear())}});if(d[t])return void d[t].add(e)}var i;const n=customElements.get(e.is);if(n){const t=n.version;t&&e.version&&t===e.version?console.warn(`The component ${e.is} has been loaded twice`):console.error(`Tried to define ${e.is} version ${e.version} when version ${n.version} is already in use. Something will probably break.`)}else customElements.define(e.is,e)}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const c=[];function u(e,t,i=e.getAttribute("dir")){t?e.setAttribute("dir",t):null!=i&&e.removeAttribute("dir")}function p(){return document.documentElement.getAttribute("dir")}new MutationObserver(function(){const e=p();c.forEach(t=>{u(t,e)})}).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const v=e=>class extends e{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:e=>e||"",toAttribute:e=>""===e?null:e}}}}get __isRTL(){return"rtl"===this.getAttribute("dir")}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),u(this,p(),null))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),"dir"!==e)return;const n=p(),a=i===n&&-1===c.indexOf(this),s=!i&&t&&-1===c.indexOf(this),o=i!==n&&t===n;a||s?(this.__subscribe(),u(this,n,i)):o&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=c.includes(this),this.__unsubscribe()}_valueToNodeAttribute(e,t,i){("dir"!==i||""!==t||e.hasAttribute("dir"))&&super._valueToNodeAttribute(e,t,i)}_attributeToProperty(e,t,i){"dir"!==e||t?super._attributeToProperty(e,t,i):this.dir=""}__subscribe(){c.includes(this)||c.push(this)}__unsubscribe(){c.includes(this)&&c.splice(c.indexOf(this),1)}},_=new WeakMap;function g(e){return t=>{if(function(e,t){let i=t;for(;i;){if(_.get(i)===e)return!0;i=Object.getPrototypeOf(i)}return!1}(e,t))return t;const i=e(t);return _.set(i,e),i}}
/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const f={},m=/([A-Z])/gu;function b(e){return f[e]||(f[e]=e.replace(m,"-$1").toLowerCase()),f[e]}function y(e){return e[0].toUpperCase()+e.substring(1)}function w(e){const[t,i]=e.split("(");return{method:t,observerProps:i.replace(")","").split(",").map(e=>e.trim())}}function x(e,t){return Object.prototype.hasOwnProperty.call(e,t)||(e[t]=new Map(e[t])),e[t]}const k=g(t=>class extends t{static enabledWarnings=[];static createProperty(e,t){[String,Boolean,Number,Array].includes(t)&&(t={type:t}),t?.reflectToAttribute&&(t.reflect=!0),super.createProperty(e,t)}static getOrCreateMap(e){return x(this,e)}static finalize(){if(window.litIssuedWarnings&&(window.litIssuedWarnings.add("no-override-create-property"),window.litIssuedWarnings.add("no-override-get-property-descriptor")),super.finalize(),Array.isArray(this.observers)){const e=this.getOrCreateMap("__complexObservers");this.observers.forEach(t=>{const{method:i,observerProps:n}=w(t);e.set(i,n)})}}static addCheckedInitializer(e){super.addInitializer(t=>{t instanceof this&&e(t)})}static getPropertyDescriptor(t,i,n){const a=super.getPropertyDescriptor(t,i,n);let s=a;if(this.getOrCreateMap("__propKeys").set(t,i),n.sync&&(s={get:a.get,set(a){const s=this[t];e(a,s)&&(this[i]=a,this.requestUpdate(t,s,n),this.hasUpdated&&this.performUpdate())},configurable:!0,enumerable:!0}),n.readOnly){const e=s.set;this.addCheckedInitializer(i=>{i[`_set${y(t)}`]=function(t){e.call(i,t)}}),s={get:s.get,set(){},configurable:!0,enumerable:!0}}if("value"in n&&this.addCheckedInitializer(e=>{const i="function"==typeof n.value?n.value.call(e):n.value;n.readOnly?e[`_set${y(t)}`](i):e[t]=i}),n.observer){const e=n.observer;this.getOrCreateMap("__observers").set(t,e),this.addCheckedInitializer(t=>{t[e]||console.warn(`observer method ${e} not defined`)})}if(n.notify){if(this.__notifyProps){if(!this.hasOwnProperty("__notifyProps")){const e=this.__notifyProps;this.__notifyProps=new Set(e)}}else this.__notifyProps=new Set;this.__notifyProps.add(t)}if(n.computed){const e=`__assignComputed${t}`,i=w(n.computed);this.prototype[e]=function(...e){this[t]=this[i.method](...e)},this.getOrCreateMap("__computedObservers").set(e,i.observerProps)}return n.attribute||(n.attribute=b(t)),s}static get polylitConfig(){return{asyncFirstRender:!1}}connectedCallback(){super.connectedCallback();const{polylitConfig:e}=this.constructor;this.hasUpdated||e.asyncFirstRender||this.performUpdate()}firstUpdated(){super.firstUpdated(),this.$||(this.$={}),this.renderRoot.querySelectorAll("[id]").forEach(e=>{this.$[e.id]=e})}ready(){}willUpdate(e){this.constructor.__computedObservers&&this.__runComplexObservers(e,this.constructor.__computedObservers)}updated(e){const t=this.__isReadyInvoked;this.__isReadyInvoked=!0,this.constructor.__observers&&this.__runObservers(e,this.constructor.__observers),this.constructor.__complexObservers&&this.__runComplexObservers(e,this.constructor.__complexObservers),this.__dynamicPropertyObservers&&this.__runDynamicObservers(e,this.__dynamicPropertyObservers),this.__dynamicMethodObservers&&this.__runComplexObservers(e,this.__dynamicMethodObservers),this.constructor.__notifyProps&&this.__runNotifyProps(e,this.constructor.__notifyProps),t||this.ready()}setProperties(e){Object.entries(e).forEach(([e,t])=>{const i=this.constructor.__propKeys.get(e),n=this[i];this[i]=t,this.requestUpdate(e,n)}),this.hasUpdated&&this.performUpdate()}_createMethodObserver(e){const t=x(this,"__dynamicMethodObservers"),{method:i,observerProps:n}=w(e);t.set(i,n)}_createPropertyObserver(e,t){x(this,"__dynamicPropertyObservers").set(t,e)}__runComplexObservers(e,t){t.forEach((t,i)=>{t.some(t=>e.has(t))&&(this[i]?this[i](...t.map(e=>this[e])):console.warn(`observer method ${i} not defined`))})}__runDynamicObservers(e,t){t.forEach((t,i)=>{e.has(t)&&this[i]&&this[i](this[t],e.get(t))})}__runObservers(e,t){e.forEach((e,i)=>{const n=t.get(i);void 0!==n&&this[n]&&this[n](this[i],e)})}__runNotifyProps(e,t){e.forEach((e,i)=>{t.has(i)&&this.dispatchEvent(new CustomEvent(`${b(i)}-changed`,{detail:{value:this[i]}}))})}_get(e,t){return function(e,t){return e.split(".").reduce((e,t)=>e?e[t]:void 0,t)}(e,t)}_set(e,t,i){!function(e,t,i){const n=e.split("."),a=n.pop();n.reduce((e,t)=>e[t],i)[a]=t}(e,t,i)}});
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class D extends EventTarget{#e;#t=new Set;#i;#n=!1;constructor(e){super(),this.#e=e,this.#i=new CSSStyleSheet}#a(e){const{propertyName:t}=e;this.#t.has(t)&&this.dispatchEvent(new CustomEvent("property-changed",{detail:{propertyName:t}}))}observe(e){this.connect(),this.#t.has(e)||(this.#t.add(e),this.#i.replaceSync(`\n      :root::before, :host::before {\n        content: '' !important;\n        position: absolute !important;\n        top: -9999px !important;\n        left: -9999px !important;\n        visibility: hidden !important;\n        transition: 1ms allow-discrete step-end !important;\n        transition-property: ${[...this.#t].join(", ")} !important;\n      }\n    `))}connect(){this.#n||(this.#e.adoptedStyleSheets.unshift(this.#i),this.#s.addEventListener("transitionstart",e=>this.#a(e)),this.#s.addEventListener("transitionend",e=>this.#a(e)),this.#n=!0)}disconnect(){this.#t.clear(),this.#e.adoptedStyleSheets=this.#e.adoptedStyleSheets.filter(e=>e!==this.#i),this.#s.removeEventListener("transitionstart",this.#a),this.#s.removeEventListener("transitionend",this.#a),this.#n=!1}get#s(){return this.#e.documentElement??this.#e.host}static for(e){return e.__cssPropertyObserver||=new D(e),e.__cssPropertyObserver}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function C(e){t(e.shadowRoot,function(e){const{baseStyles:t,themeStyles:i,elementStyles:n,lumoInjector:a}=e.constructor,s=e.__lumoStyleSheet;if(s)return[...a.includeBaseStyles?t??n:[],s,...i??[]];return n}(e))}function S(e,t){e.__lumoStyleSheet=t,C(e)}function E(e){e.__lumoStyleSheet=void 0,C(e)}
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const A=new Set;function T(e){A.has(e)||(A.add(e),console.warn(e))}
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const I=new WeakMap;function M(e){try{return e.media.mediaText}catch{return T('[LumoInjector] Browser denied to access property "mediaText" for some CSS rules, so they were skipped.'),""}}function N(e,t={tags:new Map,modules:new Map}){for(const i of function(e){try{return e.cssRules}catch{return T('[LumoInjector] Browser denied to access property "cssRules" for some CSS stylesheets, so they were skipped.'),[]}}(e)){if(i instanceof CSSImportRule){const e=M(i);e.startsWith("lumo_")?t.modules.set(e,[...i.styleSheet.cssRules]):N(i.styleSheet,t);continue}if(i instanceof CSSMediaRule){const e=M(i);e.startsWith("lumo_")&&t.modules.set(e,[...i.cssRules]);continue}if(i instanceof CSSStyleRule&&i.cssText.includes("-inject"))for(const e of i.style){const n=e.match(/^--_lumo-(.*)-inject-modules$/u)?.[1];if(!n)continue;const a=i.style.getPropertyValue(e);t.tags.set(n,a.split(",").map(e=>e.trim().replace(/'|"/gu,"")))}else;}return t}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function O(e){return`--_lumo-${e.is}-inject`}class P{#e;#o;#r=new Map;#l=new Map;constructor(e=document){this.#e=e,this.handlePropertyChange=this.handlePropertyChange.bind(this),this.#o=D.for(e),this.#o.addEventListener("property-changed",this.handlePropertyChange)}disconnect(){this.#o.removeEventListener("property-changed",this.handlePropertyChange),this.#r.clear(),this.#l.values().forEach(e=>e.forEach(E))}forceUpdate(){for(const e of this.#r.keys())this.#d(e)}componentConnected(e){const{lumoInjector:t}=e.constructor,{is:i}=t;this.#l.set(i,this.#l.get(i)??new Set),this.#l.get(i).add(e);const n=this.#r.get(i);if(n)return void(n.cssRules.length>0&&S(e,n));this.#h(i);const a=O(t);this.#o.observe(a)}componentDisconnected(e){const{is:t}=e.constructor.lumoInjector;this.#l.get(t)?.delete(e),E(e)}handlePropertyChange(e){const{propertyName:t}=e.detail,i=t.match(/^--_lumo-(.*)-inject$/u)?.[1];i&&this.#d(i)}#h(e){this.#r.set(e,new CSSStyleSheet),this.#d(e)}#d(e){const{tags:t,modules:i}=function(e){let t=new Map,i=new Map;for(const n of e){let e=I.get(n);e||(e=N(n),I.set(n,e)),t=new Map([...t,...e.tags]),i=new Map([...i,...e.modules])}return{tags:t,modules:i}}(this.#c),n=(t.get(e)??[]).flatMap(e=>i.get(e)??[]).map(e=>e.cssText).join("\n"),a=this.#r.get(e);a.replaceSync(n),this.#l.get(e)?.forEach(e=>{n?S(e,a):E(e)})}get#c(){let e=new Set;for(const t of[this.#e,document])e=e.union(new Set(t.styleSheets)),e=e.union(new Set(t.adoptedStyleSheets));return[...e]}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const L=new Set;function B(e){const t=e.getRootNode();return t.host&&t.host.constructor.version?B(t.host):t}const F=e=>class extends e{static finalize(){super.finalize();const e=O(this.lumoInjector);this.is&&!L.has(e)&&(L.add(e),i({name:e,syntax:"<number>",inherits:!0,initialValue:"0"}))}static get lumoInjector(){return{is:this.is,includeBaseStyles:!1}}connectedCallback(){super.connectedCallback();const e=B(this);e.__lumoInjectorDisabled||this.isConnected&&(e.__lumoInjector||=new P(e),this.__lumoInjector=e.__lumoInjector,this.__lumoInjector.componentConnected(this))}disconnectedCallback(){super.disconnectedCallback(),this.__lumoInjector&&(this.__lumoInjector.componentDisconnected(this),this.__lumoInjector=void 0)}},R=e=>class extends e{static get properties(){return{_theme:{type:String,readOnly:!0}}}static get observedAttributes(){return[...super.observedAttributes,"theme"]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"theme"===e&&this._set_theme(i)}},V=[],$=new Set,j=new Set;
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function z(e=""){let t=0;return e.startsWith("lumo-")||e.startsWith("material-")?t=1:e.startsWith("vaadin-")&&(t=2),t}function W(e){const t=[];return e.include&&[].concat(e.include).forEach(e=>{const i=V.find(t=>t.moduleId===e);i?t.push(...W(i),...i.styles):console.warn(`Included moduleId ${e} not found in style registry`)},e.styles),t}function q(e){const t=`${e}-default-theme`,i=V.filter(i=>i.moduleId!==t&&function(e,t){return(e||"").split(" ").some(e=>new RegExp(`^${e.split("*").join(".*")}$`,"u").test(t))}(i.themeFor,e)).map(e=>({...e,styles:[...W(e),...e.styles],includePriority:z(e.moduleId)})).sort((e,t)=>t.includePriority-e.includePriority);return i.length>0?i:V.filter(e=>e.moduleId===t)}const H=e=>class extends(R(e)){constructor(){super(),$.add(new WeakRef(this))}static finalize(){if(super.finalize(),this.is&&j.add(this.is),this.elementStyles)return;const e=this.prototype._template;var t;!e||(t=this)&&Object.prototype.hasOwnProperty.call(t,"__themes")||function(e,t){const i=document.createElement("style");i.id="vaadin-themable-mixin-style",i.textContent=function(e){return e.map(e=>e.cssText).join("\n")}(e),t.content.appendChild(i)}(this.getStylesForThis(),e)}static finalizeStyles(e){return this.baseStyles=e?[e].flat(1/0):[],this.themeStyles=this.getStylesForThis(),[...this.baseStyles,...this.themeStyles]}static getStylesForThis(){const t=e.__themes||[],i=Object.getPrototypeOf(this.prototype),n=(i?i.constructor.__themes:[])||[];this.__themes=[...t,...n,...q(this.is)];const a=this.__themes.flatMap(e=>e.styles);return a.filter((e,t)=>t===a.lastIndexOf(e))}};
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */["--vaadin-text-color","--vaadin-text-color-disabled","--vaadin-text-color-secondary","--vaadin-border-color","--vaadin-border-color-secondary","--vaadin-background-color"].forEach(e=>{i({name:e,syntax:"<color>",inherits:!0,initialValue:"transparent"})}),n("vaadin-base",a`
    @layer vaadin.base {
      html {
        /* Background color */
        --vaadin-background-color: light-dark(#fff, #222);

        /* Container colors */
        --vaadin-background-container: color-mix(in oklab, var(--vaadin-text-color) 5%, var(--vaadin-background-color));
        --vaadin-background-container-strong: color-mix(
          in oklab,
          var(--vaadin-text-color) 10%,
          var(--vaadin-background-color)
        );

        /* Border colors */
        --vaadin-border-color-secondary: color-mix(in oklab, var(--vaadin-text-color) 24%, transparent);
        --vaadin-border-color: color-mix(in oklab, var(--vaadin-text-color) 48%, transparent); /* Above 3:1 contrast */

        /* Text colors */
        /* Above 3:1 contrast */
        --vaadin-text-color-disabled: color-mix(in oklab, var(--vaadin-text-color) 48%, transparent);
        /* Above 4.5:1 contrast */
        --vaadin-text-color-secondary: color-mix(in oklab, var(--vaadin-text-color) 68%, transparent);
        /* Above 7:1 contrast */
        --vaadin-text-color: light-dark(#1f1f1f, white);

        /* Padding */
        --vaadin-padding-xs: 6px;
        --vaadin-padding-s: 8px;
        --vaadin-padding-m: 12px;
        --vaadin-padding-l: 16px;
        --vaadin-padding-xl: 24px;
        --vaadin-padding-block-container: var(--vaadin-padding-xs);
        --vaadin-padding-inline-container: var(--vaadin-padding-s);

        /* Gap/spacing */
        --vaadin-gap-xs: 6px;
        --vaadin-gap-s: 8px;
        --vaadin-gap-m: 12px;
        --vaadin-gap-l: 16px;
        --vaadin-gap-xl: 24px;

        /* Border radius */
        --vaadin-radius-s: 3px;
        --vaadin-radius-m: 6px;
        --vaadin-radius-l: 12px;

        /* Focus outline */
        --vaadin-focus-ring-width: 2px;
        --vaadin-focus-ring-color: var(--vaadin-text-color);

        /* Icons, used as mask-image */
        --_vaadin-icon-arrow-up: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>');
        --_vaadin-icon-calendar: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>');
        --_vaadin-icon-checkmark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>');
        --_vaadin-icon-checkmark-small: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>');
        --_vaadin-icon-chevron-down: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>');
        --_vaadin-icon-chevron-right: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>');
        --_vaadin-icon-clock: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>');
        --_vaadin-icon-cross: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>');
        --_vaadin-icon-cross-small: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>');
        --_vaadin-icon-drag: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M11 7c0 .82843-.6716 1.5-1.5 1.5C8.67157 8.5 8 7.82843 8 7s.67157-1.5 1.5-1.5c.8284 0 1.5.67157 1.5 1.5Zm0 5c0 .8284-.6716 1.5-1.5 1.5-.82843 0-1.5-.6716-1.5-1.5s.67157-1.5 1.5-1.5c.8284 0 1.5.6716 1.5 1.5Zm0 5c0 .8284-.6716 1.5-1.5 1.5-.82843 0-1.5-.6716-1.5-1.5s.67157-1.5 1.5-1.5c.8284 0 1.5.6716 1.5 1.5Zm5-10c0 .82843-.6716 1.5-1.5 1.5S13 7.82843 13 7s.6716-1.5 1.5-1.5S16 6.17157 16 7Zm0 5c0 .8284-.6716 1.5-1.5 1.5S13 12.8284 13 12s.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5Zm0 5c0 .8284-.6716 1.5-1.5 1.5S13 17.8284 13 17s.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5Z" fill="currentColor"/></svg>');
        --_vaadin-icon-ellipsis: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>');
        --_vaadin-icon-eye: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>');
        --_vaadin-icon-eye-slash: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>');
        --_vaadin-icon-file: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>');
        --_vaadin-icon-fullscreen: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>');
        --_vaadin-icon-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>');
        --_vaadin-icon-link: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>');
        --_vaadin-icon-menu: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>');
        --_vaadin-icon-minus: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>');
        --_vaadin-icon-paper-airplane: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>');
        --_vaadin-icon-pen: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>');
        --_vaadin-icon-play: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>');
        --_vaadin-icon-plus: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>');
        --_vaadin-icon-redo: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>');
        --_vaadin-icon-refresh: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M22 10C22 10 19.995 7.26822 18.3662 5.63824C16.7373 4.00827 14.4864 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.1031 21 19.5649 18.2543 20.6482 14.5M22 10V4M22 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
        --_vaadin-icon-resize: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 7.46967c.2929.29289.2929.76777 0 1.06066L8.53033 18.5304c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7678 0-1.0607L17.4697 7.46967c.2929-.29289.7677-.29289 1.0606 0Zm0 4.50003c.2929.2929.2929.7678 0 1.0607l-5.5 5.5c-.2929.2928-.7677.2928-1.0606 0-.2929-.2929-.2929-.7678 0-1.0607l5.4999-5.5c.2929-.2929.7678-.2929 1.0607 0Zm0 4.5c.2929.2928.2929.7677 0 1.0606l-1 1.0001c-.2929.2928-.7677.2929-1.0606 0-.2929-.2929-.2929-.7678 0-1.0607l1-1c.2929-.2929.7677-.2929 1.0606 0Z" fill="currentColor"/></svg>');
        --_vaadin-icon-slash: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="13.7812" y="4.22583" width="1.5" height="16" rx="0.75" transform="rotate(20 13.7812 4.22583)" fill="currentColor"/></svg>');
        --_vaadin-icon-sort: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M7.49854 6.99951C7.92795 6.99951 8.15791 7.50528 7.87549 7.82861L4.37646 11.8296C4.17728 12.0571 3.82272 12.0571 3.62354 11.8296L0.125488 7.82861C-0.157248 7.50531 0.0719873 6.99956 0.501465 6.99951H7.49854ZM3.62354 0.17041C3.82275 -0.0573875 4.17725 -0.0573848 4.37646 0.17041L7.87549 4.17041C8.15825 4.49373 7.92806 5.00049 7.49854 5.00049L0.501465 4.99951C0.0719873 4.99946 -0.157248 4.49371 0.125488 4.17041L3.62354 0.17041Z" fill="black"/></svg>');
        --_vaadin-icon-undo: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>');
        --_vaadin-icon-upload: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>');
        --_vaadin-icon-user: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>');
        --_vaadin-icon-warn: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>');

        /* Cursors for interactive elements */
        --vaadin-clickable-cursor: pointer;
        --vaadin-disabled-cursor: not-allowed;

        /* Use units so that the values can be used in calc() */
        --safe-area-inset-top: env(safe-area-inset-top, 0px);
        --safe-area-inset-right: env(safe-area-inset-right, 0px);
        --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        --safe-area-inset-left: env(safe-area-inset-left, 0px);
        --safe-area-inset-inline-start: var(--safe-area-inset-left);
        --safe-area-inset-inline-end: var(--safe-area-inset-right);

        &:dir(rtl) {
          --safe-area-inset-inline-start: var(--safe-area-inset-right);
          --safe-area-inset-inline-end: var(--safe-area-inset-left);
        }
      }

      @supports not (color: hsl(0 0 0)) {
        html {
          --_vaadin-safari-17-deg: 1deg;
        }
      }

      @media (forced-colors: active) {
        html {
          --vaadin-background-color: Canvas;
          --vaadin-border-color: CanvasText;
          --vaadin-border-color-secondary: CanvasText;
          --vaadin-text-color-disabled: CanvasText;
          --vaadin-text-color-secondary: CanvasText;
          --vaadin-text-color: CanvasText;
          --vaadin-icon-color: CanvasText;
          --vaadin-focus-ring-color: Highlight;
        }
      }
    }
  `);
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Y=a`
  :host {
    display: flex;
    align-items: center;
    min-height: var(--vaadin-input-field-height, auto);
    --_radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    border-radius:
      /* See https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius */
      var(--vaadin-input-field-top-start-radius, var(--_radius))
      var(--vaadin-input-field-top-end-radius, var(--_radius))
      var(--vaadin-input-field-bottom-end-radius, var(--_radius))
      var(--vaadin-input-field-bottom-start-radius, var(--_radius));
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
    box-sizing: border-box;
    cursor: text;
    padding: var(
      --vaadin-input-field-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    gap: var(--vaadin-input-field-gap, var(--vaadin-gap-s));
    background: var(--vaadin-input-field-background, var(--vaadin-background-color));
    color: var(--vaadin-input-field-value-color, var(--vaadin-text-color));
    font-size: var(--vaadin-input-field-value-font-size, inherit);
    line-height: var(--vaadin-input-field-value-line-height, inherit);
    font-weight: var(--vaadin-input-field-value-font-weight, 400);
  }

  :host([dir='rtl']) {
    --_radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    border-radius:
      /* Don't use logical props, see https://github.com/vaadin/vaadin-time-picker/issues/145 */
      var(--vaadin-input-field-top-end-radius, var(--_radius))
      var(--vaadin-input-field-top-start-radius, var(--_radius))
      var(--vaadin-input-field-bottom-start-radius, var(--_radius))
      var(--vaadin-input-field-bottom-end-radius, var(--_radius));
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Reset the native input styles */
  ::slotted(:is(input, textarea)) {
    appearance: none;
    align-self: stretch;
    box-sizing: border-box;
    flex: auto;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    height: auto;
    outline: none;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    min-width: 0;
    font: inherit;
    font-size: 1em;
    color: inherit;
    background: transparent;
    cursor: inherit;
    text-align: inherit;
    caret-color: var(--vaadin-input-field-value-color);
  }

  ::slotted(*) {
    flex: none;
  }

  slot[name$='fix'] {
    cursor: auto;
  }

  ::slotted(:is(input, textarea))::placeholder {
    /* Use ::slotted(:is(input, textarea):placeholder-shown) to style the placeholder */
    /* because ::slotted(...)::placeholder does not work in Safari. */
    font: inherit;
    color: inherit;
  }

  ::slotted(:is(input, textarea):placeholder-shown) {
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
  }

  :host(:focus-within) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-input-field-border-width, 1px) * -1);
  }

  :host([invalid]) {
    --vaadin-input-field-border-color: var(--vaadin-input-field-error-color, var(--vaadin-text-color));
  }

  :host([readonly]) {
    border-style: dashed;
  }

  :host([readonly]:focus-within) {
    outline-style: dashed;
    --vaadin-input-field-border-color: transparent;
  }

  :host([disabled]) {
    --vaadin-input-field-value-color: var(--vaadin-input-field-disabled-text-color, var(--vaadin-text-color-disabled));
    --vaadin-input-field-background: var(
      --vaadin-input-field-disabled-background,
      var(--vaadin-background-container-strong)
    );
    --vaadin-input-field-border-color: transparent;
  }

  :host([theme~='align-start']) slot:not([name])::slotted(*) {
    text-align: start;
  }

  :host([theme~='align-center']) slot:not([name])::slotted(*) {
    text-align: center;
  }

  :host([theme~='align-end']) slot:not([name])::slotted(*) {
    text-align: end;
  }

  :host([theme~='align-left']) slot:not([name])::slotted(*) {
    text-align: left;
  }

  :host([theme~='align-right']) slot:not([name])::slotted(*) {
    text-align: right;
  }

  @media (forced-colors: active) {
    :host {
      --vaadin-input-field-background: Field;
      --vaadin-input-field-value-color: FieldText;
      --vaadin-input-field-placeholder-color: GrayText;
    }

    :host([disabled]) {
      --vaadin-input-field-value-color: GrayText;
      --vaadin-icon-color: GrayText;
    }
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class U extends(H(v(k(F(o))))){static get is(){return"vaadin-input-container"}static get styles(){return Y}static get properties(){return{disabled:{type:Boolean,reflectToAttribute:!0},readonly:{type:Boolean,reflectToAttribute:!0},invalid:{type:Boolean,reflectToAttribute:!0}}}render(){return s`
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `}ready(){super.ready(),this.addEventListener("pointerdown",e=>{e.target===this&&e.preventDefault()}),this.addEventListener("click",e=>{e.target===this&&this.shadowRoot.querySelector("slot:not([name])").assignedNodes({flatten:!0}).forEach(e=>e.focus&&e.focus())})}}h(U);
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const K=[{name:"--vaadin-overlay-animation-duration",syntax:"<time>",initialValue:"0s"},{name:"--vaadin-overlay-animation-delay",syntax:"<time>",initialValue:"0s"},{name:"--vaadin-overlay-animation-timing-function",syntax:"*",initialValue:"ease"},{name:"--vaadin-overlay-opacity-closed",syntax:"<number>",initialValue:"0"},{name:"--vaadin-overlay-translate-closed",syntax:"<length>+ | <percentage>+",initialValue:"0px"},{name:"--vaadin-overlay-scale-closed",syntax:"<number> | <percentage>",initialValue:"1"},{name:"--vaadin-overlay-transform-closed",syntax:"*"}];K.forEach(e=>{i({inherits:!1,...e})});const G=[a`
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
`,a`
  :host,
  [part='overlay'],
  [part='backdrop'] {
    ${r(K.map(({name:e})=>`${e}: inherit;`).join("\n"))}
  }

  :host(:where([opening], [closing])) {
    /* This empty animation only reports the state, the parts run the visible animation */
    animation-name: --no-op;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-delay: var(--vaadin-overlay-animation-delay);
  }

  :host(:where([closing])) [part='overlay'],
  :host(:where([closing])) ::slotted(*) {
    pointer-events: none !important;
  }

  :host(:where([opening], [closing])) :is([part='overlay'], [part='backdrop']) {
    animation-name: --fade, --transform;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-timing-function: var(--vaadin-overlay-animation-timing-function);
    animation-delay: var(--vaadin-overlay-animation-delay);
    /* Fill backwards only, so the closed value applies during the delay without overriding theme styles */
    animation-fill-mode: backwards;

    @media (prefers-reduced-motion) {
      animation-name: --fade;
    }
  }

  :host(:where([opening], [closing])) [part='backdrop'] {
    animation-name: --fade;
    animation-timing-function: linear;
    --vaadin-overlay-opacity-closed: 0;
  }

  :host(:where([closing])) :is([part='overlay'], [part='backdrop']) {
    animation-direction: reverse;
    animation-fill-mode: both;
  }

  @keyframes --no-op {
  }

  /* Only the closed state is declared, so the animations end at the value the part already has */
  @keyframes --transform {
    0% {
      transform: var(--vaadin-overlay-transform-closed);
      translate: var(--vaadin-overlay-translate-closed);
      scale: var(--vaadin-overlay-scale-closed);
    }
  }

  @keyframes --fade {
    0% {
      opacity: var(--vaadin-overlay-opacity-closed);
    }
  }
`
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */],X=a`
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
`;
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let Z=!1;function Q(){let e=document.activeElement||document.body;for(;e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement;return e}function J(){return Z}function ee(e){const t=e.style;if("hidden"===t.visibility||"none"===t.display)return!0;const i=window.getComputedStyle(e);return"hidden"===i.visibility||"none"===i.display}function te(e,t){const i=Math.max(e.tabIndex,0),n=Math.max(t.tabIndex,0);return 0===i||0===n?n>i:i>n}function ie(e){const t=e.length;if(t<2)return e;const i=Math.ceil(t/2);return function(e,t){const i=[];for(;e.length>0&&t.length>0;)te(e[0],t[0])?i.push(t.shift()):i.push(e.shift());return i.concat(e,t)}(ie(e.slice(0,i)),ie(e.slice(i)))}function ne(e){return e.matches("input, select, textarea, button, object")?e.matches(":not([disabled])"):e.matches("a[href], area[href], iframe, [tabindex], [contentEditable]")}function ae(e){return e.getRootNode().activeElement===e}function se(e,t){if(e.nodeType!==Node.ELEMENT_NODE||ee(e))return!1;const i=e,n=function(e){if(!ne(e))return-1;const t=e.getAttribute("tabindex")||0;return Number(t)}(i);let a,s=n>0;return n>=0&&t.push(i),a="slot"===i.localName?i.assignedNodes({flatten:!0}):(i.shadowRoot||i).children,[...a].forEach(e=>{s=se(e,t)||s}),s}function oe(e){const t=[];return se(e,t)?ie(t):t}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */window.addEventListener("keydown",()=>{Z=!0},{capture:!0}),window.addEventListener("mousedown",()=>{Z=!1},{capture:!0});const re=e=>e.test(navigator.userAgent),le=e=>e.test(navigator.platform);re(/Android/u),re(/Chrome/u)&&/Google Inc/u.test(navigator.vendor),re(/Firefox/u);const de=le(/^iPad/u)||le(/^Mac/u)&&navigator.maxTouchPoints>1,he=le(/^iPhone/u)||de;re(/^((?!chrome|android).)*safari/iu),(()=>{try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}})();
/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ce=new WeakSet;
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ue{saveFocus(e){this.focusNode=e||Q()}restoreFocus(e){const t=this.focusNode;if(!t)return;const i={preventScroll:!!e&&e.preventScroll,focusVisible:!!e&&e.focusVisible};Q()===document.body?setTimeout(()=>t.focus(i)):t.focus(i),this.focusNode=null}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const pe=[];class ve{trapNode=null;constructor(e){this.host=e}get#u(){return oe(this.trapNode)}get#p(){const e=this.#u;return e.indexOf(e.filter(ae).pop())}hostConnected(){document.addEventListener("keydown",this.#v)}hostDisconnected(){document.removeEventListener("keydown",this.#v)}trapFocus(e){if(this.trapNode=e,0===this.#u.length)throw this.trapNode=null,new Error("The trap node should have at least one focusable descendant or be focusable itself.");pe.push(this),-1===this.#p&&this.#u[0].focus({focusVisible:J()})}releaseFocus(){this.trapNode=null,pe.pop()}#v=e=>{if(this.trapNode&&this===Array.from(pe).pop()&&"Tab"===e.key){if(e.defaultPrevented)return;e.preventDefault();const t=e.shiftKey;this.#_(t)}};#_(e=!1){const t=this.#u,i=e?-1:1,n=this.#p,a=t[(t.length+n+i)%t.length];a.focus({focusVisible:!0}),"input"===a.localName&&a.select()}}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const _e=e=>class extends e{static get properties(){return{focusTrap:{type:Boolean,value:!1},autofocus:{type:Boolean,value:!1},restoreFocusOnClose:{type:Boolean,value:!1},restoreFocusNode:{type:HTMLElement}}}static get manageFocus(){return!0}constructor(){super(),this.__manageFocus=this.constructor.manageFocus,this.__manageFocus&&(this.__focusTrapController=new ve(this),this.__focusRestorationController=new ue)}get _contentRoot(){return this}ready(){super.ready(),this.__manageFocus&&(this.addController(this.__focusTrapController),this.addController(this.__focusRestorationController))}get _focusRoot(){return this.$.overlay}_resetFocus(){if(this.__manageFocus&&(this.focusTrap&&this.__focusTrapController.releaseFocus(),this.restoreFocusOnClose&&this._shouldRestoreFocus())){const e=J(),t=!e;this.__focusRestorationController.restoreFocus({preventScroll:t,focusVisible:e})}}_saveFocus(){this.__manageFocus&&this.restoreFocusOnClose&&this.__focusRestorationController.saveFocus(this.restoreFocusNode)}_initFocus(){if(!this.__manageFocus||((e=this._focusRoot).checkVisibility?!e.checkVisibility({visibilityProperty:!0}):null===e.offsetParent&&0===e.clientWidth&&0===e.clientHeight||ee(e)))return;var e;const t=oe(this._focusRoot);if(!t.some(ae)){const e=t.find(e=>this.#g(e))??(this.autofocus?t[0]:null);e?.focus({focusVisible:J()})}this.focusTrap&&this.__focusTrapController.trapFocus(this._focusRoot)}_shouldRestoreFocus(){const e=Q();return e===document.body||this._deepContains(e)}_deepContains(e){if(this._contentRoot.contains(e))return!0;let t=e;const i=e.ownerDocument;for(;t&&t!==i&&t!==this._contentRoot;)t=t.parentNode||t.host;return t===this._contentRoot}#g(e){const t=this._focusRoot;let i=e;for(;i&&i!==t&&i!==this;){if(i.autofocus&&(i===e||customElements.get(i.localName)))return!0;i=i.assignedSlot||i.parentNode||i.host}return!1}},ge=new Set,fe=()=>[...ge].filter(e=>!e.hasAttribute("closing")),me=(e,t=e=>!0)=>e===fe().filter(t).pop(),be=e=>class extends e{get _last(){return me(this)}get _isAttached(){return ge.has(this)}bringToFront(){if(me(this))return;const e=(e=>{const t=fe(),i=t.indexOf(e);return-1===i?[]:t.slice(i+1)})(this),t=e.filter(e=>{return e._hasOverlayPositionMixin&&(t=e,this._deepContains(t));var t});t.length!==e.length&&[this,...t].forEach(e=>{e.matches(":popover-open")&&(e.hidePopover(),e.showPopover()),e._removeAttachedInstance(),e._appendAttachedInstance()})}_enterModalState(){"none"!==document.body.style.pointerEvents&&(this._previousDocumentPointerEvents=document.body.style.pointerEvents,document.body.style.pointerEvents="none"),fe().forEach(e=>{e!==this&&e.toggleAttribute("suppressed",!0)})}_exitModalState(){void 0!==this._previousDocumentPointerEvents&&(document.body.style.pointerEvents=this._previousDocumentPointerEvents,delete this._previousDocumentPointerEvents);const e=fe();let t;for(;(t=e.pop())&&(t===this||(t.toggleAttribute("suppressed",!1),t.modeless)););}_appendAttachedInstance(){ge.add(this)}_removeAttachedInstance(){this._isAttached&&ge.delete(this)}};
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function ye(e,t,i){const n=[e];e.owner&&n.push(e.owner),"string"==typeof i?n.forEach(e=>{e.setAttribute(t,i)}):i?n.forEach(e=>{e.setAttribute(t,"")}):n.forEach(e=>{e.removeAttribute(t)})}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const we=e=>class extends(_e(be(e))){static get properties(){return{opened:{type:Boolean,notify:!0,observer:"_openedChanged",reflectToAttribute:!0,sync:!0},owner:{type:Object,sync:!0},model:{type:Object,sync:!0},renderer:{type:Object,sync:!0},modeless:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_modelessChanged",sync:!0},hidden:{type:Boolean,reflectToAttribute:!0,observer:"_hiddenChanged",sync:!0},withBackdrop:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_withBackdropChanged",sync:!0}}}static get observers(){return["_rendererOrDataChanged(renderer, owner, model, opened)"]}get _rendererRoot(){return this}constructor(){super(),this._boundMouseDownListener=this._mouseDownListener.bind(this),this._boundMouseUpListener=this._mouseUpListener.bind(this),this._boundOutsideClickListener=this._outsideClickListener.bind(this),this._boundKeydownListener=this._keydownListener.bind(this),he&&(this._boundIosResizeListener=()=>this._detectIosNavbar())}firstUpdated(){super.firstUpdated(),this.popover="manual",this.addEventListener("click",()=>{}),this.$.backdrop&&this.$.backdrop.addEventListener("click",()=>{})}connectedCallback(){super.connectedCallback(),this._boundIosResizeListener&&(this._detectIosNavbar(),window.addEventListener("resize",this._boundIosResizeListener)),this.opened&&this._attachOverlay()}disconnectedCallback(){super.disconnectedCallback(),this.__scheduledOpen&&(cancelAnimationFrame(this.__scheduledOpen),this.__scheduledOpen=null),this._boundIosResizeListener&&window.removeEventListener("resize",this._boundIosResizeListener)}requestContentUpdate(){this.renderer&&this.renderer.call(this.owner,this._rendererRoot,this.owner,this.model)}close(e){const t=new CustomEvent("vaadin-overlay-close",{bubbles:!0,cancelable:!0,detail:{overlay:this,sourceEvent:e}});this.dispatchEvent(t),document.body.dispatchEvent(t),t.defaultPrevented||(this.opened=!1)}setBounds(e,t=!0){const i=this.$.overlay,n={...e};t&&"absolute"!==i.style.position&&(i.style.position="absolute"),Object.keys(n).forEach(e=>{null===n[e]||isNaN(n[e])||(n[e]=`${n[e]}px`)}),Object.assign(i.style,n)}_detectIosNavbar(){if(!this.opened)return;const e=window.innerHeight,t=window.innerWidth>e,i=document.documentElement.clientHeight;t&&i>e?this.style.setProperty("--vaadin-overlay-viewport-bottom",i-e+"px"):this.style.setProperty("--vaadin-overlay-viewport-bottom","0px")}_shouldAddGlobalListeners(){return!this.modeless}_addGlobalListeners(){this.__hasGlobalListeners||(this.__hasGlobalListeners=!0,document.addEventListener("mousedown",this._boundMouseDownListener),document.addEventListener("mouseup",this._boundMouseUpListener),document.documentElement.addEventListener("click",this._boundOutsideClickListener,!0))}_removeGlobalListeners(){this.__hasGlobalListeners&&(this.__hasGlobalListeners=!1,document.removeEventListener("mousedown",this._boundMouseDownListener),document.removeEventListener("mouseup",this._boundMouseUpListener),document.documentElement.removeEventListener("click",this._boundOutsideClickListener,!0))}_rendererOrDataChanged(e,t,i,n){const a=this._oldOwner!==t||this._oldModel!==i;this._oldModel=i,this._oldOwner=t;const s=this._oldRenderer!==e,o=void 0!==this._oldRenderer;this._oldRenderer=e;const r=this._oldOpened!==n;this._oldOpened=n,s&&o&&(this._rendererRoot.innerHTML="",delete this._rendererRoot._$litPart$),n&&e&&(s||r||a)&&this.requestContentUpdate()}_modelessChanged(e){this.opened&&(this._shouldAddGlobalListeners()?this._addGlobalListeners():this._removeGlobalListeners()),e?this._exitModalState():this.opened&&this._enterModalState(),ye(this,"modeless",e)}_withBackdropChanged(e){ye(this,"with-backdrop",e)}_openedChanged(e,t){if(e){if(!this.isConnected)return void(this.opened=!1);this._saveFocus(),this._animatedOpening(),this.__scheduledOpen=requestAnimationFrame(()=>{setTimeout(()=>{this._initFocus();const e=new CustomEvent("vaadin-overlay-open",{detail:{overlay:this},bubbles:!0});this.dispatchEvent(e),document.body.dispatchEvent(e)})}),document.addEventListener("keydown",this._boundKeydownListener),this._shouldAddGlobalListeners()&&this._addGlobalListeners()}else t&&(this.__scheduledOpen&&(cancelAnimationFrame(this.__scheduledOpen),this.__scheduledOpen=null),this._resetFocus(),this._animatedClosing(),document.removeEventListener("keydown",this._boundKeydownListener),this._shouldAddGlobalListeners()&&this._removeGlobalListeners())}_hiddenChanged(e){e&&this.hasAttribute("closing")&&this._flushAnimation("closing")}_enqueueAnimation(e,t){const i=this.getAnimations().filter(e=>e instanceof CSSAnimation&&e.effect.getComputedTiming().activeDuration>0);if(0===i.length)return void t();const n=`__${e}Handler`,a=()=>{this[n]===a&&(delete this[n],t())};this[n]=a,Promise.all(i.map(e=>e.finished)).then(a,a)}_flushAnimation(e){const t=`__${e}Handler`;"function"==typeof this[t]&&this[t]()}_animatedOpening(){this._isAttached&&this.hasAttribute("closing")&&this._flushAnimation("closing"),this._attachOverlay(),this._appendAttachedInstance(),this.modeless||this._enterModalState(),ye(this,"opening",!0),this._enqueueAnimation("opening",()=>{this._finishOpening()})}_attachOverlay(){this.matches(":popover-open")||this.showPopover()}_finishOpening(){ye(this,"opening",!1)}_finishClosing(){this._detachOverlay(),this._removeAttachedInstance(),this.toggleAttribute("suppressed",!1),ye(this,"closing",!1),this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"))}_animatedClosing(){this.hasAttribute("opening")&&this._flushAnimation("opening"),this._isAttached&&(this._exitModalState(),ye(this,"closing",!0),this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")),this._enqueueAnimation("closing",()=>{this._finishClosing()}))}_detachOverlay(){this.hidePopover()}_mouseDownListener(e){this._mouseDownInside=e.composedPath().indexOf(this.$.overlay)>=0}_mouseUpListener(e){this._mouseUpInside=e.composedPath().indexOf(this.$.overlay)>=0}_shouldCloseOnOutsideClick(e){return this._last}_outsideClickListener(e){if(e.composedPath().includes(this.$.overlay)||this._mouseDownInside||this._mouseUpInside)return this._mouseDownInside=!1,void(this._mouseUpInside=!1);if(!this._shouldCloseOnOutsideClick(e))return;const t=new CustomEvent("vaadin-overlay-outside-click",{cancelable:!0,detail:{sourceEvent:e}});this.dispatchEvent(t),this.opened&&!t.defaultPrevented&&(this.close(e),this.opened||this.modeless||function(e){ce.add(e)}(e))}_keydownListener(e){if(this._last&&!e.defaultPrevented&&(this._shouldAddGlobalListeners()||e.composedPath().includes(this._focusRoot))&&"Escape"===e.key){const t=new CustomEvent("vaadin-overlay-escape-press",{cancelable:!0,detail:{sourceEvent:e}});this.dispatchEvent(t),this.opened&&!t.defaultPrevented&&this.close(e)}}};
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function xe(e){return new Set(e?e.split(" ").filter(Boolean):[])}function ke(e){return e?[...e].join(" "):""}function De(e,t,i){i?e.setAttribute(t,i):e.removeAttribute(t)}function Ce(e){return xe(Array.isArray(e)?e.join(" "):e)}function Se(e,t,i){i=Ce(i);const n=xe(e.getAttribute(t));i.forEach(e=>n.add(e)),De(e,t,ke(n))}function Ee(e,t,i){i=Ce(i);const n=xe(e.getAttribute(t));i.forEach(e=>n.delete(e)),De(e,t,ke(n))}function Ae(e){return!!e&&Boolean(e.nodeType===Node.ELEMENT_NODE&&(customElements.get(e.localName)||e.children.length>0)||e.textContent?.trim())}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const Te={start:"top",end:"bottom"},Ie={start:"left",end:"right"},Me=new ResizeObserver(e=>{setTimeout(()=>{e.forEach(e=>{e.target.__overlay&&e.target.__overlay._updatePosition()})})}),Ne=e=>class extends e{static get properties(){return{positionTarget:{type:Object,value:null,sync:!0},horizontalAlign:{type:String,value:"start",sync:!0},verticalAlign:{type:String,value:"top",sync:!0},noHorizontalOverlap:{type:Boolean,value:!1,sync:!0},noVerticalOverlap:{type:Boolean,value:!1,sync:!0},requiredVerticalSpace:{type:Number,value:0,sync:!0}}}constructor(){super(),this._hasOverlayPositionMixin=!0,this.__onScroll=this.__onScroll.bind(this),this._updatePosition=this._updatePosition.bind(this)}connectedCallback(){super.connectedCallback(),this.opened&&this.__addUpdatePositionEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.__removeUpdatePositionEventListeners()}updated(e){if(super.updated(e),e.has("positionTarget")){const t=e.get("positionTarget");this.__oldContentWidth=void 0,this.__oldContentHeight=void 0,(!this.positionTarget&&t||this.positionTarget&&!t&&this.__margins)&&this.__resetPosition()}(e.has("opened")||e.has("positionTarget"))&&this.__updatePositionSettings(this.opened,this.positionTarget);["horizontalAlign","verticalAlign","noHorizontalOverlap","noVerticalOverlap","requiredVerticalSpace"].some(t=>e.has(t))&&this._updatePosition()}__addUpdatePositionEventListeners(){window.visualViewport.addEventListener("resize",this._updatePosition),window.visualViewport.addEventListener("scroll",this.__onScroll,!0),this.__positionTargetAncestorRootNodes=function(e){const t=[];for(;e;){if(e.nodeType===Node.DOCUMENT_NODE){t.push(e);break}e.nodeType!==Node.DOCUMENT_FRAGMENT_NODE?e=e.assignedSlot?e.assignedSlot:e.parentNode:(t.push(e),e=e.host)}return t}(this.positionTarget),this.__positionTargetAncestorRootNodes.forEach(e=>{e.addEventListener("scroll",this.__onScroll,!0)}),this.positionTarget&&(this.__observePositionTargetMove=
/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function(e,t){let i,n=null;const a=document.documentElement;function s(){i&&clearTimeout(i),n?.disconnect(),n=null}return function o(r=!1,l=1){s();const{left:d,top:h,width:c,height:u}=e.getBoundingClientRect();if(r||t(),!c||!u)return;const p={rootMargin:`${-Math.floor(h)}px ${-Math.floor(a.clientWidth-(d+c))}px ${-Math.floor(a.clientHeight-(h+u))}px ${-Math.floor(d)}px`,threshold:Math.max(0,Math.min(1,l))||1};let v=!0;n=new IntersectionObserver(function(e){const t=e[0].intersectionRatio;if(t!==l){if(!v)return o();t?o(!1,t):i=setTimeout(()=>{o(!1,1e-7)},1e3)}v=!1},p),n.observe(e)}(!0),s}(this.positionTarget,()=>{this._updatePosition()}))}__removeUpdatePositionEventListeners(){window.visualViewport.removeEventListener("resize",this._updatePosition),window.visualViewport.removeEventListener("scroll",this.__onScroll,!0),this.__positionTargetAncestorRootNodes&&(this.__positionTargetAncestorRootNodes.forEach(e=>{e.removeEventListener("scroll",this.__onScroll,!0)}),this.__positionTargetAncestorRootNodes=null),this.__observePositionTargetMove&&(this.__observePositionTargetMove(),this.__observePositionTargetMove=null)}__updatePositionSettings(e,t){if(this.__removeUpdatePositionEventListeners(),t&&(t.__overlay=null,Me.unobserve(t),e&&(this.__addUpdatePositionEventListeners(),t.__overlay=this,Me.observe(t))),e){const e=getComputedStyle(this);this.__margins||(this.__margins={},["top","bottom","left","right"].forEach(t=>{this.__margins[t]=parseInt(e[t],10)})),this._updatePosition(),requestAnimationFrame(()=>this._updatePosition())}}__onScroll(e){e.target instanceof Node&&this._deepContains(e.target)||this._updatePosition()}__resetPosition(){this.__margins=null,Object.assign(this.style,{justifyContent:"",alignItems:"",top:"",bottom:"",left:"",right:""}),ye(this,"bottom-aligned",!1),ye(this,"top-aligned",!1),ye(this,"end-aligned",!1),ye(this,"start-aligned",!1)}_updatePosition(){if(!this.positionTarget||!this.opened||!this.__margins)return;const e=this.positionTarget.getBoundingClientRect();if(0===e.width&&0===e.height&&this.opened)return void(this.opened=!1);const t=this.__shouldAlignStartVertically(e);this.style.justifyContent=t?"flex-start":"flex-end";const i=this.__isRTL,n=this.__shouldAlignStartHorizontally(e,i),a=!i&&n||i&&!n;this.style.alignItems=a?"flex-start":"flex-end";const s=this.getBoundingClientRect(),o=this.__calculatePositionInOneDimension(e,s,this.noVerticalOverlap,Te,this,t),r=this.__calculatePositionInOneDimension(e,s,this.noHorizontalOverlap,Ie,this,n);Object.assign(this.style,o,r),ye(this,"bottom-aligned",!t),ye(this,"top-aligned",t),ye(this,"end-aligned",!a),ye(this,"start-aligned",a)}__shouldAlignStartHorizontally(e,t){const i=Math.max(this.__oldContentWidth||0,this.$.overlay.offsetWidth);this.__oldContentWidth=this.$.overlay.offsetWidth;const n=Math.min(window.innerWidth,document.documentElement.clientWidth),a=!t&&"start"===this.horizontalAlign||t&&"end"===this.horizontalAlign;return this.__shouldAlignStart(e,i,n,this.__margins,a,this.noHorizontalOverlap,Ie)}__shouldAlignStartVertically(e){const t=this.requiredVerticalSpace||Math.max(this.__oldContentHeight||0,this.$.overlay.offsetHeight);this.__oldContentHeight=this.$.overlay.offsetHeight;const i=Math.min(window.innerHeight,document.documentElement.clientHeight),n="top"===this.verticalAlign;return this.__shouldAlignStart(e,t,i,this.__margins,n,this.noVerticalOverlap,Te)}__shouldAlignStart(e,t,i,n,a,s,o){const r=i-e[s?o.end:o.start]-n[o.end],l=e[s?o.start:o.end]-n[o.start],d=a?r:l;return a===(d>(a?l:r)||d>t)}__adjustBottomProperty(e,t,i){let n;if(e===t.end){if(t.end===Te.end){const e=Math.min(window.innerHeight,document.documentElement.clientHeight);if(i>e&&this.__oldViewportHeight){n=i-(this.__oldViewportHeight-e)}this.__oldViewportHeight=e}if(t.end===Ie.end){const e=Math.min(window.innerWidth,document.documentElement.clientWidth);if(i>e&&this.__oldViewportWidth){n=i-(this.__oldViewportWidth-e)}this.__oldViewportWidth=e}}return n}__calculatePositionInOneDimension(e,t,i,n,a,s){const o=s?n.start:n.end,r=s?n.end:n.start,l=parseFloat(a.style[o]||getComputedStyle(a)[o]),d=this.__adjustBottomProperty(o,n,l),h=t[s?n.start:n.end]-e[i===s?n.end:n.start],c=d?`${d}px`:`${l+h*(s?-1:1)}px`;return{[o]:c,[r]:""}}},Oe=e=>class extends(Ne(we(e))){_initFocus(){}_shouldCloseOnOutsideClick(e){return!e.composedPath().includes(this.positionTarget)}_mouseDownListener(e){super._mouseDownListener(e),this._shouldCloseOnOutsideClick(e)&&!ne(e.composedPath()[0])&&e.preventDefault()}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Pe extends(Oe(v(H(k(F(o)))))){static get is(){return"vaadin-date-picker-overlay"}static get styles(){return[G,X]}render(){return s`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `}get _contentRoot(){return this.owner._overlayContent}}h(Pe);const Le=/\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,Be=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;function Fe(e,t){if("function"!=typeof e)return;const i=Le.exec(e.toString());if(i)try{e=new Function(i[1])}catch(e){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",e)}return e(t)}window.Vaadin=window.Vaadin||{};const Re=function(e,t){if(window.Vaadin.developmentMode)return Fe(e,t)};function Ve(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(Be?!(Be&&Object.keys(Be).map(e=>Be[e]).filter(e=>e.productionMode).length>0):!Fe(function(){return!0}))}catch(e){return!1}}());
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let $e=0,je=0;const ze=[];let We=!1;const qe={after:e=>({run:t=>window.setTimeout(t,e),cancel(e){window.clearTimeout(e)}}),run:(e,t)=>window.setTimeout(e,t),cancel(e){window.clearTimeout(e)}},He={run:e=>window.requestAnimationFrame(e),cancel(e){window.cancelAnimationFrame(e)}},Ye={run:e=>window.requestIdleCallback?window.requestIdleCallback(e):window.setTimeout(e,16),cancel(e){window.cancelIdleCallback?window.cancelIdleCallback(e):window.clearTimeout(e)}},Ue={run(e){We||(We=!0,queueMicrotask(()=>function(){We=!1;const e=ze.length;for(let t=0;t<e;t++){const e=ze[t];if(e)try{e()}catch(e){setTimeout(()=>{throw e})}}ze.splice(0,e),je+=e}())),ze.push(e);const t=$e;return $e+=1,t},cancel(e){const t=e-je;if(t>=0){if(!ze[t])throw new Error(`invalid async handle: ${e}`);ze[t]=null}}},Ke=new Set;class Ge{static debounce(e,t,i){return e instanceof Ge?e._cancelAsync():e=new Ge,e.setConfig(t,i),e}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(e,t){this._asyncModule=e,this._callback=t,this._timer=this._asyncModule.run(()=>{this._timer=null,Ke.delete(this),this._callback()})}cancel(){this.isActive()&&(this._cancelAsync(),Ke.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}let Xe;
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
window.Vaadin||(window.Vaadin={}),window.Vaadin.registrations||(window.Vaadin.registrations=[]),window.Vaadin.developmentModeCallback||(window.Vaadin.developmentModeCallback={}),window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){Re(Ve)};const Ze=new Set,Qe=e=>class extends(v(e)){static _ensureRegistrations(){const{is:e}=this;if(e&&!Ze.has(e)){window.Vaadin.registrations.push(this),Ze.add(e);const i=window.Vaadin.developmentModeCallback;i&&(Xe=Ge.debounce(Xe,Ye,()=>{i["vaadin-usage-statistics"]()}),t=Xe,Ke.add(t))}var t}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'),this.constructor._ensureRegistrations()}};
/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Je{constructor(e,t,i={}){this.target=e,this.callback=t,this.forceInitial=i.forceInitial,this._storedNodes=[],this._isSlot=e instanceof HTMLSlotElement,this._connected=!1,this._scheduled=!1,this._boundSchedule=()=>{this._schedule()},this.connect(),i.syncInitial?this.flush():this._schedule()}connect(){this.target.addEventListener("slotchange",this._boundSchedule),this._connected=!0}disconnect(){this.target.removeEventListener("slotchange",this._boundSchedule),this._connected=!1}_schedule(){this._scheduled||(this._scheduled=!0,queueMicrotask(()=>{this._scheduled&&this.flush()}))}flush(){this._connected&&(this._scheduled=!1,this._processNodes())}_collectNodes(){const e=this._isSlot?[this.target]:[...this.target.querySelectorAll("slot")];return[...new Set(e.flatMap(e=>e.assignedNodes({flatten:!0})))]}_groupNodesBySlot(e){const t=new Map;return e.forEach(e=>{const i=e.assignedSlot;t.set(i,t.get(i)??[]),t.get(i).push(e)}),t}_collectMovedNodes(e){const t=this._groupNodesBySlot(e),i=this._groupNodesBySlot(this._storedNodes),n=[];return t.forEach((e,t)=>{const a=i.get(t)||[];new Set(a).difference(new Set(e)).size>0||a.forEach((t,i)=>{e.indexOf(t)!==i&&n.push(t)})}),n}_processNodes(){const e=this._collectNodes(),t=e.filter(e=>!this._storedNodes.includes(e)),i=this._storedNodes.filter(t=>!e.includes(t)),n=this._collectMovedNodes(e);(t.length||i.length||n.length||this.forceInitial)&&this.callback({addedNodes:t,currentNodes:e,movedNodes:n,removedNodes:i}),this.forceInitial&&(this.forceInitial=!1),this._storedNodes=e}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let et=0;function tt(){return et++}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class it extends EventTarget{static generateId(e,t="default"){return`${t}-${e.localName}-${tt()}`}constructor(e,t,i,n={}){super();const{initializer:a,multiple:s,observe:o,useUniqueId:r,uniqueIdPrefix:l}=n;this.host=e,this.slotName=t,this.tagName=i,this.observe="boolean"!=typeof o||o,this.multiple="boolean"==typeof s&&s,this.slotInitializer=a,s&&(this.nodes=[]),r&&(this.defaultId=this.constructor.generateId(e,l||t))}hostConnected(){this.initialized||(this.multiple?this.initMultiple():this.initSingle(),this.observe&&this.observeSlot(),this.initialized=!0)}initSingle(){let e=this.getSlotChild();e?(this.node=e,this.initAddedNode(e)):(e=this.attachDefaultNode(),this.initNode(e))}initMultiple(){const e=this.getSlotChildren();if(0===e.length){const e=this.attachDefaultNode();e&&(this.nodes=[e],this.initNode(e))}else this.nodes=e,e.forEach(e=>{this.initAddedNode(e)})}attachDefaultNode(){const{host:e,slotName:t,tagName:i}=this;let n=this.defaultNode;return!n&&i&&(n=document.createElement(i),n instanceof Element&&(""!==t&&n.setAttribute("slot",t),this.defaultNode=n)),n&&(this.node=n,e.appendChild(n)),n}getSlotChildren(){const{slotName:e}=this;return Array.from(this.host.childNodes).filter(t=>(t.nodeType!==Node.ELEMENT_NODE||!t.hasAttribute("data-slot-ignore"))&&(t.nodeType===Node.ELEMENT_NODE&&t.slot===e||t.nodeType===Node.TEXT_NODE&&t.textContent.trim()&&""===e))}getSlotChild(){return this.getSlotChildren()[0]}initNode(e){const{slotInitializer:t}=this;t&&t(e,this.host)}initCustomNode(e){}teardownNode(e){}initAddedNode(e){e!==this.defaultNode&&(this.initCustomNode(e),this.initNode(e))}observeSlot(){const{slotName:e}=this,t=""===e?"slot:not([name])":`slot[name=${e}]`,i=this.host.shadowRoot.querySelector(t);new Je(i,({addedNodes:e,removedNodes:t})=>{const i=this.multiple?this.nodes:[this.node],n=e.filter(e=>!(function(e){return e.nodeType===Node.TEXT_NODE&&""===e.textContent.trim()}(e)||i.includes(e)||e.nodeType===Node.ELEMENT_NODE&&e.hasAttribute("data-slot-ignore")));t.length&&(this.nodes=i.filter(e=>!t.includes(e)),t.forEach(e=>{this.teardownNode(e)})),n?.length>0&&(this.multiple?(this.defaultNode&&this.defaultNode.remove(),this.nodes=[...i,...n].filter(e=>e!==this.defaultNode),n.forEach(e=>{this.initAddedNode(e)})):(this.node&&this.node.remove(),this.node=n[0],this.initAddedNode(this.node)))})}}
/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class nt extends it{constructor(e){super(e,"tooltip"),this.setTarget(e)}initCustomNode(e){e.target=this.target,void 0!==this.ariaTarget&&(e.ariaTarget=this.ariaTarget),void 0!==this.context&&(e.context=this.context),void 0!==this.manual&&(e.manual=this.manual),void 0!==this.position&&(e._position=this.position),void 0!==this.shouldShow&&(e.shouldShow=this.shouldShow),this.manual||this.host.setAttribute("has-tooltip",""),this.#f(e),e.addEventListener("content-changed",this.#m)}teardownNode(e){this.manual||this.host.removeAttribute("has-tooltip"),e.removeEventListener("content-changed",this.#m),this.#f(null)}setAriaTarget(e){this.ariaTarget=e;const t=this.node;t&&(t.ariaTarget=e)}setContext(e){this.context=e;const t=this.node;t&&(t.context=e)}setManual(e){this.manual=e;const t=this.node;t&&(t.manual=e)}setPosition(e){this.position=e;const t=this.node;t&&(t._position=e)}setShouldShow(e){this.shouldShow=e;const t=this.node;t&&(t.shouldShow=e)}setTarget(e){this.target=e;const t=this.node;t&&(t.target=e)}open(e){const t=this.node;t?.isConnected&&t._stateController.open(e)}close(e){const t=this.node;t&&t._stateController.close(e)}#m=e=>{this.#f(e.target)};#f(e){this.dispatchEvent(new CustomEvent("tooltip-changed",{detail:{node:e}}))}}
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const at=a`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--vaadin-button-gap, 0 var(--vaadin-gap-s));
    white-space: var(--vaadin-button-label-wrap, normal);
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    cursor: var(--vaadin-clickable-cursor);
    box-sizing: border-box;
    flex-shrink: 0;
    height: var(--vaadin-button-height, fit-content);
    margin: var(--vaadin-button-margin, 0);
    padding: var(--vaadin-button-padding, var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container));
    font-family: var(--vaadin-button-font-family, inherit);
    font-size: var(--vaadin-button-font-size, inherit);
    line-height: var(--vaadin-button-line-height, inherit);
    font-weight: var(--vaadin-button-font-weight, 500);
    color: var(--vaadin-button-text-color, var(--vaadin-text-color));
    background: var(--vaadin-button-background, var(--vaadin-background-container));
    background-origin: border-box;
    border: var(--vaadin-button-border-width, 1px) solid
      var(--vaadin-button-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-button-border-radius, var(--vaadin-radius-m));
    touch-action: manipulation;
  }

  :host([hidden]) {
    display: none !important;
  }

  .vaadin-button-container,
  [part='prefix'],
  [part='suffix'] {
    display: contents;
  }

  [part='label'] {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host(:is([focus-ring], :focus-visible)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  :host([theme~='primary']) {
    --vaadin-button-background: var(--vaadin-text-color);
    --vaadin-button-text-color: var(--vaadin-background-color);
    --vaadin-button-border-color: transparent;
  }

  :host([theme~='tertiary']) {
    background: transparent;
    border-color: transparent;
  }

  :host([disabled]) {
    pointer-events: var(--_vaadin-button-disabled-pointer-events, none);
    cursor: var(--vaadin-disabled-cursor);
    opacity: 0.5;
  }

  :host([disabled][theme~='primary']) {
    --vaadin-button-text-color: var(--vaadin-background-container-strong);
    --vaadin-button-background: var(--vaadin-text-color-disabled);
  }

  @media (forced-colors: active) {
    :host {
      --vaadin-button-border-width: 1px;
      --vaadin-button-background: ButtonFace;
      --vaadin-button-text-color: ButtonText;
    }

    :host([theme~='primary']) {
      forced-color-adjust: none;
      --vaadin-button-background: CanvasText;
      --vaadin-button-text-color: Canvas;
      --vaadin-icon-color: Canvas;
    }

    ::slotted(*) {
      forced-color-adjust: auto;
    }

    :host([disabled]) {
      --vaadin-button-background: transparent !important;
      --vaadin-button-border-color: GrayText !important;
      --vaadin-button-text-color: GrayText !important;
      opacity: 1;
    }
  }
`
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/,st="string"==typeof document.head.style.touchAction,ot="__polymerGestures",rt="__polymerGesturesHandled",lt="__polymerGesturesTouchAction",dt=["mousedown","mousemove","mouseup","click"],ht=[0,1,4,2],ct=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(e){return!1}}();function ut(e){return dt.indexOf(e)>-1}let pt=!1;function vt(e){ut(e)}!function(){try{const e=Object.defineProperty({},"passive",{get(){pt=!0}});window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(e){}}();const _t=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u),gt={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function ft(e){const t=e.type;if(!ut(t))return!1;if("mousemove"===t){let t=e.buttons??1;return e instanceof window.MouseEvent&&!ct&&(t=ht[e.which]||0),Boolean(1&t)}return 0===(e.button??0)}const mt={touch:{x:0,y:0,id:-1,scrollDecided:!1}};function bt(e,t,i){e.movefn=t,e.upfn=i,document.addEventListener("mousemove",t),document.addEventListener("mouseup",i)}function yt(e){document.removeEventListener("mousemove",e.movefn),document.removeEventListener("mouseup",e.upfn),e.movefn=null,e.upfn=null}const wt=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:e=>e.composedPath&&e.composedPath()||[],xt={},kt=[];function Dt(e){const t=wt(e);return t.length>0?t[0]:e.target}function Ct(e){const t=e.type,i=e.currentTarget[ot];if(!i)return;const n=i[t];if(!n)return;if(!e[rt]&&(e[rt]={},t.startsWith("touch"))){const i=e.changedTouches[0];if("touchstart"===t&&1===e.touches.length&&(mt.touch.id=i.identifier),mt.touch.id!==i.identifier)return;st||"touchstart"!==t&&"touchmove"!==t||function(e){const t=e.changedTouches[0],i=e.type;if("touchstart"===i)mt.touch.x=t.clientX,mt.touch.y=t.clientY,mt.touch.scrollDecided=!1;else if("touchmove"===i){if(mt.touch.scrollDecided)return;mt.touch.scrollDecided=!0;const i=function(e){let t="auto";const i=wt(e);for(let e,n=0;n<i.length;n++)if(e=i[n],e[lt]){t=e[lt];break}return t}(e);let n=!1;const a=Math.abs(mt.touch.x-t.clientX),s=Math.abs(mt.touch.y-t.clientY);e.cancelable&&("none"===i?n=!0:"pan-x"===i?n=s>a:"pan-y"===i&&(n=a>s)),n?e.preventDefault():Tt("track")}}(e)}const a=e[rt];if(!a.skip){for(let t,i=0;i<kt.length;i++)t=kt[i],n[t.name]&&!a[t.name]&&t.flow&&t.flow.start.indexOf(e.type)>-1&&t.reset&&t.reset();for(let i,s=0;s<kt.length;s++)i=kt[s],n[i.name]&&!a[i.name]&&(a[i.name]=!0,i[t](e))}}function St(e,t,i){return!!xt[t]&&(function(e,t,i){const n=xt[t],a=n.deps,s=n.name;let o=e[ot];o||(e[ot]=o={});for(let t,i,n=0;n<a.length;n++)t=a[n],_t&&ut(t)&&"click"!==t||(i=o[t],i||(o[t]=i={_count:0}),0===i._count&&e.addEventListener(t,Ct,vt(t)),i[s]=(i[s]||0)+1,i._count=(i._count||0)+1);e.addEventListener(t,i),n.touchAction&&function(e,t){st&&e instanceof HTMLElement&&Ue.run(()=>{e.style.touchAction=t});e[lt]=t}(e,n.touchAction)}(e,t,i),!0)}function Et(e){kt.push(e),e.emits.forEach(t=>{xt[t]=e})}function At(e,t,i){const n=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(n.detail=i,e.dispatchEvent(n),n.defaultPrevented){const e=i.preventer||i.sourceEvent;e?.preventDefault&&e.preventDefault()}}function Tt(e){const t=function(e){for(let t,i=0;i<kt.length;i++){t=kt[i];for(let i,n=0;n<t.emits.length;n++)if(i=t.emits[n],i===e)return t}return null}(e);t.info&&(t.info.prevent=!0)}function It(e,t,i,n){t&&At(t,e,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:n,prevent:e=>Tt(e)})}function Mt(e,t,i){if(e.prevent)return!1;if(e.started)return!0;const n=Math.abs(e.x-t),a=Math.abs(e.y-i);return n>=5||a>=5}function Nt(e,t,i){if(!t)return;const n=e.moves[e.moves.length-2],a=e.moves[e.moves.length-1],s=a.x-e.x,o=a.y-e.y;let r,l=0;n&&(r=a.x-n.x,l=a.y-n.y),At(t,"track",{state:e.state,x:i.clientX,y:i.clientY,dx:s,dy:o,ddx:r,ddy:l,sourceEvent:i,hover:()=>function(e,t){let i=document.elementFromPoint(e,t),n=i;for(;n?.shadowRoot&&!window.ShadyDOM;){const a=n;if(n=n.shadowRoot.elementFromPoint(e,t),a===n)break;n&&(i=n)}return i}(i.clientX,i.clientY)})}function Ot(e,t,i){const n=Math.abs(t.clientX-e.x),a=Math.abs(t.clientY-e.y),s=Dt(i||t);!s||gt[s.localName]&&s.hasAttribute("disabled")||(isNaN(n)||isNaN(a)||n<=25&&a<=25||function(e){if("click"===e.type){if(0===e.detail)return!0;const t=Dt(e);if(!t.nodeType||t.nodeType!==Node.ELEMENT_NODE)return!0;const i=t.getBoundingClientRect(),n=e.pageX,a=e.pageY;return!(n>=i.left&&n<=i.right&&a>=i.top&&a<=i.bottom)}return!1}(t))&&(e.prevent||At(s,"tap",{x:t.clientX,y:t.clientY,sourceEvent:t,preventer:i}))}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */Et({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){yt(this.info)},mousedown(e){if(!ft(e))return;const t=Dt(e),i=this;bt(this.info,e=>{ft(e)||(It("up",t,e),yt(i.info))},e=>{ft(e)&&It("up",t,e),yt(i.info)}),It("down",t,e)},touchstart(e){It("down",Dt(e),e.changedTouches[0],e)},touchend(e){It("up",Dt(e),e.changedTouches[0],e)}}),Et({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(e){this.moves.length>2&&this.moves.shift(),this.moves.push(e)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,yt(this.info)},mousedown(e){if(!ft(e))return;const t=Dt(e),i=this,n=e=>{const n=e.clientX,a=e.clientY;Mt(i.info,n,a)&&(i.info.state=i.info.started?"mouseup"===e.type?"end":"track":"start","start"===i.info.state&&Tt("tap"),i.info.addMove({x:n,y:a}),ft(e)||(i.info.state="end",yt(i.info)),t&&Nt(i.info,t,e),i.info.started=!0)};bt(this.info,n,e=>{i.info.started&&n(e),yt(i.info)}),this.info.x=e.clientX,this.info.y=e.clientY},touchstart(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchmove(e){const t=Dt(e),i=e.changedTouches[0],n=i.clientX,a=i.clientY;Mt(this.info,n,a)&&("start"===this.info.state&&Tt("tap"),this.info.addMove({x:n,y:a}),Nt(this.info,t,i),this.info.state="track",this.info.started=!0)},touchend(e){const t=Dt(e),i=e.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),Nt(this.info,t,i))}}),Et({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(e){ft(e)&&(this.info.x=e.clientX,this.info.y=e.clientY)},click(e){ft(e)&&Ot(this.info,e)},touchstart(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchend(e){Ot(this.info,e.changedTouches[0],e)}});const Pt=g(e=>class extends e{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}_disabledChanged(e){this._setAriaDisabled(e)}_setAriaDisabled(e){De(this,"aria-disabled",e)}click(){this.disabled||super.click()}}),Lt=g(e=>class extends e{ready(){super.ready(),this.addEventListener("keydown",e=>{this._onKeyDown(e)}),this.addEventListener("keyup",e=>{this._onKeyUp(e)})}_onKeyDown(e){switch(e.key){case"Enter":this._onEnter(e);break;case"Escape":this._onEscape(e)}}_onKeyUp(e){}_onEnter(e){}_onEscape(e){}}),Bt=e=>class extends(Pt(Lt(e))){get _activeKeys(){return[" "]}ready(){super.ready(),St(this,"down",e=>{this._shouldSetActive(e)&&this._setActive(!0)}),St(this,"up",()=>{this._setActive(!1)})}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(e){return!this.disabled}_onKeyDown(e){super._onKeyDown(e),this._shouldSetActive(e)&&this._activeKeys.includes(e.key)&&(this._setActive(!0),document.addEventListener("keyup",e=>{this._activeKeys.includes(e.key)&&this._setActive(!1)},{once:!0}))}_setActive(e){this.toggleAttribute("active",e)}},Ft=g(e=>class extends e{get _keyboardActive(){return J()}ready(){this.addEventListener("focusin",e=>{this._shouldSetFocus(e)&&this._setFocused(!0)}),this.addEventListener("focusout",e=>{this._shouldRemoveFocus(e)&&this._setFocused(!1)}),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}focus(e){super.focus(e),!1!==e?.focusVisible&&this.setAttribute("focus-ring","")}_setFocused(e){this.toggleAttribute("focused",e),this.toggleAttribute("focus-ring",e&&this._keyboardActive)}_shouldSetFocus(e){return!0}_shouldRemoveFocus(e){return!0}}),Rt=e=>class extends(Pt(e)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged",sync:!0},_lastTabIndex:{type:Number}}}_disabledChanged(e,t){super._disabledChanged(e,t),this.__shouldAllowFocusWhenDisabled()||(e?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.setAttribute("tabindex","-1")):t&&(void 0!==this._lastTabIndex?this.setAttribute("tabindex",this._lastTabIndex):this.tabindex=void 0))}_tabindexChanged(e){this.__shouldAllowFocusWhenDisabled()||this.disabled&&-1!==e&&(this._lastTabIndex=e,this.setAttribute("tabindex","-1"))}focus(e){this.disabled&&!this.__shouldAllowFocusWhenDisabled()||super.focus(e)}__shouldAllowFocusWhenDisabled(){return!1}},Vt=["mousedown","mouseup","click","dblclick","keypress","keydown","keyup"],$t=e=>class extends(Bt(Rt(Ft(e)))){constructor(){super(),this.__onInteractionEvent=this.__onInteractionEvent.bind(this),Vt.forEach(e=>{this.addEventListener(e,this.__onInteractionEvent,!0)}),this.tabindex=0}get _activeKeys(){return["Enter"," "]}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","button"),this.__shouldAllowFocusWhenDisabled()&&this.style.setProperty("--_vaadin-button-disabled-pointer-events","auto")}_onKeyDown(e){super._onKeyDown(e),e.altKey||e.shiftKey||e.ctrlKey||e.metaKey||this._activeKeys.includes(e.key)&&(e.preventDefault(),this.click())}__onInteractionEvent(e){this.__shouldSuppressInteractionEvent(e)&&e.stopImmediatePropagation()}__shouldSuppressInteractionEvent(e){return this.disabled}};
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class jt extends($t(Qe(H(k(F(o)))))){static get is(){return"vaadin-button"}static get styles(){return at}static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}render(){return s`
      <div class="vaadin-button-container" role="presentation">
        <span part="prefix" aria-hidden="true">
          <slot name="prefix"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="suffix" aria-hidden="true">
          <slot name="suffix"></slot>
        </span>

        <slot name="tooltip"></slot>
      </div>
    `}ready(){super.ready(),this._tooltipController=new nt(this),this.addController(this._tooltipController)}__shouldAllowFocusWhenDisabled(){return window.Vaadin.featureFlags.accessibleDisabledButtons}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function zt(e,t,i){const n=new Date(0,0);return n.setFullYear(e),n.setMonth(t),n.setDate(i),n}function Wt(e){return zt(e.getFullYear(),e.getMonth(),1)}function qt(e){return zt(e.getFullYear(),e.getMonth()+1,0)}function Ht(e){return t=e.getFullYear(),i=e.getMonth(),12*t+i;var t,i}function Yt(e){return zt(0,e,1)}function Ut(e){const t=new Date(e);return t.setHours(0,0,0,0),t}function Kt(e,t,i=Ut){return e instanceof Date&&t instanceof Date&&i(e).getTime()===i(t).getTime()}function Gt(e){return{day:e.getDate(),month:e.getMonth(),year:e.getFullYear()}}function Xt(e,t,i,n){let a=!1;if("function"==typeof n&&e){a=n(Gt(e))}return(!t||e>=t)&&(!i||e<=i)&&!a}function Zt(e,t,i,n,a){return Xt(e,t,i,n)&&!a?.isDateDisabled(e)}function Qt(e,t){return t.filter(e=>void 0!==e).reduce((t,i)=>{if(!i)return t;if(!t)return i;return Math.abs(e.getTime()-i.getTime())<Math.abs(t.getTime()-e.getTime())?i:t})}function Jt(e){const t=new Date,i=new Date(t);return i.setDate(1),i.setMonth(parseInt(e)+t.getMonth()),i}h(jt);const ei=/^([-+]\d{1,6}|\d{2,4})-(\d{1,2})-(\d{1,2})$/u;function ti(e){const t=function(e){const t=ei.exec(e);if(t)return{year:parseInt(t[1],10),month:parseInt(t[2],10)-1,day:parseInt(t[3],10)}}(e);if(!t)return;const i=zt(t.year,t.month,t.day);return i.getMonth()===t.month&&i.getDate()===t.day?i:void 0}function ii(e){return e instanceof Date?function(e){const t=(e,t="00")=>(t+e).substr((t+e).length-t.length);let i="",n="0000",a=e.year;return a<0?(a=-a,i="-",n="000000"):e.year>=1e4&&(i="+",n="000000"),[i+t(a,n),t(e.month+1),t(e.day)].join("-")}({year:e.getFullYear(),month:e.getMonth(),day:e.getDate()}):""}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ni=document.createElement("template");ni.innerHTML='\n  <style>\n    :host {\n      display: block;\n      overflow: hidden;\n      height: 500px;\n    }\n\n    #scroller {\n      position: relative;\n      height: 100%;\n      overflow: auto;\n      /* Prevent browser scroll anchoring from overriding the virtual scroll position. */\n      overflow-anchor: none;\n      outline: none;\n      overflow-x: hidden;\n      scrollbar-width: none;\n    }\n\n    #scroller::-webkit-scrollbar {\n      display: none;\n    }\n\n    .buffer {\n      position: absolute;\n      width: var(--vaadin-infinite-scroller-buffer-width, 100%);\n      box-sizing: border-box;\n      top: var(--vaadin-infinite-scroller-buffer-offset, 0);\n    }\n\n    ::slotted(div) {\n      height: var(--vaadin-infinite-scroller-item-height);\n    }\n  </style>\n\n  <div id="scroller" tabindex="-1">\n    <div class="buffer"></div>\n    <div class="buffer"></div>\n    <div id="fullHeight"></div>\n  </div>\n';class ai extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}).appendChild(ni.content.cloneNode(!0)),this.bufferSize=20,this._initialScroll=5e5,this._initialIndex=0,this._activated=!1}get active(){return this._activated}set active(e){e&&!this._activated&&(this._createPool(),this._activated=!0)}get bufferOffset(){return this._buffers[0].offsetTop}get itemHeight(){if(!this._itemHeightVal){const e=getComputedStyle(this).getPropertyValue("--vaadin-infinite-scroller-item-height"),t="background-position";this.$.fullHeight.style.setProperty(t,e);const i=getComputedStyle(this.$.fullHeight).getPropertyValue(t);this.$.fullHeight.style.removeProperty(t),this._itemHeightVal=parseFloat(i)}return this._itemHeightVal}get _bufferHeight(){return this.itemHeight*this.bufferSize}get position(){return(this.$.scroller.scrollTop-this._buffers[0].translateY)/this.itemHeight+this._firstIndex}set position(e){this._preventScrollEvent=!0,e>this._firstIndex&&e<this._firstIndex+2*this.bufferSize?this.$.scroller.scrollTop=this.itemHeight*(e-this._firstIndex)+this._buffers[0].translateY:(this._initialIndex=~~e,this.reset(),this._scrollDisabled=!0,this.$.scroller.scrollTop+=e%1*this.itemHeight,this._scrollDisabled=!1)}connectedCallback(){this._ready||(this._ready=!0,this.$={},this.shadowRoot.querySelectorAll("[id]").forEach(e=>{this.$[e.id]=e}),this.$.scroller.addEventListener("scroll",()=>this._scroll()),this._buffers=[...this.shadowRoot.querySelectorAll(".buffer")],this.$.fullHeight.style.height=2*this._initialScroll+"px")}disconnectedCallback(){this._debouncerScrollFinish&&this._debouncerScrollFinish.cancel(),this._debouncerUpdateClones&&this._debouncerUpdateClones.cancel(),this.__pendingFinishInit&&cancelAnimationFrame(this.__pendingFinishInit)}forceUpdate(){this._debouncerScrollFinish&&this._debouncerScrollFinish.flush(),this._debouncerUpdateClones&&(this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones(),this._debouncerUpdateClones.cancel())}_createElement(){}_updateElement(e,t){}_finishInit(){this._initDone||(this._buffers.forEach(e=>{[...e.children].forEach(e=>{this._ensureStampedInstance(e._itemWrapper)})}),this._buffers[0].translateY||this.reset(),this._initDone=!0,this.dispatchEvent(new CustomEvent("init-done")))}_translateBuffer(e){const t=e?1:0;this._buffers[t].translateY=this._buffers[t?0:1].translateY+this._bufferHeight*(t?-1:1),this._buffers[t].style.transform=`translate3d(0, ${this._buffers[t].translateY}px, 0)`,this._buffers[t].updated=!1,this._buffers.reverse()}_scroll(){if(this._scrollDisabled)return;const e=this.$.scroller.scrollTop;(e<this._bufferHeight||e>2*this._initialScroll-this._bufferHeight)&&(this._initialIndex=~~this.position,this.reset());const t=this.itemHeight+this.bufferOffset,i=e>this._buffers[1].translateY+t,n=e<this._buffers[0].translateY+t;(i||n)&&(this._translateBuffer(n),this._updateClones()),this._preventScrollEvent||this.dispatchEvent(new CustomEvent("custom-scroll",{bubbles:!1,composed:!0})),this._preventScrollEvent=!1,this._debouncerScrollFinish=Ge.debounce(this._debouncerScrollFinish,qe.after(200),()=>{const e=this.$.scroller.getBoundingClientRect();this._isVisible(this._buffers[0],e)||this._isVisible(this._buffers[1],e)||(this.position=this.position)})}reset(){this._activated&&this.isConnected&&(this._itemHeightVal=null,this._scrollDisabled=!0,this.$.scroller.scrollTop=this._initialScroll,this._buffers[0].translateY=this._initialScroll-this._bufferHeight,this._buffers[1].translateY=this._initialScroll,this._buffers.forEach(e=>{e.style.transform=`translate3d(0, ${e.translateY}px, 0)`}),this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones(!0),this._debouncerUpdateClones=Ge.debounce(this._debouncerUpdateClones,qe.after(200),()=>{this._buffers[0].updated=this._buffers[1].updated=!1,this._updateClones()}),this._scrollDisabled=!1)}_createPool(){const e=this.innerHeight;this._buffers.forEach(t=>{for(let i=0;i<this.bufferSize;i++){const n=document.createElement("div");n.instance={};const a=`vaadin-infinite-scroller-item-content-${tt()}`,s=document.createElement("slot");s.setAttribute("name",a),s._itemWrapper=n,t.appendChild(s),n.setAttribute("slot",a),this.appendChild(n),this.itemHeight*i<=e&&this._ensureStampedInstance(n)}}),this.__pendingFinishInit=requestAnimationFrame(()=>{this._finishInit(),this.__pendingFinishInit=null})}_ensureStampedInstance(e){if(e.firstElementChild)return;const t=e.instance;e.instance=this._createElement(),e.appendChild(e.instance),Object.keys(t).forEach(i=>{e.instance[i]=t[i]})}_updateClones(e){this._firstIndex=Math.round((this._buffers[0].translateY-this._initialScroll)/this.itemHeight)+this._initialIndex;const t=e?this.$.scroller.getBoundingClientRect():void 0;this._buffers.forEach((i,n)=>{if(!i.updated){const a=this._firstIndex+this.bufferSize*n;[...i.children].forEach((i,n)=>{const s=i._itemWrapper;e&&!this._isVisible(s,t)||this._updateElement(s.instance,a+n)}),i.updated=!0}})}_isVisible(e,t){const i=e.getBoundingClientRect();return i.bottom>t.top&&i.top<t.bottom}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const si=document.createElement("template");si.innerHTML="\n  <style>\n    :host {\n      --vaadin-infinite-scroller-item-height: 270px;\n      grid-area: months;\n      height: auto;\n    }\n  </style>\n";h(class extends ai{static get is(){return"vaadin-date-picker-month-scroller"}constructor(){super(),this.bufferSize=3,this.shadowRoot.appendChild(si.content.cloneNode(!0))}_createElement(){return document.createElement("vaadin-month-calendar")}_updateElement(e,t){e.month=Jt(t)}});
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const oi=document.createElement("template");oi.innerHTML="\n  <style>\n    :host {\n      --vaadin-infinite-scroller-item-height: 80px;\n      width: 50px;\n      display: block;\n      position: relative;\n      grid-area: years;\n      height: auto;\n      -webkit-tap-highlight-color: transparent;\n      -webkit-user-select: none;\n      user-select: none;\n      /* Center the year scroller position. */\n      --vaadin-infinite-scroller-buffer-offset: 50%;\n    }\n\n    :host::before {\n      content: '';\n      display: block;\n      background: transparent;\n      width: 0;\n      height: 0;\n      position: absolute;\n      left: 0;\n      top: 50%;\n      transform: translateY(-50%);\n      border-width: 6px;\n      border-style: solid;\n      border-color: transparent;\n      border-left-color: #000;\n    }\n  </style>\n";h(class extends ai{static get is(){return"vaadin-date-picker-year-scroller"}constructor(){super(),this.bufferSize=12,this.shadowRoot.appendChild(oi.content.cloneNode(!0))}_createElement(){return document.createElement("vaadin-date-picker-year")}_updateElement(e,t){e.year=this._yearAfterXYears(t)}_yearAfterXYears(e){const t=new Date,i=new Date(t);return i.setFullYear(parseInt(e)+t.getFullYear()),i.getFullYear()}});
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ri=a`
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
 */;class li extends(H(k(F(o)))){static get is(){return"vaadin-date-picker-year"}static get styles(){return ri}static get properties(){return{year:{type:String,sync:!0},selectedDate:{type:Object,sync:!0}}}render(){return s`
      <div part="year-number">${this.year}</div>
      <div part="year-separator" aria-hidden="true"></div>
    `}updated(e){super.updated(e),e.has("year")&&this.toggleAttribute("current",this.year===(new Date).getFullYear()),(e.has("year")||e.has("selectedDate"))&&this.toggleAttribute("selected",this.selectedDate&&this.selectedDate.getFullYear()===this.year)}}h(li);
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const di=a`
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
    --_range-edge: var(
      --vaadin-date-picker-date-in-range-border-color,
      var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color))
    );
    /* Optional edges along the band, off by default */
    --_range-edge-width: var(--vaadin-date-picker-date-in-range-border-width, 0px);
    /* Full height, so that the weeks of a range join into one calm area */
    --_range-band-height: 100%;
    isolation: isolate;
    border-radius: 0;
    background: linear-gradient(
        var(--_range-edge) var(--_range-edge-width),
        var(--_range-band) var(--_range-edge-width) calc(100% - var(--_range-edge-width)),
        var(--_range-edge) calc(100% - var(--_range-edge-width))
      )
      center / 100% var(--_range-band-height) no-repeat;
  }

  /* Round the band where it wraps to the next week, or where the month starts or ends */
  [part~='in-range']:is(:nth-child(2), td:empty + *) {
    border-start-start-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    border-end-start-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  [part~='in-range']:is(:last-child, :has(+ td:empty)) {
    border-start-end-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    border-end-end-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  [part~='in-range'][part~='range-start'] {
    background-position: right center;
    background-size: 50% var(--_range-band-height);
  }

  [part~='in-range'][part~='range-end'] {
    background-position: left center;
    background-size: 50% var(--_range-band-height);
  }

  /* Keep the band continuous across disabled dates, only their text is dimmed */
  [part~='in-range'][disabled] {
    opacity: 1;
  }

  [part~='in-range']::after {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  /*
   * The ends of a range, or a lone start, can be dragged to move them. A single-day
   * range is both, and dragging it selects a new range instead.
   */
  [part~='range-start']:not([part~='range-end']),
  [part~='range-end']:not([part~='range-start']) {
    cursor: grab;
  }

  /*
   * The end of the range being edited gets a lighter fill than the other end. An
   * outline would look like the focus indicator.
   */
  [part~='range-editing'] {
    color: var(--vaadin-date-picker-date-range-editing-color, var(--vaadin-text-color));
  }

  [part~='range-editing']::after {
    background: var(
      --vaadin-date-picker-date-range-editing-background,
      color-mix(in srgb, var(--_range-edge) 35%, var(--vaadin-background-color))
    );
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
 */,hi=e=>class extends(Ft(e)){static get properties(){return{month:{type:Object,value:new Date,sync:!0},selectedDate:{type:Object,notify:!0,sync:!0},focusedDate:{type:Object},rangeStart:{type:Object,sync:!0},rangeEnd:{type:Object,sync:!0},rangeEditing:{type:String,sync:!0},showWeekNumbers:{type:Boolean,value:!1},i18n:{type:Object},ignoreTaps:{type:Boolean},minDate:{type:Date,value:null,sync:!0},maxDate:{type:Date,value:null,sync:!0},isDateDisabled:{type:Function,value:()=>!1},_dateMetadataController:{type:Object,attribute:!1,sync:!0},enteredDate:{type:Date},disabled:{type:Boolean,reflectToAttribute:!0,computed:"__computeDisabled(month, minDate, maxDate)"},_days:{type:Array,computed:"__computeDays(month, i18n, minDate, maxDate, isDateDisabled)"},_weeks:{type:Array,computed:"__computeWeeks(_days)"},_notTapping:{type:Boolean},__hasFocus:{type:Boolean}}}static get observers(){return["__focusedDateChanged(focusedDate, _days)","_showWeekNumbersChanged(showWeekNumbers, i18n)"]}get focusableDateElement(){return[...this.shadowRoot.querySelectorAll("[part~=date]")].find(e=>Kt(e.date,this.focusedDate))}ready(){super.ready(),St(this.$.monthGrid,"tap",this._handleTap.bind(this))}_setFocused(e){super._setFocused(e),this.__hasFocus=e}__computeDisabled(e,t,i){const n=Wt(e),a=qt(e);return!(t&&i&&t.getFullYear()===i.getFullYear()&&t.getFullYear()===e.getFullYear()&&t.getMonth()===i.getMonth()&&t.getMonth()===e.getMonth()&&i.getDate()-t.getDate()>=0)&&(!Xt(n,t,i)&&!Xt(a,t,i))}_getTitle(e,t){if(void 0!==e&&void 0!==t)return t.formatTitle(t.monthNames[e.getMonth()],e.getFullYear())}_onMonthGridTouchStart(){this._notTapping=!1,setTimeout(()=>{this._notTapping=!0},300)}_dateAdd(e,t){e.setDate(e.getDate()+t)}_applyFirstDayOfWeek(e,t){if(void 0!==e&&void 0!==t)return e.slice(t).concat(e.slice(0,t))}__computeWeekDayNames(e,t){if(void 0===e||void 0===t)return[];const{weekdays:i,weekdaysShort:n,firstDayOfWeek:a}=e,s=this._applyFirstDayOfWeek(n,a);return this._applyFirstDayOfWeek(i,a).map((e,t)=>({weekDay:e,weekDayShort:s[t]})).slice(0,7)}__focusedDateChanged(e,t){De(this,"aria-hidden",!(Array.isArray(t)&&t.some(t=>Kt(t,e))))}_getDate(e){return e?e.getDate():""}__computeShowWeekSeparator(e,t){return e&&1===t?.firstDayOfWeek}_isToday(e){return Kt(new Date,e)}__computeDays(e,t){if(void 0===e||void 0===t)return[];const i=Wt(e);for(;i.getDay()!==t.firstDayOfWeek;)this._dateAdd(i,-1);const n=[],a=i.getMonth(),s=e.getMonth();for(;i.getMonth()===s||i.getMonth()===a;)n.push(i.getMonth()===s?new Date(i.getTime()):null),this._dateAdd(i,1);return n}__computeWeeks(e){return e.reduce((e,t,i)=>(i%7==0&&e.push([]),e[e.length-1].push(t),e),[])}_handleTap(e){this.ignoreTaps||this._notTapping||!e.target.date||e.target.hasAttribute("disabled")||(this.selectedDate=e.target.date,this.dispatchEvent(new CustomEvent("date-tap",{detail:{date:e.target.date},bubbles:!0,composed:!0})))}_preventDefault(e){e.preventDefault()}__computeWeekNumber(e){return function(e){let t=e.getDay();0===t&&(t=7);const i=4-t,n=new Date(e.getTime()+24*i*3600*1e3),a=new Date(0,0);a.setFullYear(n.getFullYear());const s=n.getTime()-a.getTime(),o=Math.round(s/864e5);return Math.floor(o/7+1)}(e.reduce((e,t)=>!e&&t?t:e))}__computeDayAriaLabel(e){if(!e)return"";let t=`${this._getDate(e)} ${this.i18n.monthNames[e.getMonth()]} ${e.getFullYear()}, ${this.i18n.weekdays[e.getDay()]}`;this._isToday(e)&&(t+=`, ${this.i18n.today}`);const i=this.__getRangeRole(e);if(i){const{rangeStart:e,rangeEnd:n,inRange:a}=this.i18n;t+=`, ${{"range-start":e,"range-end":n,"in-range":a}[i]||i.replace("-"," ")}`}return t}_showWeekNumbersChanged(e,t){this.toggleAttribute("week-numbers",this.__computeShowWeekSeparator(e,t))}__computeDatePart(e,t,i,n,a,s,o,r){const l=["date"];this.__isDayDisabled(e,n,a,s)&&l.push("disabled"),e&&this.__isMonthPending()&&l.push("loading"),Kt(e,t)&&(r||Kt(e,o))&&l.push("focused"),this.__isDaySelected(e,i)&&l.push("selected"),Kt(e,this.rangeStart)&&l.push("range-start"),this.rangeStart&&Kt(e,this.rangeEnd)&&l.push("range-end"),this.__getRangeRole(e)&&this.rangeEnd&&!Kt(this.rangeStart,this.rangeEnd)&&l.push("in-range"),this.__isRangeEditingDate(e)&&l.push("range-editing"),this._isToday(e)&&l.push("today"),e<Ut(new Date)&&l.push("past"),e>Ut(new Date)&&l.push("future");const d=e&&this._dateMetadataController?.getMetadata(e)?.part;return d&&"string"==typeof d&&l.push(d),l.join(" ")}__isDaySelected(e,t){const i=this.__getRangeRole(e);return Kt(e,t)||"range-start"===i||"range-end"===i}__isRangeEditingDate(e){const{rangeStart:t,rangeEnd:i,rangeEditing:n}=this;return!(!(e&&t&&i)||Kt(t,i))&&Kt(e,"start"===n?t:"end"===n?i:null)}__getRangeRole(e){const{rangeStart:t,rangeEnd:i}=this;if(e&&t){if(Kt(e,t))return"range-start";if(i)return Kt(e,i)?"range-end":e>t&&e<i?"in-range":void 0}}__computeDayAriaSelected(e,t){return String(this.__isDaySelected(e,t))}__isMonthPending(){return!!this._dateMetadataController?.isMonthPending(this.month)}__isDayDisabled(e,t,i,n){return!Zt(e,t,i,n,this._dateMetadataController)}__computeDayAriaDisabled(e,t,i,n){if(void 0===e)return"false";return!!this._dateMetadataController?.provider||void 0!==t||void 0!==i||void 0!==n?String(this.__isDayDisabled(e,t,i,n)):"false"}__computeDayTabIndex(e,t){return Kt(e,t)?"0":"-1"}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ci extends(hi(H(k(F(o))))){static get is(){return"vaadin-month-calendar"}static get styles(){return di}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}render(){const e=this.__computeWeekDayNames(this.i18n,this.showWeekNumbers),t=this._weeks,i=!this.__computeShowWeekSeparator(this.showWeekNumbers,this.i18n);return s`
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
            ${e.map(e=>s`
                <th role="columnheader" part="weekday" scope="col" abbr="${e.weekDay}" aria-hidden="true">
                  ${e.weekDayShort}
                </th>
              `)}
          </tr>
        </thead>
        <tbody id="days-container">
          ${t.map(e=>s`
              <tr role="row">
                <td part="week-number" aria-hidden="true" ?hidden="${i}">
                  ${this.__computeWeekNumber(e)}
                </td>
                ${e.map(e=>s`
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
    `}}h(ci);
/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ui=a`
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      rotate: 1turn;
    }
  }

  [part='loader'] {
    animation:
      spin var(--vaadin-spinner-animation-duration, 0.7s) linear infinite,
      fade-in 0.15s 0.3s both;
    border: var(--vaadin-spinner-width, 2px) solid var(--vaadin-spinner-color, var(--vaadin-text-color));
    border-radius: 50%;
    box-sizing: border-box;
    height: var(--vaadin-spinner-size, 1lh);
    mask-image: radial-gradient(circle at 50% var(--vaadin-spinner-width, 2px), transparent 40%, #000 70%);
    pointer-events: none;
    width: var(--vaadin-spinner-size, 1lh);
  }

  :host(:not([loading])) [part~='loader'] {
    display: none;
  }

  @media (forced-colors: active) {
    [part='loader'] {
      forced-color-adjust: none;
      --vaadin-spinner-color: CanvasText;
    }
  }
`
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,pi=a`
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
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class vi{#b=null;constructor(e,t){this.query=e,this.callback=t}hostConnected(){this.#y(),this.#b=window.matchMedia(this.query),this.#w(),this.#x(this.#b)}hostDisconnected(){this.#y()}#w(){this.#b&&this.#b.addListener(this.#x)}#y(){this.#b&&this.#b.removeListener(this.#x),this.#b=null}#x=e=>{"function"==typeof this.callback&&this.callback(e.matches)}}
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const _i=e=>class extends e{static get properties(){return{scrollDuration:{type:Number,value:300},selectedDate:{type:Object,value:null,sync:!0},focusedDate:{type:Object,notify:!0,observer:"_focusedDateChanged",sync:!0},rangeStart:{type:Object,sync:!0},rangeEnd:{type:Object,sync:!0},rangePreview:{type:String,sync:!0},_hoveredDate:{type:Object,sync:!0},_calendarFocused:{type:Boolean,sync:!0},_dragMode:{type:String,sync:!0},_dragAnchor:{type:Object,sync:!0},_dragTarget:{type:Object,sync:!0},_focusedMonthDate:Number,initialPosition:{type:Object,observer:"_initialPositionChanged",sync:!0},_originDate:{type:Object,value:new Date},_visibleMonthIndex:Number,_desktopMode:{type:Boolean,observer:"_desktopModeChanged"},_desktopMediaQuery:{type:String,value:"(min-width: 375px)"},i18n:{type:Object},showWeekNumbers:{type:Boolean,value:!1},_ignoreTaps:Boolean,_notTapping:Boolean,minDate:{type:Object,sync:!0},maxDate:{type:Object,sync:!0},isDateDisabled:{type:Function},loading:{type:Boolean,value:!1,reflectToAttribute:!0},enteredDate:{type:Date,sync:!0},label:String,_cancelButton:{type:Object},_todayButton:{type:Object},_dateMetadataController:{type:Object,sync:!0},calendars:{type:Array,value:()=>[]},years:{type:Array,value:()=>[]}}}static get observers(){return["__updateCalendarsConfig(calendars, i18n, minDate, maxDate, showWeekNumbers, isDateDisabled, _theme, _dateMetadataController)","__updateCalendarsState(calendars, selectedDate, focusedDate, enteredDate, _ignoreTaps)","__updateCalendarsRange(calendars, rangeStart, rangeEnd, rangePreview, _hoveredDate, focusedDate, _calendarFocused, _dragTarget)","__updateCancelButton(_cancelButton, i18n)","__updateYears(years, selectedDate, _theme)"]}disconnectedCallback(){super.disconnectedCallback(),this.cancelLoadVisibleDateMetadata()}updated(e){super.updated(e),e.has("loading")&&De(this,"aria-busy",this.loading),e.has("i18n")&&De(this,"aria-label",this.i18n?.dialogAccessibleName),(e.has("calendars")||e.has("_dateMetadataController"))&&this.loadVisibleDateMetadata(),(e.has("_todayButton")||e.has("i18n")||e.has("minDate")||e.has("maxDate")||e.has("isDateDisabled"))&&this.updateTodayButton()}get __useSubMonthScrolling(){return this._monthScroller.clientHeight<this._monthScroller.itemHeight+this._monthScroller.bufferOffset}get focusableDateElement(){return this.calendars.map(e=>e.focusableDateElement).find(Boolean)}_initControllers(){this.addController(new vi(this._desktopMediaQuery,e=>{this._desktopMode=e})),this.addController(new it(this,"today-button","vaadin-button",{observe:!1,initializer:e=>{e.setAttribute("theme","tertiary"),e.addEventListener("keydown",e=>this.__onTodayButtonKeyDown(e)),e.addEventListener("click",this._onTodayTap.bind(this)),this._todayButton=e}})),this.addController(new it(this,"cancel-button","vaadin-button",{observe:!1,initializer:e=>{e.setAttribute("theme","tertiary"),e.addEventListener("keydown",e=>this.__onCancelButtonKeyDown(e)),e.addEventListener("click",this._cancel.bind(this)),this._cancelButton=e}})),this.__initMonthScroller(),this.__initYearScroller()}reset(){this._closeYearScroller(),this._monthScroller?.reset(),this._yearScroller?.reset()}focusCancel(){this._cancelButton.focus()}scrollToDate(e,t){const i=this.__useSubMonthScrolling?this._calculateWeekScrollOffset(e):0;this._scrollToPosition(this._differenceInMonths(e,this._originDate)+i,t),this._monthScroller.forceUpdate()}__initMonthScroller(){this.addController(new it(this,"months","vaadin-date-picker-month-scroller",{observe:!1,initializer:e=>{e.addEventListener("custom-scroll",()=>{this._onMonthScroll()}),e.addEventListener("touchstart",()=>{this._onMonthScrollTouchStart()}),e.addEventListener("keydown",e=>{this.__onMonthCalendarKeyDown(e)}),e.addEventListener("mousemove",e=>{const t=e.composedPath()[0].date||null;Kt(t,this._hoveredDate)||(this._hoveredDate=t),this._dragMode&&t&&this._dateSelectable(t)&&!Kt(t,this._dragTarget)&&(this._dragTarget=t)}),e.addEventListener("pointerdown",e=>{this.__onRangePointerDown(e)}),e.addEventListener("date-tap",e=>{this.__suppressTap&&(this.__suppressTap=!1,e.stopPropagation())},!0),e.addEventListener("mouseleave",()=>{this._hoveredDate=null}),e.addEventListener("focusin",()=>{this._calendarFocused=!0}),e.addEventListener("focusout",()=>{this._calendarFocused=!1}),e.addEventListener("init-done",()=>{const e=[...this.querySelectorAll("vaadin-month-calendar")];e.forEach(e=>{e.addEventListener("selected-date-changed",e=>{this.selectedDate=e.detail.value})}),this.calendars=e}),this._monthScroller=e}}))}__initYearScroller(){this.addController(new it(this,"years","vaadin-date-picker-year-scroller",{observe:!1,initializer:e=>{e.setAttribute("aria-hidden","true"),St(e,"tap",e=>{this._onYearTap(e)}),e.addEventListener("custom-scroll",()=>{this._onYearScroll()}),e.addEventListener("touchstart",()=>{this._onYearScrollTouchStart()}),e.addEventListener("init-done",()=>{this.years=[...this.querySelectorAll("vaadin-date-picker-year")]}),this._yearScroller=e}}))}__updateCancelButton(e,t){e&&(e.textContent=t?.cancel)}updateTodayButton(){const e=this._todayButton;e&&(e.textContent=this.i18n?.today,e.disabled=!this._isTodayAllowed())}loadVisibleDateMetadata(){const e=this._dateMetadataController;if(!e)return;const t=(this.calendars??[]).map(e=>e.month).filter(Boolean).map(e=>Ht(e));0!==t.length&&e.ensureRangeLoaded(Yt(Math.min(...t)),Yt(Math.max(...t)))}cancelLoadVisibleDateMetadata(){this._loadDateMetadataDebouncer?.cancel()}__updateCalendarsConfig(e,t,i,n,a,s,o,r){e?.length&&e.forEach(e=>{e.i18n=t,e.minDate=i,e.maxDate=n,e.isDateDisabled=s,e._dateMetadataController=r,r?.subscribe(e),e.showWeekNumbers=a,De(e,"theme",o)})}__scheduleLoadVisibleDateMetadata(){this._loadDateMetadataDebouncer=Ge.debounce(this._loadDateMetadataDebouncer,qe.after(200),()=>this.loadVisibleDateMetadata())}__updateCalendarsState(e,t,i,n,a){e?.length&&e.forEach(e=>{e.focusedDate=i,e.selectedDate=t,e.enteredDate=n,e.ignoreTaps=a})}__updateCalendarsRange(e,t,i,n,a,s,o){if(!e?.length)return;let r=t,l=i,d=n;const h=a||(o?s:null),c=this.__getDragRange();c?({start:r,end:l,editing:d}=c):h&&"end"===n&&t&&h>=t?l=h:h&&"start"===n&&i&&h<=i?r=h:h&&("end"===n&&t&&h<t||"start"===n&&i&&h>i)&&([r,l,d]=[h,null,"start"]),e.forEach(e=>{e.rangeStart=r,e.rangeEnd=l,e.rangeEditing=d})}__onRangePointerDown(e){this.__suppressTap=!1;const t=e.composedPath()[0].date;if(!this.rangePreview||"touch"===e.pointerType||0!==e.button||!t)return;if(!this._dateSelectable(t))return;const i=!Kt(this.rangeStart,this.rangeEnd);i&&Kt(t,this.rangeStart)?this._dragMode="start":i&&Kt(t,this.rangeEnd)?this._dragMode="end":this._dragMode="select",this._dragAnchor=t,this._dragTarget=t,this.__boundRangePointerUp||=()=>this.__onRangePointerUp(),document.addEventListener("pointerup",this.__boundRangePointerUp),document.addEventListener("pointercancel",this.__boundRangePointerUp)}__onRangePointerUp(){document.removeEventListener("pointerup",this.__boundRangePointerUp),document.removeEventListener("pointercancel",this.__boundRangePointerUp);const e=this.__getDragRange();this._dragMode=null,this._dragAnchor=null,this._dragTarget=null,e&&(this.__suppressTap=!0,this.dispatchEvent(new CustomEvent("range-drag-end",{detail:e})))}__getDragRange(){const{_dragMode:e,_dragAnchor:t,_dragTarget:i}=this;if(!e||!i||Kt(t,i))return null;let n,a,s;return[n,a,s]="select"===e?[t,i,"end"]:"start"===e?[i,this.rangeEnd,"start"]:[this.rangeStart,i,"end"],n&&a&&n>a&&([n,a]=[a,n],s="start"===s?"end":"start"),{start:n,end:a,editing:s,mode:e}}__updateYears(e,t,i){e?.length&&e.forEach(e=>{e.selectedDate=t,De(e,"theme",i)})}_selectDate(e){return!!this._dateSelectable(e)&&(this.selectedDate=e,this.dispatchEvent(new CustomEvent("date-selected",{detail:{date:e},bubbles:!0,composed:!0})),!0)}_desktopModeChanged(e){this.toggleAttribute("desktop",e)}_focusedDateChanged(e){this.revealDate(e)}revealDate(e,t=!0){if(!e)return;const i=this._differenceInMonths(e,this._originDate);if(this.__useSubMonthScrolling){const n=this._calculateWeekScrollOffset(e);return void this._scrollToPosition(i+n,t)}const n=this._monthScroller.position>i,a=Math.max(this._monthScroller.itemHeight,this._monthScroller.clientHeight-2*this._monthScroller.bufferOffset)/this._monthScroller.itemHeight,s=this._monthScroller.position+a-1<i;n?this._scrollToPosition(i,t):s&&this._scrollToPosition(i-a+1,t)}_calculateWeekScrollOffset(e){const t=Wt(e);let i=0;for(;t.getDate()<e.getDate();)t.setDate(t.getDate()+1),t.getDay()===this.i18n.firstDayOfWeek&&(i+=1);return i/6}_initialPositionChanged(e){this._monthScroller&&this._yearScroller&&(this._monthScroller.active=!0,this._yearScroller.active=!0),this.scrollToDate(e)}_repositionYearScroller(){const e=this._monthScroller.position;this._visibleMonthIndex=Math.floor(e),this._yearScroller.position=(e+this._originDate.getMonth())/12,this.__scheduleLoadVisibleDateMetadata()}_repositionMonthScroller(){this._monthScroller.position=12*this._yearScroller.position-this._originDate.getMonth(),this._visibleMonthIndex=Math.floor(this._monthScroller.position),this.__scheduleLoadVisibleDateMetadata()}_onMonthScroll(){this._repositionYearScroller(),this._doIgnoreTaps()}_onYearScroll(){this._repositionMonthScroller(),this._doIgnoreTaps()}_onYearScrollTouchStart(){this._notTapping=!1,setTimeout(()=>{this._notTapping=!0},300),this._repositionMonthScroller()}_onMonthScrollTouchStart(){this._repositionYearScroller()}_doIgnoreTaps(){this._ignoreTaps=!0,this._debouncer=Ge.debounce(this._debouncer,qe.after(300),()=>{this._ignoreTaps=!1})}_onTodayTap(){const e=this._getTodayMidnight();Math.abs(this._monthScroller.position-this._differenceInMonths(e,this._originDate))<.001?(this._selectDate(e),this._close()):this._scrollToCurrentMonth()}_scrollToCurrentMonth(){this.focusedDate&&(this.focusedDate=new Date),this.scrollToDate(new Date,!0)}_onYearTap(e){if(!this._ignoreTaps&&!this._notTapping){const t=(e.detail.y-(this._yearScroller.getBoundingClientRect().top+this._yearScroller.clientHeight/2))/this._yearScroller.itemHeight;this._scrollToPosition(this._monthScroller.position+12*t,!0)}}_scrollToPosition(e,t){if(void 0!==this._targetPosition)return void(this._targetPosition=e);if(!t)return this._monthScroller.position=e,this._monthScroller.forceUpdate(),this._targetPosition=void 0,this._repositionYearScroller(),void this.__tryFocusDate();let i;this._targetPosition=e,this._revealPromise=new Promise(e=>{i=e});let n=0;const a=this._monthScroller.position,s=e=>{n||(n=e);const t=e-n;if(t<this.scrollDuration){const e=(o=t,r=a,l=this._targetPosition-a,d=this.scrollDuration,(o/=d/2)<1?l/2*o*o+r:-l/2*((o-=1)*(o-2)-1)+r);this._monthScroller.position=e,window.requestAnimationFrame(s)}else this.dispatchEvent(new CustomEvent("scroll-animation-finished",{bubbles:!0,composed:!0,detail:{position:this._targetPosition,oldPosition:a}})),this._monthScroller.position=this._targetPosition,this._monthScroller.forceUpdate(),this._targetPosition=void 0,i(),this._revealPromise=void 0;var o,r,l,d;setTimeout(this._repositionYearScroller.bind(this),1)};window.requestAnimationFrame(s)}_toggleYearScroller(){this.toggleAttribute("years-visible")}_closeYearScroller(){this.removeAttribute("years-visible")}_yearAfterXMonths(e){return Jt(e).getFullYear()}_differenceInMonths(e,t){return Ht(e)-Ht(t)}_clear(){this._selectDate("")}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_cancel(){this.focusedDate=this.selectedDate,this._close()}__toggleDate(e){Kt(e,this.selectedDate)?(this._clear(),this.focusedDate=e):this._selectDate(e)}__onMonthCalendarKeyDown(e){let t=!1;switch(e.key){case"ArrowDown":this._moveFocusByDays(7),t=!0;break;case"ArrowUp":this._moveFocusByDays(-7),t=!0;break;case"ArrowRight":this._moveFocusByDays(this.__isRTL?-1:1),t=!0;break;case"ArrowLeft":this._moveFocusByDays(this.__isRTL?1:-1),t=!0;break;case"Enter":this._selectDate(this.focusedDate)&&(this._close(),t=!0);break;case" ":this.__toggleDate(this.focusedDate),t=!0;break;case"Home":this._moveFocusInsideMonth(this.focusedDate,"minDate"),t=!0;break;case"End":this._moveFocusInsideMonth(this.focusedDate,"maxDate"),t=!0;break;case"PageDown":this._moveFocusByMonths(e.shiftKey?12:1),t=!0;break;case"PageUp":this._moveFocusByMonths(e.shiftKey?-12:-1),t=!0;break;case"Tab":this._onTabKeyDown(e,"calendar")}t&&(e.preventDefault(),e.stopPropagation())}_onTabKeyDown(e,t){switch(e.stopPropagation(),t){case"calendar":e.shiftKey&&(e.preventDefault(),this.hasAttribute("fullscreen")?this.focusCancel():this.__focusInput());break;case"today":e.shiftKey&&(e.preventDefault(),this.focusDateElement());break;case"cancel":e.shiftKey||(e.preventDefault(),this.hasAttribute("fullscreen")?this.focusDateElement():this.__focusInput())}}__onTodayButtonKeyDown(e){"Tab"===e.key&&this._onTabKeyDown(e,"today")}__onCancelButtonKeyDown(e){"Tab"===e.key&&this._onTabKeyDown(e,"cancel")}__focusInput(){this.dispatchEvent(new CustomEvent("focus-input",{bubbles:!0,composed:!0}))}__tryFocusDate(){if(this.__pendingDateFocus){const e=this.focusableDateElement;e&&Kt(e.date,this.__pendingDateFocus)&&(delete this.__pendingDateFocus,e.focus())}}async focusDate(e,t){const i=e||this.selectedDate||this.initialPosition||new Date;this.focusedDate=i,t||(this._focusedMonthDate=i.getDate()),await this.focusDateElement(!1)}async focusDateElement(e=!0){this.__pendingDateFocus=this.focusedDate,this.calendars.length||await new Promise(e=>{requestAnimationFrame(()=>{setTimeout(()=>{e()})})}),e&&this.revealDate(this.focusedDate),this._revealPromise&&await this._revealPromise,this.__tryFocusDate()}_focusClosestDate(e){this.focusDate(Qt(e,[this.minDate,this.maxDate]))}_focusAllowedDate(e,t,i){this._dateAllowed(e,void 0,void 0,()=>!1)?this.focusDate(e,i):this._dateAllowed(this.focusedDate)?t>0?this.focusDate(this.maxDate):this.focusDate(this.minDate):this._focusClosestDate(this.focusedDate)}_getDateDiff(e,t){return zt(this.focusedDate.getFullYear(),this.focusedDate.getMonth()+e,t?this.focusedDate.getDate()+t:1)}_moveFocusByDays(e){const t=this._getDateDiff(0,e);this._focusAllowedDate(t,e,!1)}_moveFocusByMonths(e){const t=this._getDateDiff(e),i=t.getMonth();this._focusedMonthDate||(this._focusedMonthDate=this.focusedDate.getDate()),t.setDate(this._focusedMonthDate),t.getMonth()!==i&&t.setDate(0),this._focusAllowedDate(t,e,!0)}_moveFocusInsideMonth(e,t){const i="minDate"===t?Wt(e):qt(e);this._dateAllowed(i)?this.focusDate(i):this._dateAllowed(e)?this.focusDate(this[t]):this._focusClosestDate(e)}_dateAllowed(e,t=this.minDate,i=this.maxDate,n=this.isDateDisabled){return Xt(e,t,i,n)}_dateSelectable(e){return Zt(e,this.minDate,this.maxDate,this.isDateDisabled,this._dateMetadataController)}_isTodayAllowed(){return this._dateSelectable(this._getTodayMidnight())}_getTodayMidnight(){const e=new Date;return zt(e.getFullYear(),e.getMonth(),e.getDate())}};
/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class gi extends(_i(H(v(k(F(o)))))){static get is(){return"vaadin-date-picker-overlay-content"}static get styles(){return[ui,pi]}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}render(){return s`
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
    `}firstUpdated(){super.firstUpdated(),this.setAttribute("role","dialog"),this._initControllers()}}h(gi);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fi=e=>e??l,mi=[a`
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
`,a`
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
`,a`
  :host {
    --_field-input-height: max(var(--vaadin-input-field-height, 0px), var(--_field-input-default-height));
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,a`
  [part$='button'] {
    color: var(--vaadin-input-field-button-text-color, var(--vaadin-text-color-secondary));
    cursor: var(--vaadin-clickable-cursor);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    /* Ensure minimum click target (WCAG) */
    padding: max(0px, (24px - var(--vaadin-icon-size, 1lh)) / 2);
    margin: min(0px, (24px - var(--vaadin-icon-size, 1lh)) / -2);
  }

  /* Icon */
  [part$='button']::before {
    background: currentColor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
    mask-size: var(--vaadin-icon-visual-size, 100%);
    mask-position: 50%;
    mask-repeat: no-repeat;
  }

  :host(:is(:not([clear-button-visible][has-value]), [disabled], [readonly])) [part~='clear-button'] {
    display: none;
  }

  [part~='clear-button']::before {
    mask-image: var(--_vaadin-icon-cross);
  }

  :host(:is([readonly], [disabled])) [part$='button'] {
    color: var(--vaadin-text-color-disabled);
    cursor: var(--vaadin-disabled-cursor);
  }

  @media (forced-colors: active) {
    [part$='button']::before {
      background: CanvasText;
    }

    :host([disabled]) [part$='button'] {
      color: GrayText;
    }

    :host([disabled]) [part$='button']::before {
      background: GrayText;
    }
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */],bi=a`
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
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,yi=a`
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
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,wi=document.createElement("div");
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let xi;function ki(e,t={}){const i=t.mode||"polite",n=t.timeout??150;"alert"===i?(wi.removeAttribute("aria-live"),wi.removeAttribute("role"),xi=Ge.debounce(xi,He,()=>{wi.setAttribute("role","alert")})):(xi&&xi.cancel(),wi.removeAttribute("role"),wi.setAttribute("aria-live",i)),wi.textContent="",setTimeout(()=>{wi.textContent=e},n)}
/**
 * @license
 * Copyright (c) 2017 Anton Korzunov
 * SPDX-License-Identifier: MIT
 */wi.style.position="fixed",wi.style.clip="rect(0px, 0px, 0px, 0px)",wi.setAttribute("aria-live","polite"),document.body.appendChild(wi);let Di=new WeakMap,Ci=new WeakMap,Si={},Ei=0;const Ai=e=>e?.nodeType===Node.ELEMENT_NODE,Ti=(...e)=>{console.error(`Error: ${e.join(" ")}. Skip setting aria-hidden.`)},Ii=(e,t,i,n)=>{const a=((e,t)=>Ai(e)?t.map(t=>{if(!Ai(t))return Ti(t,"is not a valid element"),null;let i=t;for(;i&&i!==e;){if(e.contains(i))return t;i=i.getRootNode().host}return Ti(t,"is not contained inside",e),null}).filter(e=>Boolean(e)):(Ti(e,"is not a valid element"),[]))(t,Array.isArray(e)?e:[e]);Si[i]||(Si[i]=new WeakMap);const s=Si[i],o=[],r=new Set,l=new Set(a),d=e=>{if(!e||r.has(e))return;r.add(e);const t=e.assignedSlot;t&&d(t),d(e.parentNode||e.host)};a.forEach(d);const h=e=>{if(!e||l.has(e))return;const t=e.shadowRoot;(t?[...e.children,...t.children]:[...e.children]).forEach(e=>{if(!["template","script","style"].includes(e.localName))if(r.has(e))h(e);else{const t=e.getAttribute(n),a=null!==t&&"false"!==t,r=(Di.get(e)||0)+1,l=(s.get(e)||0)+1;Di.set(e,r),s.set(e,l),o.push(e),1===r&&a&&Ci.set(e,!0),1===l&&e.setAttribute(i,"true"),a||e.setAttribute(n,"true")}})};return h(t),r.clear(),Ei+=1,()=>{o.forEach(e=>{const t=Di.get(e)-1,a=s.get(e)-1;Di.set(e,t),s.set(e,a),t||(Ci.has(e)?Ci.delete(e):e.removeAttribute(n)),a||e.removeAttribute(i)}),Ei-=1,Ei||(Di=new WeakMap,Di=new WeakMap,Ci=new WeakMap,Si={})}},Mi=g(e=>class extends(Ft(Rt(e))){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged",sync:!0},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame(()=>{this.focus()})}focus(e){if(this.focusElement&&!this.disabled){if(this.focusElement.focus({preventScroll:!!e?.preventScroll}),!ae(this.focusElement))return;!1!==e?.focusVisible&&this.setAttribute("focus-ring","")}}blur(){this.focusElement&&this.focusElement.blur()}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(e,t){e?(e.disabled=this.disabled,this._addFocusListeners(e),this.__forwardTabIndex(this.tabindex)):t&&this._removeFocusListeners(t)}_addFocusListeners(e){e.addEventListener("blur",this._boundOnBlur),e.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(e){e.removeEventListener("blur",this._boundOnBlur),e.removeEventListener("focus",this._boundOnFocus)}_onFocus(e){e.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(e){e.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(e){return e.target===this.focusElement}_shouldRemoveFocus(e){return e.target===this.focusElement}_disabledChanged(e,t){super._disabledChanged(e,t),this.focusElement&&(this.focusElement.disabled=e),e&&this.blur()}_tabindexChanged(e){this.__forwardTabIndex(e)}__forwardTabIndex(e){void 0!==e&&this.focusElement&&(this.focusElement.tabIndex=e,-1!==e&&(this.tabindex=void 0)),this.disabled&&e&&(-1!==e&&(this._lastTabIndex=e),this.tabindex=void 0),void 0===e&&this.hasAttribute("tabindex")&&this.removeAttribute("tabindex")}}),Ni=["__proto__","constructor","prototype"],Oi=e=>{if(!e||"object"!=typeof e)return!1;const t=Object.getPrototypeOf(e);return t===Object.prototype||null===t};function Pi(e,t,i){return Oi(e)&&Oi(t)?(Object.keys(t).forEach(i=>{if(Ni.includes(i))return;const n=t[i];if(Oi(n)){if(!Object.hasOwn(e,i)||!Oi(e[i])){if(Object.hasOwn(e,i)&&e[i])return;e[i]={}}Pi(e[i],n)}else Array.isArray(n)?e[i]=[...n]:null!=n&&(e[i]=n)}),e):e}function Li(e,...t){return t.forEach(t=>Pi(e,t)),e}
/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const Bi=e=>class extends e{static get properties(){return{i18n:{type:Object},__effectiveI18n:{type:Object,sync:!0}}}static get defaultI18n(){return{}}constructor(){super(),this.__updateEffectiveI18n()}get i18n(){return this.__customI18n}set i18n(e){e!==this.__customI18n&&(this.__customI18n=e,this.__updateEffectiveI18n())}__updateEffectiveI18n(){this.__effectiveI18n=Li({},this.constructor.defaultI18n,this.__customI18n)}};
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Fi{#k;#D=!1;#C;#S;#E;#A;#T;#I=[];#M=[];constructor(e){this.host=e}setTarget(e){this.#k=e,this.#N(),this.#O(),this.#P(),this.#L()}setRequired(e){this.#D=e,this.#L()}setLabel(e){this.#C=e,this.#N()}setLabelledBy(e){this.#S=e,this.#O()}setDescribedBy(e){this.#E=e,this.#P()}setErrorId(e){this.#A=e,this.#P()}setHelperId(e){this.#T=e,this.#P()}#N(){this.#k&&De(this.#k,"aria-label",this.#C)}#O(){this.#k&&(Ee(this.#k,"aria-labelledby",this.#I),this.#I=[this.#S],Se(this.#k,"aria-labelledby",this.#I))}#P(){this.#k&&(Ee(this.#k,"aria-describedby",this.#M),this.#M=[this.#E,this.#T,this.#A],Se(this.#k,"aria-describedby",this.#M))}#L(){this.#k&&(["input","textarea"].includes(this.#k.localName)||De(this.#k,"aria-required",this.#D))}}
/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Ri extends it{#B;constructor(e,t,i,n={}){super(e,t,i,{...n,useUniqueId:!0})}initCustomNode(e){this.#F(e),this._notifyChange(e)}teardownNode(e){const t=this.getSlotChild();t&&t!==this.defaultNode?this._notifyChange(t):(this.restoreDefaultNode(),this.updateDefaultNode(this.node))}attachDefaultNode(){const e=super.attachDefaultNode();return e&&this.#F(e),e}restoreDefaultNode(){}updateDefaultNode(e){this._notifyChange(e)}observeNode(e){this.#B&&this.#B.disconnect(),this.#B=new MutationObserver(e=>{e.forEach(e=>{const t=e.target,i=t===this.node;"attributes"===e.type?i&&this.#F(t):(i||t.parentElement===this.node)&&this._notifyChange(this.node)})}),this.#B.observe(e,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}_notifyChange(e){this.dispatchEvent(new CustomEvent("slot-content-changed",{detail:{hasContent:Ae(e),node:e}}))}#F(e){const t=!this.nodes||e===this.nodes[0];e.nodeType!==Node.ELEMENT_NODE||this.multiple&&!t||e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Vi extends Ri{constructor(e){super(e,"error-message","div")}setErrorMessage(e){this.errorMessage=e,this.updateDefaultNode(this.node)}setInvalid(e){this.invalid=e,this.updateDefaultNode(this.node)}initAddedNode(e){e!==this.defaultNode&&this.initCustomNode(e)}initNode(e){this.updateDefaultNode(e)}initCustomNode(e){e.textContent&&!this.errorMessage&&(this.errorMessage=e.textContent.trim()),super.initCustomNode(e)}restoreDefaultNode(){this.attachDefaultNode()}updateDefaultNode(e){const{errorMessage:t,invalid:i}=this,n=Boolean(i&&t&&""!==t.trim());e&&(e.textContent=n?t:"",e.hidden=!n,n&&ki(t,{mode:"assertive"})),super.updateDefaultNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class $i extends Ri{constructor(e){super(e,"helper",null)}setHelperText(e){this.helperText=e;this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){const{helperText:e}=this;if(e&&""!==e.trim()){this.tagName="div";const e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(e){e&&(e.textContent=this.helperText),super.updateDefaultNode(e)}initCustomNode(e){super.initCustomNode(e),this.observeNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class ji extends Ri{constructor(e){super(e,"label","label")}setLabel(e){this.label=e;this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){const{label:e}=this;if(e&&""!==e.trim()){const e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(e){e&&(e.textContent=this.label),super.updateDefaultNode(e)}initCustomNode(e){super.initCustomNode(e),this.observeNode(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const zi=e=>class extends e{static get properties(){return{label:{type:String,observer:"_labelChanged"}}}constructor(){super(),this._labelController=new ji(this),this._labelController.addEventListener("slot-content-changed",e=>{this.toggleAttribute("has-label",e.detail.hasContent)})}get _labelId(){const e=this._labelNode;return e?.id}get _labelNode(){return this._labelController.node}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(e){this._labelController.setLabel(e)}},Wi=g(e=>class extends e{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1,sync:!0},manualValidation:{type:Boolean,value:!1},required:{type:Boolean,reflectToAttribute:!0,sync:!0}}}validate(){const e=this.checkValidity();return this._setInvalid(!e),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:e}})),e}checkValidity(){return!this.required||!!this.value}_setInvalid(e){this._shouldSetInvalid(e)&&(this.invalid=e)}_shouldSetInvalid(e){return!0}_requestValidation(){this.manualValidation||this.validate()}}),qi=e=>class extends(Wi(zi(e))){static get properties(){return{ariaTarget:{type:Object},errorMessage:{type:String},helperText:{type:String},accessibleName:{type:String},accessibleNameRef:{type:String},accessibleDescriptionRef:{type:String}}}constructor(){super(),this._labelController.addEventListener("slot-content-changed",e=>{this.#R(e)}),this._helperController=new $i(this),this._helperController.addEventListener("slot-content-changed",e=>{this.#V(e)}),this._errorController=new Vi(this),this._errorController.addEventListener("slot-content-changed",e=>{this.#$(e)}),this._fieldAriaController=new Fi(this)}get _errorNode(){return this._errorController.node}get _helperNode(){return this._helperController.node}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}updated(e){super.updated(e),e.has("invalid")&&this._errorController.setInvalid(this.invalid),e.has("errorMessage")&&this._errorController.setErrorMessage(this.errorMessage),e.has("helperText")&&this._helperController.setHelperText(this.helperText),e.has("ariaTarget")&&this._fieldAriaController.setTarget(this.ariaTarget),e.has("required")&&this._fieldAriaController.setRequired(this.required),e.has("accessibleName")&&this.__updateFieldAriaControllerLabel(),(e.has("accessibleName")||e.has("accessibleNameRef"))&&this.__updateFieldAriaControllerLabelledBy(),e.has("accessibleDescriptionRef")&&this.__updateFieldAriaControllerDescribedBy()}__updateFieldAriaControllerLabel(){this._fieldAriaController.setLabel(this.accessibleName)}__updateFieldAriaControllerLabelledBy(){let e=null;this.accessibleNameRef?e=this.accessibleNameRef:this.hasAttribute("has-label")&&!this.accessibleName&&(e=this._labelNode?.id),this._fieldAriaController.setLabelledBy(e)}__updateFieldAriaControllerDescribedBy(){this._fieldAriaController.setDescribedBy(this.accessibleDescriptionRef)}#R(e){this.__updateFieldAriaControllerLabelledBy()}#V(e){const{hasContent:t}=e.detail;this.toggleAttribute("has-helper",t),t?this._fieldAriaController.setHelperId(this._helperNode?.id):this._fieldAriaController.setHelperId(null)}#$(e){this.toggleAttribute("has-error-message",e.detail.hasContent),setTimeout(()=>{this.invalid?this._fieldAriaController.setErrorId(this._errorNode?.id):this._fieldAriaController.setErrorId(null)})}},Hi=Object.freeze({monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],firstDayOfWeek:0,today:"Today",cancel:"Cancel",dialogAccessibleName:"Calendar",referenceDate:"",formatDate(e){const t=String(e.year).replace(/\d+/u,e=>"0000".substr(e.length)+e);return[e.month+1,e.day,t].join("/")},parseDate(e){const t=e.split("/"),i=new Date;let n,a=i.getMonth(),s=i.getFullYear();if(3===t.length){if(a=parseInt(t[0])-1,n=parseInt(t[1]),s=parseInt(t[2]),t[2].length<3&&s>=0){s=function(e,t,i=0,n=1){if(t>99)throw new Error("The provided year cannot have more than 2 digits.");if(t<0)throw new Error("The provided year cannot be negative.");let a=t+100*Math.floor(e.getFullYear()/100);return e<new Date(a-50,i,n)?a-=100:e>new Date(a+50,i,n)&&(a+=100),a}(ti(this.referenceDate)||new Date,s,a,n)}}else 2===t.length?(a=parseInt(t[0])-1,n=parseInt(t[1])):1===t.length&&(n=parseInt(t[0]));if(void 0!==n)return{day:n,month:a,year:s}},formatTitle:(e,t)=>`${e} ${t}`}),Yi=Object.freeze({...Hi,startAccessibleName:"Start date",endAccessibleName:"End date",rangeAccessibleName:"Date range",rangeStart:"range start",rangeEnd:"range end",inRange:"in range"}),Ui=e=>class extends(Bi(qi(Mi(Lt(e))))){static get properties(){return{startValue:{type:String,value:"",notify:!0,sync:!0},endValue:{type:String,value:"",notify:!0,sync:!0},min:{type:String},max:{type:String},isDateDisabled:{type:Function},startPlaceholder:{type:String},endPlaceholder:{type:String},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},showWeekNumbers:{type:Boolean,value:!1},separateDatePicking:{type:Boolean,value:!1},singleInput:{type:Boolean,value:!1,reflectToAttribute:!0},opened:{type:Boolean,reflectToAttribute:!0,notify:!0,sync:!0},_activePart:{type:String,value:"start",reflectToAttribute:!0,attribute:"active-part",sync:!0},_startDate:{type:Object,value:null,sync:!0},_endDate:{type:Object,value:null,sync:!0},_overlayContent:{type:Object,sync:!0},_fullscreen:{type:Boolean,value:!1,sync:!0},_fullscreenMediaQuery:{value:"(max-width: 450px), (max-height: 450px)"}}}static get defaultI18n(){return Yi}get i18n(){return super.i18n}set i18n(e){super.i18n=e}get _startInput(){return this.querySelector(':scope > input[slot="input"]')}get _endInput(){return this.querySelector(':scope > input[slot="end-input"]')}get __activeInput(){return"end"!==this._activePart||this.singleInput?this._startInput:this._endInput}get __isPickingWholeRange(){return this.singleInput||this.__pickingWholeRange}get __activeDate(){return"end"===this._activePart?this._endDate:this._startDate}get __minDate(){return ti(this.min)}get __maxDate(){return ti(this.max)}constructor(){super(),this._boundOnScroll=this.__onScroll.bind(this)}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","group"),this.ariaTarget=this,this.addEventListener("click",e=>this.__onHostClick(e)),this.addEventListener("focusin",e=>this.__onFocusIn(e)),this.addController(new vi(this._fullscreenMediaQuery,e=>{this._fullscreen=e}))}willUpdate(e){super.willUpdate(e),e.has("opened")&&this.opened&&this.__ensureContent();let t=!1;e.has("startValue")&&(t||=this.startValue!==ii(this._startDate),this._startDate=this.__parseValue(this.startValue,this._startDate)),e.has("endValue")&&(t||=this.endValue!==ii(this._endDate),this._endDate=this.__parseValue(this.endValue,this._endDate)),t&&(this.__committedValue=this.__getRangeString())}updated(e){super.updated(e),(e.has("_startDate")||e.has("__effectiveI18n"))&&(this.startValue=ii(this._startDate),this.__applyInputValue(this._startInput,this._startDate)),(e.has("_endDate")||e.has("__effectiveI18n"))&&(this.endValue=ii(this._endDate),this.__applyInputValue(this._endInput,this._endDate)),e.has("singleInput")&&(this._endInput&&(this._endInput.value=this.__formatDate(this._endDate)),this._startInput&&(this._startInput.value=this.singleInput?this.__formatRange():this.__formatDate(this._startDate))),(e.has("_startDate")||e.has("_endDate"))&&(this.toggleAttribute("has-value",!(!this._startDate&&!this._endDate)),this.toggleAttribute("has-start-value",!!this._startDate),this.toggleAttribute("has-end-value",!!this._endDate)),(e.has("showWeekNumbers")||e.has("__effectiveI18n"))&&this.toggleAttribute("week-numbers",this.showWeekNumbers&&1===this.__effectiveI18n.firstDayOfWeek),this.__updateInputs(),this.__updateOverlayContent()}firstUpdated(e){super.firstUpdated(e),this.__committedValue=this.__getRangeString()}disconnectedCallback(){super.disconnectedCallback(),this.opened=!1}open(){this.disabled||this.readonly||(this.opened=!0)}close(){this.$.overlay.close()}checkValidity(){const e=this.singleInput?!this._startInput?.value||this._startInput.value===this.__formatRange():[[this._startInput,this._startDate],[this._endInput,this._endDate]].every(([e,t])=>!e||!e.value||!!t&&e.value===this.__formatDate(t)),t=[this._startDate,this._endDate].every(e=>!e||Zt(e,this.__minDate,this.__maxDate,this.isDateDisabled)),i=!this._startDate||!this._endDate||this._startDate<=this._endDate,n=!this.required||!!this._startDate&&!!this._endDate;return e&&t&&i&&n}_shouldRemoveFocus(e){const{relatedTarget:t}=e;return(!t||!this.contains(t))&&(!this.opened||null!==t&&t!==document.body)}_setFocused(e){super._setFocused(e),e||this.opened||(this.__commitInputValues(),document.hasFocus()&&this._requestValidation())}_onKeyDown(e){if(super._onKeyDown(e),!this.__isFromOverlay(e))switch(e.key){case"ArrowDown":case"ArrowUp":e.preventDefault(),this.opened?this._overlayContent.focusDateElement():(this.__focusOverlayOnOpen=!0,this.open());break;case"Tab":this.opened&&!e.shiftKey&&e.target===this._endInput&&(e.preventDefault(),e.stopPropagation(),this._overlayContent.focusDateElement()),this.opened&&e.shiftKey&&e.target===this._startInput&&(e.preventDefault(),e.stopPropagation(),this._overlayContent.focusCancel())}}_onEnter(e){this.__isFromOverlay(e)||(this.opened?this.close():(this.__commitInputValues(),this._requestValidation()))}_onEscape(e){if(this.opened)return e.stopPropagation(),void this.close();const t=!(!this._startInput?.value&&!this._endInput?.value);if(this.clearButtonVisible&&t&&!this.readonly)return e.stopPropagation(),this._startDate=null,this._endDate=null,this.__applyInputValue(this._startInput,null),this.__applyInputValue(this._endInput,null),void this.__commitValueChange();this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)}_onOpenedChanged(e){this.opened=e.detail.value}_onOverlayOpened(){const e=this._overlayContent;e.reset(),this.__datesOnOpen=[this._startDate,this._endDate],this.__committedValue=this.__getRangeString();const t=this.__getInitialPosition();e.initialPosition=t,e.scrollToDate(t),e.focusedDate=t,window.addEventListener("scroll",this._boundOnScroll,!0),this.__focusOverlayOnOpen?(e.focusDateElement(),this.__focusOverlayOnOpen=!1):this.__activeInput.matches(":focus")||this.__focusActiveInput(),this.__showOthers=((e,t=document.body,i="data-aria-hidden")=>{const n=Array.from(Array.isArray(e)?e:[e]);return t&&n.push(...Array.from(t.querySelectorAll("[aria-live]"))),Ii(n,t,i,"aria-hidden")})(this)}_onOverlayClosing(){this._overlayContent?.cancelLoadVisibleDateMetadata(),this.__pickingWholeRange=!1,this.__showOthers&&(this.__showOthers(),this.__showOthers=null),window.removeEventListener("scroll",this._boundOnScroll,!0),this.__cancelled?(this.__cancelled=!1,[this._startDate,this._endDate]=this.__datesOnOpen,this.__applyInputValue(this._startInput,this._startDate),this.__applyInputValue(this._endInput,this._endDate)):(this.__commitInputValues(),this._requestValidation()),this.__commitValueChange(),ae(this._startInput)||ae(this._endInput)||this._setFocused(!1)}_onVaadinOverlayClose(e){const t=e.detail.sourceEvent;t?.composedPath().includes(this)&&!t.composedPath().includes(this.$.overlay)&&e.preventDefault()}_onToggleClick(e){e.stopPropagation(),this.opened?this.close():(this._activePart="start",this.__pickingWholeRange=!0,this.__focusActiveInput(),this.open())}_onClearButtonClick(e){e.preventDefault(),e.stopPropagation(),this._startDate=null,this._endDate=null,this.__applyInputValue(this._startInput,null),this.__applyInputValue(this._endInput,null),this.__commitValueChange()}__onHostClick(e){const t=e.composedPath();t.includes(this.$.overlay)||t.some(e=>e.part?.contains?.("clear-button"))||(!this.singleInput&&this.separateDatePicking||this.opened?this.open():this._startWholeRangePick())}_startWholeRangePick(){this.disabled||this.readonly||(this._activePart="start",this.__pickingWholeRange=!0,this.__focusActiveInput(),this.open())}__onFocusIn(e){const t=!J()&&!this.__focusingProgrammatically;if(e.target!==this._endInput||!t||this.opened||this.separateDatePicking){if(e.target===this._startInput&&this.singleInput)this.opened||(this._activePart="start");else if(e.target===this._startInput)this._activePart="start";else{if(e.target!==this._endInput)return;this._activePart="end"}this.opened&&this.__revealActiveDate()}else this._startWholeRangePick()}_onInputTextChange(e){!this.opened&&e.target.value&&this.open();const t=this.singleInput?this.__splitRangeText(e.target.value).at(-1):e.target.value,i=this.__parseDateText(t);i&&this._overlayContent&&(this._overlayContent.focusedDate=i)}__onScroll(e){e.target!==window&&this._overlayContent.contains(e.target)||this._overlayContent._repositionYearScroller()}__isFromOverlay(e){return!!this._overlayContent&&e.composedPath().includes(this._overlayContent)}__ensureContent(){if(this._overlayContent)return;const e=document.createElement("vaadin-date-picker-overlay-content");e.setAttribute("slot","overlay"),this.appendChild(e),this._overlayContent=e,e.addEventListener("date-tap",e=>{this.__pickDate(e.detail.date)&&(this.__focusActiveInput(),this.close())}),e.addEventListener("range-drag-end",e=>{const{start:t,end:i,mode:n}=e.detail;this._startDate=t,this._endDate=i,this.__applyInputValue(this._startInput,t),this.__applyInputValue(this._endInput,i),this.__focusActiveInput(),"select"===n&&this.close()}),e.addEventListener("date-selected",e=>{this.__keepOpen=!this.__pickDate(e.detail.date)}),e.addEventListener("close",()=>{this.__keepOpen?this.__keepOpen=!1:(this.close(),this.__focusActiveInput())}),e.addEventListener("click",t=>{t.composedPath().includes(e._cancelButton)&&(this.__cancelled=!0)},!0),e.addEventListener("click",e=>e.stopPropagation()),e.addEventListener("focus-input",()=>this.__focusActiveInput()),this.__updateOverlayContent()}__pickDate(e){return e?"end"!==this._activePart||this._startDate?"end"===this._activePart&&e>=this._startDate?(this._endDate=e,!0):"start"===this._activePart&&this.__isPickingWholeRange&&this._endDate&&e<=this._endDate?(this._startDate=e,this._activePart="end",this.__focusActiveInput(),ki(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(e)}`),!1):"start"===this._activePart&&this._endDate&&e<=this._endDate?(this._startDate=e,!0):(this._startDate=e,this._endDate=null,this.__applyInputValue(this._endInput,null),this._activePart="end",this.__focusActiveInput(),ki(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(e)}`),!1):(this._endDate=e,this._activePart="start",this.__focusActiveInput(),ki(`${this.__effectiveI18n.endAccessibleName}: ${this.__formatDate(e)}`),!1):("end"===this._activePart?this._endDate=null:this._startDate=null,!1)}__focusActiveInput(){const e=this.__activeInput;e&&!ae(e)&&(this.__focusingProgrammatically=!0,e.focus({focusVisible:J()}),this.__focusingProgrammatically=!1)}__revealActiveDate(){const e=this._overlayContent;if(!e)return;const t=this.__activeDate||this._startDate||this._endDate;t&&(e.focusedDate=t)}__getInitialPosition(){const e=this.__activeDate||this._startDate||this._endDate||new Date,t=this.__minDate,i=this.__maxDate;return Xt(e,t,i)?e:Qt(e,[t,i])}__updateInputs(){const e=this.__effectiveI18n,{startPlaceholder:t,endPlaceholder:i}=this,n=t||i?`${t||""} – ${i||""}`:"";[this.singleInput?[this._startInput,n,e.rangeAccessibleName]:[this._startInput,t,e.startAccessibleName],[this._endInput,i,e.endAccessibleName]].forEach(([e,t,i])=>{e&&(e===this._endInput&&(e.hidden=this.singleInput),e.disabled=!!this.disabled,e.readOnly=!!this.readonly,e.placeholder=t||"",De(e,"inputmode",this._fullscreen?"none":null),e.setAttribute("aria-expanded",String(!!this.opened)),e.setAttribute("aria-label",i),De(e,"aria-required",this.required?"true":null))})}__updateOverlayContent(){const e=this._overlayContent;e&&(e.i18n=this.__effectiveI18n,e.label=this.label,e.minDate=this.__minDate,e.maxDate=this.__maxDate,e.isDateDisabled=this.isDateDisabled,e.showWeekNumbers=this.showWeekNumbers,e.selectedDate=this._startDate?null:this._endDate,e.rangeStart=this._startDate,e.rangeEnd=this._endDate,e.rangePreview=this._activePart,e.toggleAttribute("fullscreen",this._fullscreen),De(e,"theme",this._theme))}__commitInputValues(){this.singleInput?this.__commitRangeText():([[this._startInput,"_startDate"],[this._endInput,"_endDate"]].forEach(([e,t])=>{e&&e.value!==this.__formatDate(this[t])&&(this[t]=this.__parseDateText(e.value)||null,this[t]&&this.__applyInputValue(e,this[t]))}),this.__commitValueChange())}__commitValueChange(){const e=this.__getRangeString();this.__committedValue!==e&&(this._requestValidation(),this.dispatchEvent(new CustomEvent("change",{bubbles:!0}))),this.__committedValue=e}__getRangeString(){return`${ii(this._startDate)}/${ii(this._endDate)}`}__parseValue(e,t){const i=ti(e);return e&&i?Kt(i,t)?t:i:null}__parseDateText(e){const t=this.__effectiveI18n;if(!e||!t.parseDate)return;const i=t.parseDate(e),n=i&&ti(`${i.year}-${i.month+1}-${i.day}`);return n&&!isNaN(n.getTime())?n:void 0}__formatDate(e){return e?this.__effectiveI18n.formatDate(Gt(e)):""}__applyInputValue(e,t){this.singleInput?this._startInput&&(this._startInput.value=this.__formatRange()):e&&(e.value=this.__formatDate(t))}__formatRange(){const e=this.__formatDate(this._startDate),t=this.__formatDate(this._endDate);return e||t?`${e} – ${t}`.trim():""}__splitRangeText(e){return e.split(/\s*[–—]\s*|\s+-\s+|\s+to\s+/iu,2).map(e=>e.trim())}__commitRangeText(){const e=this._startInput;if(!e||e.value===this.__formatRange())return;const[t="",i=""]=this.__splitRangeText(e.value),n=this.__parseDateText(t)||null,a=this.__parseDateText(i)||null,s=(!t||n)&&(!i||a);this._startDate=s?n:null,this._endDate=s?a:null,s&&(e.value=this.__formatRange()),this.__commitValueChange()}};
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Ki extends(Ui(H(Qe(k(F(o)))))){static get is(){return"vaadin-date-range-picker"}static get styles(){return[mi,bi,yi]}static get properties(){return{_positionTarget:{type:Object,sync:!0}}}render(){return s`
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
          theme="${fi(this._theme)}"
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
        theme="${fi(this._theme)}"
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
    `}constructor(){super(),this.__inputFieldClickCapture={handleEvent:e=>this.__onInputFieldClick(e),capture:!0}}ready(){super.ready(),this.addController(new it(this,"input","input",{initializer:e=>this.__initInput(e),useUniqueId:!0})),this.addController(new it(this,"end-input","input",{initializer:e=>this.__initInput(e),useUniqueId:!0})),this._setFocusElement(this._startInput),this._tooltipController=new nt(this),this.addController(this._tooltipController),this._tooltipController.setPosition("top"),this._tooltipController.setAriaTarget(this._startInput),this._tooltipController.setShouldShow(e=>!e.opened),this._positionTarget=this.shadowRoot.querySelector('[part="input-field"]')}__initInput(e){e.type="text",e.autocomplete="off",e.setAttribute("role","combobox"),e.setAttribute("aria-haspopup","dialog"),e.addEventListener("input",e=>this._onInputTextChange(e))}__onInputFieldClick(e){if(e.composedPath()[0]!==this._positionTarget)return;if(e.stopPropagation(),this.singleInput||!this.separateDatePicking)return void this._startWholeRangePick();const t=this.shadowRoot.querySelector('[part="separator"]').getBoundingClientRect();(e.clientX<t.left+t.width/2?this._startInput:this._endInput).focus({focusVisible:!1}),this.open()}__preventDefault(e){e.preventDefault()}}h(Ki),document.querySelector("#single-input").addEventListener("change",e=>{document.querySelectorAll("vaadin-date-range-picker").forEach(t=>{t.singleInput=e.target.checked})}),document.querySelector("#separate-date-picking").addEventListener("change",e=>{document.querySelectorAll("vaadin-date-range-picker").forEach(t=>{t.separateDatePicking=e.target.checked})}),document.querySelector("#band-edges").addEventListener("change",e=>{document.documentElement.classList.toggle("band-edges",e.target.checked)});const Gi=e=>{const t=new Date;return t.setDate(t.getDate()+e),(e=>{const t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t.toISOString().slice(0,10)})(t)},Xi=document.querySelector("#basic"),Zi=document.querySelector("#basic-log"),Qi=e=>{Zi.textContent=`startValue: "${Xi.startValue}"  endValue: "${Xi.endValue}"  (last event: ${e?e.type:"-"})`};["change","start-value-changed","end-value-changed"].forEach(e=>Xi.addEventListener(e,Qi)),Qi();const Ji=document.querySelector("#constrained");Ji.min=Gi(-60),Ji.max=Gi(60);const en=(8-(new Date).getDay())%7||7;Ji.startValue=Gi(en),Ji.endValue=Gi(en+11),Ji.isDateDisabled=e=>{const t=new Date(e.year,e.month,e.day).getDay();return 0===t||6===t};const tn=document.querySelector("#required");tn.addEventListener("validated",()=>{const e=tn.startValue,t=tn.endValue,[i,n]=tn.querySelectorAll("input"),a=i.value&&!e||n.value&&!t;tn.errorMessage=a?"Enter a valid date":e&&t?e>t?"End date can't be before start date":"":"Enter both a start and an end date"}),document.querySelector("#disabled").startValue=Gi(0),document.querySelector("#disabled").endValue=Gi(4),document.querySelector("#readonly").startValue=Gi(0),document.querySelector("#readonly").endValue=Gi(4);
