import{r as t}from"./css-utils-CmmJrizo.js";import{r as e,i as s}from"./style-props-CNAjUT68.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class o extends EventTarget{#t;#e=new Set;#s;#o=!1;constructor(t){super(),this.#t=t,this.#s=new CSSStyleSheet}#n(t){const{propertyName:e}=t;this.#e.has(e)&&this.dispatchEvent(new CustomEvent("property-changed",{detail:{propertyName:e}}))}observe(t){this.connect(),this.#e.has(t)||(this.#e.add(t),this.#s.replaceSync(`\n      :root::before, :host::before {\n        content: '' !important;\n        position: absolute !important;\n        top: -9999px !important;\n        left: -9999px !important;\n        visibility: hidden !important;\n        transition: 1ms allow-discrete step-end !important;\n        transition-property: ${[...this.#e].join(", ")} !important;\n      }\n    `))}connect(){this.#o||(this.#t.adoptedStyleSheets.unshift(this.#s),this.#r.addEventListener("transitionstart",t=>this.#n(t)),this.#r.addEventListener("transitionend",t=>this.#n(t)),this.#o=!0)}disconnect(){this.#e.clear(),this.#t.adoptedStyleSheets=this.#t.adoptedStyleSheets.filter(t=>t!==this.#s),this.#r.removeEventListener("transitionstart",this.#n),this.#r.removeEventListener("transitionend",this.#n),this.#o=!1}get#r(){return this.#t.documentElement??this.#t.host}static for(t){return t.__cssPropertyObserver||=new o(t),t.__cssPropertyObserver}}
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const n=new Set;function r(t){n.has(t)||(n.add(t),console.warn(t))}
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const i=new WeakMap;function c(t){try{return t.media.mediaText}catch{return r('[LumoInjector] Browser denied to access property "mediaText" for some CSS rules, so they were skipped.'),""}}function a(t,e={tags:new Map,modules:new Map}){for(const s of function(t){try{return t.cssRules}catch{return r('[LumoInjector] Browser denied to access property "cssRules" for some CSS stylesheets, so they were skipped.'),[]}}(t)){if(s instanceof CSSImportRule){const t=c(s);t.startsWith("lumo_")?e.modules.set(t,[...s.styleSheet.cssRules]):a(s.styleSheet,e);continue}if(s instanceof CSSMediaRule){const t=c(s);t.startsWith("lumo_")&&e.modules.set(t,[...s.cssRules]);continue}if(s instanceof CSSStyleRule&&s.cssText.includes("-inject"))for(const t of s.style){const o=t.match(/^--_lumo-(.*)-inject-modules$/u)?.[1];if(!o)continue;const n=s.style.getPropertyValue(t);e.tags.set(o,n.split(",").map(t=>t.trim().replace(/'|"/gu,"")))}else;}return e}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function h(t){return`--_lumo-${t.is}-inject`}class l{#t;#i;#c=new Map;#a=new Map;constructor(t=document){this.#t=t,this.handlePropertyChange=this.handlePropertyChange.bind(this),this.#i=o.for(t),this.#i.addEventListener("property-changed",this.handlePropertyChange)}disconnect(){this.#i.removeEventListener("property-changed",this.handlePropertyChange),this.#c.clear(),this.#a.values().forEach(t=>t.forEach(e))}forceUpdate(){for(const t of this.#c.keys())this.#h(t)}componentConnected(t){const{lumoInjector:e}=t.constructor,{is:o}=e;this.#a.set(o,this.#a.get(o)??new Set),this.#a.get(o).add(t);const n=this.#c.get(o);if(n)return void(n.cssRules.length>0&&s(t,n));this.#l(o);const r=h(e);this.#i.observe(r)}componentDisconnected(t){const{is:s}=t.constructor.lumoInjector;this.#a.get(s)?.delete(t),e(t)}handlePropertyChange(t){const{propertyName:e}=t.detail,s=e.match(/^--_lumo-(.*)-inject$/u)?.[1];s&&this.#h(s)}#l(t){this.#c.set(t,new CSSStyleSheet),this.#h(t)}#h(t){const{tags:o,modules:n}=function(t){let e=new Map,s=new Map;for(const o of t){let t=i.get(o);t||(t=a(o),i.set(o,t)),e=new Map([...e,...t.tags]),s=new Map([...s,...t.modules])}return{tags:e,modules:s}}(this.#p),r=(o.get(t)??[]).flatMap(t=>n.get(t)??[]).map(t=>t.cssText).join("\n"),c=this.#c.get(t);c.replaceSync(r),this.#a.get(t)?.forEach(t=>{r?s(t,c):e(t)})}get#p(){let t=new Set;for(const e of[this.#t,document])t=t.union(new Set(e.styleSheets)),t=t.union(new Set(e.adoptedStyleSheets));return[...t]}}
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const p=new Set;function d(t){const e=t.getRootNode();return e.host&&e.host.constructor.version?d(e.host):e}const u=e=>class extends e{static finalize(){super.finalize();const e=h(this.lumoInjector);this.is&&!p.has(e)&&(p.add(e),t({name:e,syntax:"<number>",inherits:!0,initialValue:"0"}))}static get lumoInjector(){return{is:this.is,includeBaseStyles:!1}}connectedCallback(){super.connectedCallback();const t=d(this);t.__lumoInjectorDisabled||this.isConnected&&(t.__lumoInjector||=new l(t),this.__lumoInjector=t.__lumoInjector,this.__lumoInjector.componentConnected(this))}disconnectedCallback(){super.disconnectedCallback(),this.__lumoInjector&&(this.__lumoInjector.componentDisconnected(this),this.__lumoInjector=void 0)}};export{u as L,r as i};
