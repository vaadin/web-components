var Mn=Object.defineProperty;var l=(i,t,e)=>()=>{if(e)throw e[0];try{return i&&(t=i(i=0)),t}catch(r){throw e=[r],r}};var Qt=(i,t)=>{for(var e in t)Mn(i,e,{get:t[e],enumerable:!0})};var _t,xt,te,ri,Y,h,m,yt,ee,ie=l(()=>{_t=globalThis,xt=_t.ShadowRoot&&(_t.ShadyCSS===void 0||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),ri=new WeakMap,Y=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(xt&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ri.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ri.set(e,t))}return t}toString(){return this.cssText}},h=i=>new Y(typeof i=="string"?i:i+"",void 0,te),m=(i,...t)=>{let e=i.length===1?i[0]:t.reduce(((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1]),i[0]);return new Y(e,i,te)},yt=(i,t)=>{if(xt)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let e of t){let r=document.createElement("style"),n=_t.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,i.appendChild(r)}},ee=xt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return h(e)})(i):i});var $n,Tn,In,Nn,On,Pn,wt,ni,Ln,Dn,rt,re,Ct,oi,S,kt=l(()=>{ie();ie();({is:$n,defineProperty:Tn,getOwnPropertyDescriptor:In,getOwnPropertyNames:Nn,getOwnPropertySymbols:On,getPrototypeOf:Pn}=Object),wt=globalThis,ni=wt.trustedTypes,Ln=ni?ni.emptyScript:"",Dn=wt.reactiveElementPolyfillSupport,rt=(i,t)=>i,re={toAttribute(i,t){switch(t){case Boolean:i=i?Ln:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ct=(i,t)=>!$n(i,t),oi={attribute:!0,type:String,converter:re,reflect:!1,useDefault:!1,hasChanged:Ct};Symbol.metadata??=Symbol("metadata"),wt.litPropertyMetadata??=new WeakMap;S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=oi){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&Tn(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){let{get:n,set:o}=In(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let d=n?.call(this);o?.call(this,s),this.requestUpdate(t,d,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??oi}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;let t=Pn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){let e=this.properties,r=[...Nn(e),...On(e)];for(let n of r)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let n of r)e.unshift(ee(n))}else t!==void 0&&e.push(ee(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:re).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let o=r.getPropertyOptions(n),s=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:re;this._$Em=n,this[n]=s.fromAttribute(e,o.type)??this._$Ej?.get(n)??null,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){let n=this.constructor,o=this[t];if(r??=n.getPropertyOptions(t),!((r.hasChanged??Ct)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:n,wrapped:o},s){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),o!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,o]of r){let{wrapped:s}=o,d=this[n];s!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,o,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[rt("elementProperties")]=new Map,S[rt("finalized")]=new Map,Dn?.({ReactiveElement:S}),(wt.reactiveElementVersions??=[]).push("2.1.0")});function mi(i,t){if(!he(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return si!==void 0?si.createHTML(t):t}function Z(i,t,e=i,r){if(t===U)return t;let n=r!==void 0?e._$Co?.[r]:e._$Cl,o=st(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=n:e._$Cl=n),n!==void 0&&(t=Z(i,n._$AS(i,t.values),n,r)),t}var ce,St,si,ui,I,pi,Bn,V,ot,st,he,jn,ne,nt,ai,li,F,di,ci,fi,ue,_,Jo,Qo,U,u,hi,z,Rn,at,oe,lt,G,se,ae,le,de,Fn,vi,dt=l(()=>{ce=globalThis,St=ce.trustedTypes,si=St?St.createPolicy("lit-html",{createHTML:i=>i}):void 0,ui="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,pi="?"+I,Bn=`<${pi}>`,V=document,ot=()=>V.createComment(""),st=i=>i===null||typeof i!="object"&&typeof i!="function",he=Array.isArray,jn=i=>he(i)||typeof i?.[Symbol.iterator]=="function",ne=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ai=/-->/g,li=/>/g,F=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),di=/'/g,ci=/"/g,fi=/^(?:script|style|textarea|title)$/i,ue=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),_=ue(1),Jo=ue(2),Qo=ue(3),U=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),hi=new WeakMap,z=V.createTreeWalker(V,129);Rn=(i,t)=>{let e=i.length-1,r=[],n,o=t===2?"<svg>":t===3?"<math>":"",s=nt;for(let d=0;d<e;d++){let a=i[d],c,f,p=-1,k=0;for(;k<a.length&&(s.lastIndex=k,f=s.exec(a),f!==null);)k=s.lastIndex,s===nt?f[1]==="!--"?s=ai:f[1]!==void 0?s=li:f[2]!==void 0?(fi.test(f[2])&&(n=RegExp("</"+f[2],"g")),s=F):f[3]!==void 0&&(s=F):s===F?f[0]===">"?(s=n??nt,p=-1):f[1]===void 0?p=-2:(p=s.lastIndex-f[2].length,c=f[1],s=f[3]===void 0?F:f[3]==='"'?ci:di):s===ci||s===di?s=F:s===ai||s===li?s=nt:(s=F,n=void 0);let T=s===F&&i[d+1].startsWith("/>")?" ":"";o+=s===nt?a+Bn:p>=0?(r.push(c),a.slice(0,p)+ui+a.slice(p)+I+T):a+I+(p===-2?d:T)}return[mi(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},at=class i{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let o=0,s=0,d=t.length-1,a=this.parts,[c,f]=Rn(t,e);if(this.el=i.createElement(c,r),z.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(n=z.nextNode())!==null&&a.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let p of n.getAttributeNames())if(p.endsWith(ui)){let k=f[s++],T=n.getAttribute(p).split(I),bt=/([.?@])?(.*)/.exec(k);a.push({type:1,index:o,name:bt[2],strings:T,ctor:bt[1]==="."?se:bt[1]==="?"?ae:bt[1]==="@"?le:G}),n.removeAttribute(p)}else p.startsWith(I)&&(a.push({type:6,index:o}),n.removeAttribute(p));if(fi.test(n.tagName)){let p=n.textContent.split(I),k=p.length-1;if(k>0){n.textContent=St?St.emptyScript:"";for(let T=0;T<k;T++)n.append(p[T],ot()),z.nextNode(),a.push({type:2,index:++o});n.append(p[k],ot())}}}else if(n.nodeType===8)if(n.data===pi)a.push({type:2,index:o});else{let p=-1;for(;(p=n.data.indexOf(I,p+1))!==-1;)a.push({type:7,index:o}),p+=I.length-1}o++}}static createElement(t,e){let r=V.createElement("template");return r.innerHTML=t,r}};oe=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,n=(t?.creationScope??V).importNode(e,!0);z.currentNode=n;let o=z.nextNode(),s=0,d=0,a=r[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new lt(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new de(o,this,t)),this._$AV.push(c),a=r[++d]}s!==a?.index&&(o=z.nextNode(),s++)}return z.currentNode=V,n}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},lt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),st(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==U&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):jn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&st(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=at.createElement(mi(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(e);else{let o=new oe(n,this),s=o.u(this.options);o.p(e),this.T(s),this._$AH=o}}_$AC(t){let e=hi.get(t.strings);return e===void 0&&hi.set(t.strings,e=new at(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,n=0;for(let o of t)n===e.length?e.push(r=new i(this.O(ot()),this.O(ot()),this,this.options)):r=e[n],r._$AI(o),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}_$AI(t,e=this,r,n){let o=this.strings,s=!1;if(o===void 0)t=Z(this,t,e,0),s=!st(t)||t!==this._$AH&&t!==U,s&&(this._$AH=t);else{let d=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=Z(this,d[r+a],e,a),c===U&&(c=this._$AH[a]),s||=!st(c)||c!==this._$AH[a],c===u?t=u:t!==u&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},se=class extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},ae=class extends G{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},le=class extends G{constructor(t,e,r,n,o){super(t,e,r,n,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??u)===U)return;let r=this._$AH,n=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==u&&(r===u||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},de=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}},Fn=ce.litHtmlPolyfillSupport;Fn?.(at,lt),(ce.litHtmlVersions??=[]).push("3.3.0");vi=(i,t,e)=>{let r=e?.renderBefore??t,n=r._$litPart$;if(n===void 0){let o=e?.renderBefore??null;r._$litPart$=n=new lt(t.insertBefore(ot(),o),o,void 0,e??{})}return n._$AI(i),n}});var pe,g,zn,gi=l(()=>{kt();kt();dt();dt();pe=globalThis,g=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};g._$litElement$=!0,g.finalized=!0,pe.litElementHydrateSupport?.({LitElement:g});zn=pe.litElementPolyfillSupport;zn?.({LitElement:g});(pe.litElementVersions??=[]).push("4.2.0")});var bi=l(()=>{});var b=l(()=>{kt();dt();gi();bi()});var _i,xi=l(()=>{dt();_i=i=>i??u});var yi=l(()=>{xi()});function Vn(i,t){let e=t;for(;e;){if(wi.get(e)===i)return!0;e=Object.getPrototypeOf(e)}return!1}function v(i){return t=>{if(Vn(i,t))return t;let e=i(t);return wi.set(e,i),e}}var wi,Ci=l(()=>{wi=new WeakMap});var C=l(()=>{Ci()});function fe(i){return new Set(i?i.split(" ").filter(Boolean):[])}function ki(i){return i?[...i].join(" "):""}function y(i,t,e){e?i.setAttribute(t,e):i.removeAttribute(t)}function Si(i){return fe(Array.isArray(i)?i.join(" "):i)}function me(i,t,e){e=Si(e);let r=fe(i.getAttribute(t));e.forEach(n=>r.add(n)),y(i,t,ki(r))}function ve(i,t,e){e=Si(e);let r=fe(i.getAttribute(t));e.forEach(n=>r.delete(n)),y(i,t,ki(r))}function Ei(i){return i.nodeType===Node.TEXT_NODE&&i.textContent.trim()===""}function Ai(i){return i?!!(i.nodeType===Node.ELEMENT_NODE&&(customElements.get(i.localName)||i.children.length>0)||i.textContent?.trim()):!1}var H=l(()=>{"use strict";});var Un,N,ct=l(()=>{"use strict";C();H();Un=i=>class extends i{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}_disabledChanged(e){this._setAriaDisabled(e)}_setAriaDisabled(e){y(this,"aria-disabled",e)}click(){this.disabled||super.click()}},N=v(Un)});function Mi(){return ge}function $i(i){return i.getRootNode().activeElement===i}var ge,be=l(()=>{"use strict";ge=!1;window.addEventListener("keydown",()=>{ge=!0},{capture:!0});window.addEventListener("mousedown",()=>{ge=!1},{capture:!0})});var Hn,X,Et=l(()=>{"use strict";C();be();Hn=i=>class extends i{get _keyboardActive(){return Mi()}ready(){this.addEventListener("focusin",e=>{this._shouldSetFocus(e)&&this._setFocused(!0)}),this.addEventListener("focusout",e=>{this._shouldRemoveFocus(e)&&this._setFocused(!1)}),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}focus(e){super.focus(e),e?.focusVisible!==!1&&this.setAttribute("focus-ring","")}_setFocused(e){this.toggleAttribute("focused",e),this.toggleAttribute("focus-ring",e&&this._keyboardActive)}_shouldSetFocus(e){return!0}_shouldRemoveFocus(e){return!0}},X=v(Hn)});var Ti,Ii=l(()=>{"use strict";b();Ti=m`
  .sr-only {
    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    clip-path: inset(50%) !important;
    height: 1px !important;
    margin: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
    white-space: nowrap !important;
  }
`});function qn(i){return i.replace(/-[a-z]/gu,t=>t[1].toUpperCase())}function O(i,t="25.4.0-alpha3"){if(Object.defineProperty(i,"version",{get(){return t}}),i.experimental){let r=typeof i.experimental=="string"?i.experimental:`${qn(i.is.split("-").slice(1).join("-"))}Component`;if(!window.Vaadin.featureFlags[r]&&!E[r]){E[r]=new Set,E[r].add(i),Object.defineProperty(window.Vaadin.featureFlags,r,{get(){return E[r].size===0},set(n){n&&E[r].size>0&&(E[r].forEach(o=>{customElements.define(o.is,o)}),E[r].clear())}});return}else if(E[r]){E[r].add(i);return}}let e=customElements.get(i.is);if(!e)customElements.define(i.is,i);else{let r=e.version;r&&i.version&&r===i.version?console.warn(`The component ${i.is} has been loaded twice`):console.error(`Tried to define ${i.is} version ${i.version} when version ${e.version} is already in use. Something will probably break.`)}}var E,ht=l(()=>{"use strict";window.Vaadin||={};window.Vaadin.featureFlags||={};E={}});function Kn(){function i(){return!0}return Ni(i)}function Yn(){try{return Zn()?!0:Gn()?At?!Xn():!Kn():!1}catch{return!1}}function Zn(){return localStorage.getItem("vaadin.developmentmode.force")}function Gn(){return["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0}function Xn(){return!!(At&&Object.keys(At).map(t=>At[t]).filter(t=>t.productionMode).length>0)}function Ni(i,t){if(typeof i!="function")return;let e=Wn.exec(i.toString());if(e)try{i=new Function(e[1])}catch(r){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",r)}return i(t)}var Wn,At,_e,Oi=l(()=>{Wn=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,At=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;window.Vaadin=window.Vaadin||{};_e=function(i,t){if(window.Vaadin.developmentMode)return Ni(i,t)};window.Vaadin.developmentMode===void 0&&(window.Vaadin.developmentMode=Yn())});function Jn(){}var Pi,Li=l(()=>{Oi();Pi=function(){if(typeof _e=="function")return _e(Jn)}});var Di=l(()=>{Li()});function Qn(){xe=!1;let i=J.length;for(let t=0;t<i;t++){let e=J[t];if(e)try{e()}catch(r){setTimeout(()=>{throw r})}}J.splice(0,i),ji+=i}var Bi,ji,J,xe,Ri,Fi,zi,Mt=l(()=>{"use strict";Bi=0,ji=0,J=[],xe=!1;Ri={run(i){return window.requestAnimationFrame(i)},cancel(i){window.cancelAnimationFrame(i)}},Fi={run(i){return window.requestIdleCallback?window.requestIdleCallback(i):window.setTimeout(i,16)},cancel(i){window.cancelIdleCallback?window.cancelIdleCallback(i):window.clearTimeout(i)}},zi={run(i){xe||(xe=!0,queueMicrotask(()=>Qn())),J.push(i);let t=Bi;return Bi+=1,t},cancel(i){let t=i-ji;if(t>=0){if(!J[t])throw new Error(`invalid async handle: ${i}`);J[t]=null}}}});function Vi(i){ye.add(i)}var ye,Q,we=l(()=>{"use strict";ye=new Set,Q=class i{static debounce(t,e,r){return t instanceof i?t._cancelAsync():t=new i,t.setConfig(e,r),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run(()=>{this._timer=null,ye.delete(this),this._callback()})}cancel(){this.isActive()&&(this._cancelAsync(),ye.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return this._timer!=null}}});function Ce(i,t,e=i.getAttribute("dir")){t?i.setAttribute("dir",t):e!=null&&i.removeAttribute("dir")}function ke(){return document.documentElement.getAttribute("dir")}function to(){let i=ke();A.forEach(t=>{Ce(t,i)})}var A,eo,Ui,Hi=l(()=>{"use strict";A=[];eo=new MutationObserver(to);eo.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});Ui=i=>class extends i{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:e=>e||"",toAttribute:e=>e===""?null:e}}}}get __isRTL(){return this.getAttribute("dir")==="rtl"}connectedCallback(){super.connectedCallback(),(!this.hasAttribute("dir")||this.__restoreSubscription)&&(this.__subscribe(),Ce(this,ke(),null))}attributeChangedCallback(e,r,n){if(super.attributeChangedCallback(e,r,n),e!=="dir")return;let o=ke(),s=n===o&&A.indexOf(this)===-1,d=!n&&r&&A.indexOf(this)===-1;s||d?(this.__subscribe(),Ce(this,o,n)):n!==o&&r===o&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=A.includes(this),this.__unsubscribe()}_valueToNodeAttribute(e,r,n){n==="dir"&&r===""&&!e.hasAttribute("dir")||super._valueToNodeAttribute(e,r,n)}_attributeToProperty(e,r,n){e==="dir"&&!r?this.dir="":super._attributeToProperty(e,r,n)}__subscribe(){A.includes(this)||A.push(this)}__unsubscribe(){A.includes(this)&&A.splice(A.indexOf(this),1)}}});var Se,qi,P,ut=l(()=>{"use strict";Di();Mt();we();Hi();window.Vaadin||(window.Vaadin={});window.Vaadin.registrations||(window.Vaadin.registrations=[]);window.Vaadin.developmentModeCallback||(window.Vaadin.developmentModeCallback={});window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){Pi()};qi=new Set,P=i=>class extends Ui(i){static _ensureRegistrations(){let{is:e}=this;if(e&&!qi.has(e)){window.Vaadin.registrations.push(this),qi.add(e);let r=window.Vaadin.developmentModeCallback;r&&(Se=Q.debounce(Se,Fi,()=>{r["vaadin-usage-statistics"]()}),Vi(Se))}}constructor(){super(),document.doctype===null&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'),this.constructor._ensureRegistrations()}}});function Wi(i,t){return i.split(".").reduce((e,r)=>e?e[r]:void 0,t)}function Ki(i,t,e){let r=i.split("."),n=r.pop(),o=r.reduce((s,d)=>s[d],e);o[n]=t}var Yi=l(()=>{"use strict";});function Zi(i){return Ee[i]||(Ee[i]=i.replace(io,"-$1").toLowerCase()),Ee[i]}function Gi(i){return i[0].toUpperCase()+i.substring(1)}function Ae(i){let[t,e]=i.split("("),r=e.replace(")","").split(",").map(n=>n.trim());return{method:t,observerProps:r}}function Me(i,t){return Object.prototype.hasOwnProperty.call(i,t)||(i[t]=new Map(i[t])),i[t]}var Ee,io,ro,L,pt=l(()=>{"use strict";C();b();Yi();Ee={},io=/([A-Z])/gu;ro=i=>{class t extends i{static enabledWarnings=[];static createProperty(r,n){[String,Boolean,Number,Array].includes(n)&&(n={type:n}),n?.reflectToAttribute&&(n.reflect=!0),super.createProperty(r,n)}static getOrCreateMap(r){return Me(this,r)}static finalize(){if(window.litIssuedWarnings&&(window.litIssuedWarnings.add("no-override-create-property"),window.litIssuedWarnings.add("no-override-get-property-descriptor")),super.finalize(),Array.isArray(this.observers)){let r=this.getOrCreateMap("__complexObservers");this.observers.forEach(n=>{let{method:o,observerProps:s}=Ae(n);r.set(o,s)})}}static addCheckedInitializer(r){super.addInitializer(n=>{n instanceof this&&r(n)})}static getPropertyDescriptor(r,n,o){let s=super.getPropertyDescriptor(r,n,o),d=s;if(this.getOrCreateMap("__propKeys").set(r,n),o.sync&&(d={get:s.get,set(a){let c=this[r];Ct(a,c)&&(this[n]=a,this.requestUpdate(r,c,o),this.hasUpdated&&this.performUpdate())},configurable:!0,enumerable:!0}),o.readOnly){let a=d.set;this.addCheckedInitializer(c=>{c[`_set${Gi(r)}`]=function(f){a.call(c,f)}}),d={get:d.get,set(){},configurable:!0,enumerable:!0}}if("value"in o&&this.addCheckedInitializer(a=>{let c=typeof o.value=="function"?o.value.call(a):o.value;o.readOnly?a[`_set${Gi(r)}`](c):a[r]=c}),o.observer){let a=o.observer;this.getOrCreateMap("__observers").set(r,a),this.addCheckedInitializer(c=>{c[a]||console.warn(`observer method ${a} not defined`)})}if(o.notify){if(!this.__notifyProps)this.__notifyProps=new Set;else if(!this.hasOwnProperty("__notifyProps")){let a=this.__notifyProps;this.__notifyProps=new Set(a)}this.__notifyProps.add(r)}if(o.computed){let a=`__assignComputed${r}`,c=Ae(o.computed);this.prototype[a]=function(...f){this[r]=this[c.method](...f)},this.getOrCreateMap("__computedObservers").set(a,c.observerProps)}return o.attribute||(o.attribute=Zi(r)),d}static get polylitConfig(){return{asyncFirstRender:!1}}connectedCallback(){super.connectedCallback();let{polylitConfig:r}=this.constructor;!this.hasUpdated&&!r.asyncFirstRender&&this.performUpdate()}firstUpdated(){super.firstUpdated(),this.$||(this.$={}),this.renderRoot.querySelectorAll("[id]").forEach(r=>{this.$[r.id]=r})}ready(){}willUpdate(r){this.constructor.__computedObservers&&this.__runComplexObservers(r,this.constructor.__computedObservers)}updated(r){let n=this.__isReadyInvoked;this.__isReadyInvoked=!0,this.constructor.__observers&&this.__runObservers(r,this.constructor.__observers),this.constructor.__complexObservers&&this.__runComplexObservers(r,this.constructor.__complexObservers),this.__dynamicPropertyObservers&&this.__runDynamicObservers(r,this.__dynamicPropertyObservers),this.__dynamicMethodObservers&&this.__runComplexObservers(r,this.__dynamicMethodObservers),this.constructor.__notifyProps&&this.__runNotifyProps(r,this.constructor.__notifyProps),n||this.ready()}setProperties(r){Object.entries(r).forEach(([n,o])=>{let s=this.constructor.__propKeys.get(n),d=this[s];this[s]=o,this.requestUpdate(n,d)}),this.hasUpdated&&this.performUpdate()}_createMethodObserver(r){let n=Me(this,"__dynamicMethodObservers"),{method:o,observerProps:s}=Ae(r);n.set(o,s)}_createPropertyObserver(r,n){Me(this,"__dynamicPropertyObservers").set(n,r)}__runComplexObservers(r,n){n.forEach((o,s)=>{o.some(d=>r.has(d))&&(this[s]?this[s](...o.map(d=>this[d])):console.warn(`observer method ${s} not defined`))})}__runDynamicObservers(r,n){n.forEach((o,s)=>{r.has(o)&&this[s]&&this[s](this[o],r.get(o))})}__runObservers(r,n){r.forEach((o,s)=>{let d=n.get(s);d!==void 0&&this[d]&&this[d](this[s],o)})}__runNotifyProps(r,n){r.forEach((o,s)=>{n.has(s)&&this.dispatchEvent(new CustomEvent(`${Zi(s)}-changed`,{detail:{value:this[s]}}))})}_get(r,n){return Wi(r,n)}_set(r,n,o){Ki(r,n,o)}}return t},L=v(ro)});function $t(i){try{CSS.registerProperty(i)}catch(t){if(t instanceof DOMException&&t.name==="InvalidModificationError")console.warn(`The CSS property ${i.name} has already been registered.`);else throw t}}var Xi,$e=l(()=>{"use strict";Xi=(i,...t)=>{let e=document.createElement("style");e.id=i,e.textContent=t.map(r=>r.toString()).join(`
`),document.head.insertAdjacentElement("afterbegin",e)}});var Tt,Ji=l(()=>{"use strict";Tt=class i extends EventTarget{#t;#e=new Set;#i;#r=!1;constructor(t){super(),this.#t=t,this.#i=new CSSStyleSheet}#o(t){let{propertyName:e}=t;this.#e.has(e)&&this.dispatchEvent(new CustomEvent("property-changed",{detail:{propertyName:e}}))}observe(t){this.connect(),!this.#e.has(t)&&(this.#e.add(t),this.#i.replaceSync(`
      :root::before, :host::before {
        content: '' !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        visibility: hidden !important;
        transition: 1ms allow-discrete step-end !important;
        transition-property: ${[...this.#e].join(", ")} !important;
      }
    `))}connect(){this.#r||(this.#t.adoptedStyleSheets.unshift(this.#i),this.#n.addEventListener("transitionstart",t=>this.#o(t)),this.#n.addEventListener("transitionend",t=>this.#o(t)),this.#r=!0)}disconnect(){this.#e.clear(),this.#t.adoptedStyleSheets=this.#t.adoptedStyleSheets.filter(t=>t!==this.#i),this.#n.removeEventListener("transitionstart",this.#o),this.#n.removeEventListener("transitionend",this.#o),this.#r=!1}get#n(){return this.#t.documentElement??this.#t.host}static for(t){return t.__cssPropertyObserver||=new i(t),t.__cssPropertyObserver}}});function no(i){let{baseStyles:t,themeStyles:e,elementStyles:r,lumoInjector:n}=i.constructor,o=i.__lumoStyleSheet;return o?[...n.includeBaseStyles?t??r:[],o,...e??[]]:r}function Te(i){yt(i.shadowRoot,no(i))}function Ie(i,t){i.__lumoStyleSheet=t,Te(i)}function It(i){i.__lumoStyleSheet=void 0,Te(i)}var Ne=l(()=>{"use strict";b();});function Oe(i){Qi.has(i)||(Qi.add(i),console.warn(i))}var Qi,tr=l(()=>{"use strict";Qi=new Set});function ir(i){try{return i.media.mediaText}catch{return Oe('[LumoInjector] Browser denied to access property "mediaText" for some CSS rules, so they were skipped.'),""}}function oo(i){try{return i.cssRules}catch{return Oe('[LumoInjector] Browser denied to access property "cssRules" for some CSS stylesheets, so they were skipped.'),[]}}function rr(i,t={tags:new Map,modules:new Map}){for(let e of oo(i)){if(e instanceof CSSImportRule){let r=ir(e);r.startsWith("lumo_")?t.modules.set(r,[...e.styleSheet.cssRules]):rr(e.styleSheet,t);continue}if(e instanceof CSSMediaRule){let r=ir(e);r.startsWith("lumo_")&&t.modules.set(r,[...e.cssRules]);continue}if(e instanceof CSSStyleRule&&e.cssText.includes("-inject")){for(let r of e.style){let n=r.match(/^--_lumo-(.*)-inject-modules$/u)?.[1];if(!n)continue;let o=e.style.getPropertyValue(r);t.tags.set(n,o.split(",").map(s=>s.trim().replace(/'|"/gu,"")))}continue}}return t}function nr(i){let t=new Map,e=new Map;for(let r of i){let n=er.get(r);n||(n=rr(r),er.set(r,n)),t=new Map([...t,...n.tags]),e=new Map([...e,...n.modules])}return{tags:t,modules:e}}var er,or=l(()=>{"use strict";tr();er=new WeakMap});function Pe(i){return`--_lumo-${i.is}-inject`}var Nt,sr=l(()=>{"use strict";Ji();Ne();or();Nt=class{#t;#e;#i=new Map;#r=new Map;constructor(t=document){this.#t=t,this.handlePropertyChange=this.handlePropertyChange.bind(this),this.#e=Tt.for(t),this.#e.addEventListener("property-changed",this.handlePropertyChange)}disconnect(){this.#e.removeEventListener("property-changed",this.handlePropertyChange),this.#i.clear(),this.#r.values().forEach(t=>t.forEach(It))}forceUpdate(){for(let t of this.#i.keys())this.#n(t)}componentConnected(t){let{lumoInjector:e}=t.constructor,{is:r}=e;this.#r.set(r,this.#r.get(r)??new Set),this.#r.get(r).add(t);let n=this.#i.get(r);if(n){n.cssRules.length>0&&Ie(t,n);return}this.#o(r);let o=Pe(e);this.#e.observe(o)}componentDisconnected(t){let{is:e}=t.constructor.lumoInjector;this.#r.get(e)?.delete(t),It(t)}handlePropertyChange(t){let{propertyName:e}=t.detail,r=e.match(/^--_lumo-(.*)-inject$/u)?.[1];r&&this.#n(r)}#o(t){this.#i.set(t,new CSSStyleSheet),this.#n(t)}#n(t){let{tags:e,modules:r}=nr(this.#s),n=(e.get(t)??[]).flatMap(s=>r.get(s)??[]).map(s=>s.cssText).join(`
`),o=this.#i.get(t);o.replaceSync(n),this.#r.get(t)?.forEach(s=>{n?Ie(s,o):It(s)})}get#s(){let t=new Set;for(let e of[this.#t,document])t=t.union(new Set(e.styleSheets)),t=t.union(new Set(e.adoptedStyleSheets));return[...t]}}});function lr(i){let t=i.getRootNode();return t.host&&t.host.constructor.version?lr(t.host):t}var ar,D,ft=l(()=>{"use strict";$e();sr();ar=new Set;D=i=>class extends i{static finalize(){super.finalize();let e=Pe(this.lumoInjector);this.is&&!ar.has(e)&&(ar.add(e),$t({name:e,syntax:"<number>",inherits:!0,initialValue:"0"}))}static get lumoInjector(){return{is:this.is,includeBaseStyles:!1}}connectedCallback(){super.connectedCallback();let e=lr(this);e.__lumoInjectorDisabled||this.isConnected&&(e.__lumoInjector||=new Nt(e),this.__lumoInjector=e.__lumoInjector,this.__lumoInjector.componentConnected(this))}disconnectedCallback(){super.disconnectedCallback(),this.__lumoInjector&&(this.__lumoInjector.componentDisconnected(this),this.__lumoInjector=void 0)}}});var q=l(()=>{"use strict";b();$e();["--vaadin-text-color","--vaadin-text-color-disabled","--vaadin-text-color-secondary","--vaadin-border-color","--vaadin-border-color-secondary","--vaadin-background-color"].forEach(i=>{$t({name:i,syntax:"<color>",inherits:!0,initialValue:"transparent"})});Xi("vaadin-base",m`
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
  `)});var dr,cr=l(()=>{"use strict";q();b();dr=m`
  :host {
    --_gap: var(--vaadin-stepper-gap, 0px);
    --_size: var(--vaadin-stepper-indicator-size, 1.75rem);
    --_padding-block: var(--vaadin-padding-xs);
    --_padding-inline: var(--vaadin-padding-xs);
    --_connector-width: var(--vaadin-stepper-connector-width, 1px);
    --_accent-color: var(--vaadin-stepper-accent-color, var(--vaadin-text-color));
    --_error-color: var(--vaadin-stepper-error-color, var(--vaadin-text-color));
    --_icon-exclamation: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v9"/><path d="M12 19h.01"/></svg>');
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
    color: var(--vaadin-text-color-secondary);
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:last-of-type) {
    flex: 0 1 auto;
  }

  :host(:is([current], [completed])) {
    color: var(--vaadin-text-color);
  }

  :host([disabled]) {
    color: var(--vaadin-text-color-disabled);
  }

  [part='link'],
  [part='nolink'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-s);
    min-width: 0;
    padding: var(--_padding-block) var(--_padding-inline);
    border-radius: var(--vaadin-radius-m);
    color: inherit;
  }

  [part='link'] {
    text-decoration: none;
    outline: none;
    cursor: var(--vaadin-clickable-cursor);

    &:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }
  }

  :host([disabled]) [part='link'] {
    cursor: var(--vaadin-disabled-cursor);
  }

  @media (any-hover: hover) {
    :host(:not([disabled])) [part='link']:hover [part='label'] {
      text-decoration: underline;
    }
  }

  /* Indicator */

  [part='indicator'] {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--_size);
    height: var(--_size);
    border: 1px solid var(--vaadin-stepper-indicator-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-stepper-indicator-border-radius, 50%);
    background: var(--vaadin-stepper-indicator-background, var(--vaadin-background-color));
    font-size: var(--vaadin-stepper-indicator-font-size, 0.875em);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  :host([current]) [part='indicator'] {
    border: 2px solid var(--_accent-color);
    color: var(--_accent-color);
  }

  :host([completed]) [part='indicator'] {
    border-color: var(--_accent-color);
    background: var(--_accent-color);
    color: var(--vaadin-stepper-accent-contrast-color, var(--vaadin-background-color));
  }

  :host([invalid]) [part='indicator'] {
    border-color: var(--_error-color);
    background: var(--_error-color);
    color: var(--vaadin-stepper-error-contrast-color, var(--vaadin-background-color));
  }

  :host(:is([completed], [invalid])) [part='indicator']::before {
    content: '';
    width: 60%;
    height: 60%;
    background: currentColor;
    mask: var(--vaadin-stepper-completed-icon, var(--_vaadin-icon-checkmark)) center / contain no-repeat;
  }

  :host([invalid]) [part='indicator']::before {
    mask-image: var(--vaadin-stepper-invalid-icon, var(--_icon-exclamation));
  }

  :host([disabled]) [part='indicator'] {
    opacity: 0.5;
  }

  /* Label and description */

  [part='content'] {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  [part='label'] {
    font-weight: 500;
  }

  :host([current]) [part='label'] {
    font-weight: 600;
  }

  :host([invalid]) [part='label'] {
    color: var(--_error-color);
  }

  [part='description'] {
    font-size: 0.875em;
    color: var(--vaadin-text-color-secondary);
  }

  :host([disabled]) [part='description'] {
    color: inherit;
  }

  /* Connector */

  [part='connector'] {
    flex: 1 1 0;
    min-width: var(--vaadin-gap-l);
    border-top: var(--_connector-width) solid
      var(--vaadin-stepper-connector-color, var(--vaadin-border-color-secondary));
  }

  :host([completed]:not([invalid])) [part='connector'] {
    border-color: var(--_accent-color);
  }

  /* Vertical orientation */

  :host([orientation='vertical']) {
    display: block;
    flex: none;
  }

  :host([orientation='vertical']:not(:last-of-type)) {
    padding-bottom: var(--vaadin-gap-m);
  }

  :host([orientation='vertical']) :is([part='link'], [part='nolink']) {
    align-items: flex-start;
  }

  :host([orientation='vertical']) [part='content'] {
    padding-top: max(0px, (var(--_size) - 1lh) / 2);
  }

  :host([orientation='vertical']) [part='connector'] {
    position: absolute;
    inset-inline-start: calc(var(--_padding-inline) + (var(--_size) - var(--_connector-width)) / 2);
    top: calc(var(--_padding-block) + var(--_size) + var(--vaadin-gap-xs));
    bottom: calc(var(--vaadin-gap-xs) - var(--_gap) - var(--_padding-block));
    min-width: 0;
    border-top: none;
    border-inline-start: var(--_connector-width) solid
      var(--vaadin-stepper-connector-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical'][completed]:not([invalid])) [part='connector'] {
    border-color: var(--_accent-color);
  }

  @media (forced-colors: active) {
    [part='indicator']::before {
      background: CanvasText !important;
    }

    :host([current]) [part='indicator'] {
      border-color: Highlight;
    }

    [part='connector'] {
      border-color: CanvasText !important;
    }
  }
`});var mt,Le=l(()=>{"use strict";b();yi();ct();Et();Ii();ht();ut();pt();ft();cr();mt=class extends X(N(P(L(D(g))))){static get is(){return"vaadin-step"}static get experimental(){return"stepperComponent"}static get shadowRootOptions(){return{...g.shadowRootOptions,delegatesFocus:!0}}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}static get styles(){return[dr,Ti]}static get properties(){return{path:{type:String},current:{type:Boolean,value:!1,reflectToAttribute:!0},completed:{type:Boolean,value:!1,reflectToAttribute:!0},invalid:{type:Boolean,value:!1,reflectToAttribute:!0},_position:{type:Number,attribute:!1},_last:{type:Boolean,value:!1,attribute:!1},_i18n:{type:Object,attribute:!1,value:()=>({completed:"Completed",invalid:"Error"})}}}firstUpdated(){super.firstUpdated(),this.hasAttribute("role")||this.setAttribute("role","listitem")}render(){let t=_`
      <span part="indicator" aria-hidden="true">${this.__hasIcon()?u:this._position}</span>
      <span part="content">
        <span part="label"><slot></slot></span>
        <span part="description"><slot name="description"></slot></span>
      </span>
      ${this.__renderStateText()}
    `;return _`
      ${this.path==null?_`<div part="nolink" aria-current="${this.current?"step":u}">${t}</div>`:_`
              <a
                part="link"
                href="${_i(this.disabled?void 0:this.path)}"
                tabindex="${this.disabled?"-1":"0"}"
                aria-current="${this.current?"step":u}"
                >${t}</a
              >
            `}
      ${this._last?u:_`<span part="connector" aria-hidden="true"></span>`}
    `}focus(t){this.disabled||super.focus(t)}_shouldSetFocus(){return!this.disabled}__hasIcon(){return this.invalid||this.completed}__renderStateText(){let t=this._i18n||{},e=this.invalid?t.invalid:this.completed?t.completed:null;return e?_`<span class="sr-only">${e}</span>`:u}};O(mt)});function hr(i,t,e){return!Ot(i)||!Ot(t)||Object.keys(t).forEach(r=>{if(so.includes(r))return;let n=t[r];if(Ot(n)){if(!Object.hasOwn(i,r)||!Ot(i[r])){if(e&&Object.hasOwn(i,r)&&i[r])return;i[r]={}}hr(i[r],n,e)}else e&&Array.isArray(n)?i[r]=[...n]:(!e||n!=null)&&(i[r]=n)}),i}function ur(i,...t){return t.forEach(e=>hr(i,e,!0)),i}var so,Ot,pr=l(()=>{"use strict";so=["__proto__","constructor","prototype"],Ot=i=>{if(!i||typeof i!="object")return!1;let t=Object.getPrototypeOf(i);return t===Object.prototype||t===null}});var fr,mr=l(()=>{"use strict";pr();fr=i=>class extends i{static get properties(){return{i18n:{type:Object},__effectiveI18n:{type:Object,sync:!0}}}static get defaultI18n(){return{}}constructor(){super(),this.__updateEffectiveI18n()}get i18n(){return this.__customI18n}set i18n(e){e!==this.__customI18n&&(this.__customI18n=e,this.__updateEffectiveI18n())}__updateEffectiveI18n(){this.__effectiveI18n=ur({},this.constructor.defaultI18n,this.__customI18n)}}});var tt,De=l(()=>{"use strict";tt=class{constructor(t,e,r={}){this.target=t,this.callback=e,this.forceInitial=r.forceInitial,this._storedNodes=[],this._isSlot=t instanceof HTMLSlotElement,this._connected=!1,this._scheduled=!1,this._boundSchedule=()=>{this._schedule()},this.connect(),r.syncInitial?this.flush():this._schedule()}connect(){this.target.addEventListener("slotchange",this._boundSchedule),this._connected=!0}disconnect(){this.target.removeEventListener("slotchange",this._boundSchedule),this._connected=!1}_schedule(){this._scheduled||(this._scheduled=!0,queueMicrotask(()=>{this._scheduled&&this.flush()}))}flush(){this._connected&&(this._scheduled=!1,this._processNodes())}_collectNodes(){let t=this._isSlot?[this.target]:[...this.target.querySelectorAll("slot")];return[...new Set(t.flatMap(e=>e.assignedNodes({flatten:!0})))]}_groupNodesBySlot(t){let e=new Map;return t.forEach(r=>{let n=r.assignedSlot;e.set(n,e.get(n)??[]),e.get(n).push(r)}),e}_collectMovedNodes(t){let e=this._groupNodesBySlot(t),r=this._groupNodesBySlot(this._storedNodes),n=[];return e.forEach((o,s)=>{let d=r.get(s)||[];new Set(d).difference(new Set(o)).size>0||d.forEach((a,c)=>{o.indexOf(a)!==c&&n.push(a)})}),n}_processNodes(){let t=this._collectNodes(),e=t.filter(o=>!this._storedNodes.includes(o)),r=this._storedNodes.filter(o=>!t.includes(o)),n=this._collectMovedNodes(t);(e.length||r.length||n.length||this.forceInitial)&&this.callback({addedNodes:e,currentNodes:t,movedNodes:n,removedNodes:r}),this.forceInitial&&(this.forceInitial=!1),this._storedNodes=t}}});var vr,gr=l(()=>{"use strict";q();b();vr=m`
  :host {
    display: flex;
    align-items: flex-start;
    gap: var(--vaadin-stepper-gap, 0);
    font-size: var(--vaadin-stepper-font-size, 1em);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    flex-direction: column;
    align-items: stretch;
  }

  :host([theme~='small']) {
    --vaadin-stepper-indicator-size: 1.25rem;
    --vaadin-stepper-indicator-font-size: 0.75em;
    --vaadin-stepper-font-size: 0.875em;
  }
`});var ao,Pt,Be=l(()=>{"use strict";Le();b();ht();ut();mr();pt();De();ft();gr();Le();ao={completed:"Completed",invalid:"Error"},Pt=class extends fr(P(L(D(g)))){static get is(){return"vaadin-stepper"}static get experimental(){return"stepperComponent"}static get lumoInjector(){return{...super.lumoInjector,includeBaseStyles:!0}}static get styles(){return vr}static get properties(){return{orientation:{type:String,value:"horizontal",reflectToAttribute:!0,sync:!0}}}static get defaultI18n(){return ao}get i18n(){return super.i18n}set i18n(t){super.i18n=t}render(){return _`<slot></slot>`}firstUpdated(){super.firstUpdated(),this.hasAttribute("role")||this.setAttribute("role","list"),this.__slotObserver=new tt(this.shadowRoot.querySelector("slot"),()=>this.__updateSteps(),{syncInitial:!0}),this.__hiddenObserver=new MutationObserver(()=>this.__updateSteps()),this.__hiddenObserver.observe(this,{attributeFilter:["hidden"],subtree:!0})}updated(t){super.updated(t),(t.has("orientation")||t.has("__effectiveI18n"))&&this.__slotObserver&&this.__updateSteps()}__getSteps(){return[...this.children].filter(t=>t instanceof mt)}__updateSteps(){let t=this.__getSteps().filter(e=>!e.hidden);t.forEach((e,r)=>{e._position=r+1,e._last=r===t.length-1,e._i18n=this.__effectiveI18n,e.setAttribute("orientation",this.orientation)})}};O(Pt)});var br={};Qt(br,{Stepper:()=>Pt});var _r=l(()=>{"use strict";Be();Be()});function xr(){return lo++}var lo,yr=l(()=>{"use strict";lo=0});var B,Lt=l(()=>{"use strict";H();De();yr();B=class extends EventTarget{static generateId(t,e="default"){return`${e}-${t.localName}-${xr()}`}constructor(t,e,r,n={}){super();let{initializer:o,multiple:s,observe:d,useUniqueId:a,uniqueIdPrefix:c}=n;this.host=t,this.slotName=e,this.tagName=r,this.observe=typeof d=="boolean"?d:!0,this.multiple=typeof s=="boolean"?s:!1,this.slotInitializer=o,s&&(this.nodes=[]),a&&(this.defaultId=this.constructor.generateId(t,c||e))}hostConnected(){this.initialized||(this.multiple?this.initMultiple():this.initSingle(),this.observe&&this.observeSlot(),this.initialized=!0)}initSingle(){let t=this.getSlotChild();t?(this.node=t,this.initAddedNode(t)):(t=this.attachDefaultNode(),this.initNode(t))}initMultiple(){let t=this.getSlotChildren();if(t.length===0){let e=this.attachDefaultNode();e&&(this.nodes=[e],this.initNode(e))}else this.nodes=t,t.forEach(e=>{this.initAddedNode(e)})}attachDefaultNode(){let{host:t,slotName:e,tagName:r}=this,n=this.defaultNode;return!n&&r&&(n=document.createElement(r),n instanceof Element&&(e!==""&&n.setAttribute("slot",e),this.defaultNode=n)),n&&(this.node=n,t.appendChild(n)),n}getSlotChildren(){let{slotName:t}=this;return Array.from(this.host.childNodes).filter(e=>e.nodeType===Node.ELEMENT_NODE&&e.hasAttribute("data-slot-ignore")?!1:e.nodeType===Node.ELEMENT_NODE&&e.slot===t||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()&&t==="")}getSlotChild(){return this.getSlotChildren()[0]}initNode(t){let{slotInitializer:e}=this;e&&e(t,this.host)}initCustomNode(t){}teardownNode(t){}initAddedNode(t){t!==this.defaultNode&&(this.initCustomNode(t),this.initNode(t))}observeSlot(){let{slotName:t}=this,e=t===""?"slot:not([name])":`slot[name=${t}]`,r=this.host.shadowRoot.querySelector(e);new tt(r,({addedNodes:n,removedNodes:o})=>{let s=this.multiple?this.nodes:[this.node],d=n.filter(a=>!Ei(a)&&!s.includes(a)&&!(a.nodeType===Node.ELEMENT_NODE&&a.hasAttribute("data-slot-ignore")));o.length&&(this.nodes=s.filter(a=>!o.includes(a)),o.forEach(a=>{this.teardownNode(a)})),d?.length>0&&(this.multiple?(this.defaultNode&&this.defaultNode.remove(),this.nodes=[...s,...d].filter(a=>a!==this.defaultNode),d.forEach(a=>{this.initAddedNode(a)})):(this.node&&this.node.remove(),this.node=d[0],this.initAddedNode(this.node)))})}}});var et,je=l(()=>{"use strict";Lt();et=class extends B{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,this.ariaTarget!==void 0&&(t.ariaTarget=this.ariaTarget),this.context!==void 0&&(t.context=this.context),this.manual!==void 0&&(t.manual=this.manual),this.position!==void 0&&(t._position=this.position),this.shouldShow!==void 0&&(t.shouldShow=this.shouldShow),this.manual||this.host.setAttribute("has-tooltip",""),this.#e(t),t.addEventListener("content-changed",this.#t)}teardownNode(t){this.manual||this.host.removeAttribute("has-tooltip"),t.removeEventListener("content-changed",this.#t),this.#e(null)}setAriaTarget(t){this.ariaTarget=t;let e=this.node;e&&(e.ariaTarget=t)}setContext(t){this.context=t;let e=this.node;e&&(e.context=t)}setManual(t){this.manual=t;let e=this.node;e&&(e.manual=t)}setPosition(t){this.position=t;let e=this.node;e&&(e._position=t)}setShouldShow(t){this.shouldShow=t;let e=this.node;e&&(e.shouldShow=t)}setTarget(t){this.target=t;let e=this.node;e&&(e.target=t)}open(t){let e=this.node;e?.isConnected&&e._stateController.open(t)}close(t){let e=this.node;e&&e._stateController.close(t)}#t=t=>{this.#e(t.target)};#e(t){this.dispatchEvent(new CustomEvent("tooltip-changed",{detail:{node:t}}))}}});var wr,Cr=l(()=>{"use strict";wr=i=>class extends i{static get properties(){return{_theme:{type:String,readOnly:!0}}}static get observedAttributes(){return[...super.observedAttributes,"theme"]}attributeChangedCallback(e,r,n){super.attributeChangedCallback(e,r,n),e==="theme"&&this._set_theme(n)}}});function uo(i){return i&&Object.prototype.hasOwnProperty.call(i,"__themes")}function po(i,t){return(i||"").split(" ").some(e=>new RegExp(`^${e.split("*").join(".*")}$`,"u").test(t))}function fo(i){return i.map(t=>t.cssText).join(`
`)}function vo(i,t){let e=document.createElement("style");e.id=mo,e.textContent=fo(i),t.content.appendChild(e)}function go(i=""){let t=0;return i.startsWith("lumo-")||i.startsWith("material-")?t=1:i.startsWith("vaadin-")&&(t=2),t}function kr(i){let t=[];return i.include&&[].concat(i.include).forEach(e=>{let r=Re.find(n=>n.moduleId===e);r?t.push(...kr(r),...r.styles):console.warn(`Included moduleId ${e} not found in style registry`)},i.styles),t}function bo(i){let t=`${i}-default-theme`,e=Re.filter(r=>r.moduleId!==t&&po(r.themeFor,i)).map(r=>({...r,styles:[...kr(r),...r.styles],includePriority:go(r.moduleId)})).sort((r,n)=>n.includePriority-r.includePriority);return e.length>0?e:Re.filter(r=>r.moduleId===t)}var Re,co,ho,mo,Dt,Fe=l(()=>{"use strict";b();Ne();Cr();Re=[],co=new Set,ho=new Set;mo="vaadin-themable-mixin-style";Dt=i=>class extends wr(i){constructor(){super(),co.add(new WeakRef(this))}static finalize(){if(super.finalize(),this.is&&ho.add(this.is),this.elementStyles)return;let e=this.prototype._template;!e||uo(this)||vo(this.getStylesForThis(),e)}static finalizeStyles(e){return this.baseStyles=e?[e].flat(1/0):[],this.themeStyles=this.getStylesForThis(),[...this.baseStyles,...this.themeStyles]}static getStylesForThis(){let e=i.__themes||[],r=Object.getPrototypeOf(this.prototype),n=(r?r.constructor.__themes:[])||[];this.__themes=[...e,...n,...bo(this.is)];let o=this.__themes.flatMap(s=>s.styles);return o.filter((s,d)=>d===o.lastIndexOf(s))}}});var Sr,Er=l(()=>{"use strict";q();b();Sr=m`
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
`});function We(i){return wo.indexOf(i)>-1}function So(i){if(!(We(i)||i==="touchend")&&qe&&Ir&&_o)return{passive:!0}}function K(i){let t=i.type;if(!We(t))return!1;if(t==="mousemove"){let r=i.buttons??1;return i instanceof window.MouseEvent&&!ko&&(r=Co[i.which]||0),!!(r&1)}return(i.button??0)===0}function Mo(i){if(i.type==="click"){if(i.detail===0)return!0;let t=j(i);if(!t.nodeType||t.nodeType!==Node.ELEMENT_NODE)return!0;let e=t.getBoundingClientRect(),r=i.pageX,n=i.pageY;return!(r>=e.left&&r<=e.right&&n>=e.top&&n<=e.bottom)}return!1}function $o(i){let t="auto",e=Or(i);for(let r=0,n;r<e.length;r++)if(n=e[r],n[He]){t=n[He];break}return t}function Nr(i,t,e){i.movefn=t,i.upfn=e,document.addEventListener("mousemove",t),document.addEventListener("mouseup",e)}function it(i){document.removeEventListener("mousemove",i.movefn),document.removeEventListener("mouseup",i.upfn),i.movefn=null,i.upfn=null}function To(i,t){let e=document.elementFromPoint(i,t),r=e;for(;r?.shadowRoot&&!window.ShadyDOM;){let n=r;if(r=r.shadowRoot.elementFromPoint(i,t),n===r)break;r&&(e=r)}return e}function j(i){let t=Or(i);return t.length>0?t[0]:i.target}function Io(i){let t=i.type,r=i.currentTarget[Ue];if(!r)return;let n=r[t];if(!n)return;if(!i[ze]&&(i[ze]={},t.startsWith("touch"))){let s=i.changedTouches[0];if(t==="touchstart"&&i.touches.length===1&&(M.touch.id=s.identifier),M.touch.id!==s.identifier)return;qe||(t==="touchstart"||t==="touchmove")&&No(i)}let o=i[ze];if(!o.skip){for(let s=0,d;s<W.length;s++)d=W[s],n[d.name]&&!o[d.name]&&d.flow&&d.flow.start.indexOf(i.type)>-1&&d.reset&&d.reset();for(let s=0,d;s<W.length;s++)d=W[s],n[d.name]&&!o[d.name]&&(o[d.name]=!0,d[t](i))}}function No(i){let t=i.changedTouches[0],e=i.type;if(e==="touchstart")M.touch.x=t.clientX,M.touch.y=t.clientY,M.touch.scrollDecided=!1;else if(e==="touchmove"){if(M.touch.scrollDecided)return;M.touch.scrollDecided=!0;let r=$o(i),n=!1,o=Math.abs(M.touch.x-t.clientX),s=Math.abs(M.touch.y-t.clientY);i.cancelable&&(r==="none"?n=!0:r==="pan-x"?n=s>o:r==="pan-y"&&(n=o>s)),n?i.preventDefault():Bt("track")}}function Ye(i,t,e){return Ke[t]?(Oo(i,t,e),!0):!1}function Oo(i,t,e){let r=Ke[t],n=r.deps,o=r.name,s=i[Ue];s||(i[Ue]=s={});for(let d=0,a,c;d<n.length;d++)a=n[d],!(Eo&&We(a)&&a!=="click")&&(c=s[a],c||(s[a]=c={_count:0}),c._count===0&&i.addEventListener(a,Io,So(a)),c[o]=(c[o]||0)+1,c._count=(c._count||0)+1);i.addEventListener(t,e),r.touchAction&&Lo(i,r.touchAction)}function Ze(i){W.push(i),i.emits.forEach(t=>{Ke[t]=i})}function Po(i){for(let t=0,e;t<W.length;t++){e=W[t];for(let r=0,n;r<e.emits.length;r++)if(n=e.emits[r],n===i)return e}return null}function Lo(i,t){qe&&i instanceof HTMLElement&&zi.run(()=>{i.style.touchAction=t}),i[He]=t}function Ge(i,t,e){let r=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(r.detail=e,xo(i).dispatchEvent(r),r.defaultPrevented){let n=e.preventer||e.sourceEvent;n?.preventDefault&&n.preventDefault()}}function Bt(i){let t=Po(i);t.info&&(t.info.prevent=!0)}function vt(i,t,e,r){t&&Ge(t,i,{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:r,prevent(n){return Bt(n)}})}function $r(i,t,e){if(i.prevent)return!1;if(i.started)return!0;let r=Math.abs(i.x-t),n=Math.abs(i.y-e);return r>=Mr||n>=Mr}function Ve(i,t,e){if(!t)return;let r=i.moves[i.moves.length-2],n=i.moves[i.moves.length-1],o=n.x-i.x,s=n.y-i.y,d,a=0;r&&(d=n.x-r.x,a=n.y-r.y),Ge(t,"track",{state:i.state,x:e.clientX,y:e.clientY,dx:o,dy:s,ddx:d,ddy:a,sourceEvent:e,hover(){return To(e.clientX,e.clientY)}})}function Tr(i,t,e){let r=Math.abs(t.clientX-i.x),n=Math.abs(t.clientY-i.y),o=j(e||t);!o||Ao[o.localName]&&o.hasAttribute("disabled")||(isNaN(r)||isNaN(n)||r<=Ar&&n<=Ar||Mo(t))&&(i.prevent||Ge(o,"tap",{x:t.clientX,y:t.clientY,sourceEvent:t,preventer:e}))}var _o,xo,qe,Ue,ze,He,Ar,Mr,yo,wo,Co,ko,Ir,Eo,Ao,M,Or,Ke,W,Pr=l(()=>{"use strict";Mt();_o=!1,xo=i=>i,qe=typeof document.head.style.touchAction=="string",Ue="__polymerGestures",ze="__polymerGesturesHandled",He="__polymerGesturesTouchAction",Ar=25,Mr=5,yo=2,wo=["mousedown","mousemove","mouseup","click"],Co=[0,1,4,2],ko=(function(){try{return new MouseEvent("test",{buttons:1}).buttons===1}catch{return!1}})();Ir=!1;(function(){try{let i=Object.defineProperty({},"passive",{get(){Ir=!0}});window.addEventListener("test",null,i),window.removeEventListener("test",null,i)}catch{}})();Eo=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u),Ao={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};M={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};Or=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:i=>i.composedPath&&i.composedPath()||[],Ke={},W=[];Ze({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){it(this.info)},mousedown(i){if(!K(i))return;let t=j(i),e=this,r=o=>{K(o)||(vt("up",t,o),it(e.info))},n=o=>{K(o)&&vt("up",t,o),it(e.info)};Nr(this.info,r,n),vt("down",t,i)},touchstart(i){vt("down",j(i),i.changedTouches[0],i)},touchend(i){vt("up",j(i),i.changedTouches[0],i)}});Ze({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(i){this.moves.length>yo&&this.moves.shift(),this.moves.push(i)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,it(this.info)},mousedown(i){if(!K(i))return;let t=j(i),e=this,r=o=>{let s=o.clientX,d=o.clientY;$r(e.info,s,d)&&(e.info.state=e.info.started?o.type==="mouseup"?"end":"track":"start",e.info.state==="start"&&Bt("tap"),e.info.addMove({x:s,y:d}),K(o)||(e.info.state="end",it(e.info)),t&&Ve(e.info,t,o),e.info.started=!0)},n=o=>{e.info.started&&r(o),it(e.info)};Nr(this.info,r,n),this.info.x=i.clientX,this.info.y=i.clientY},touchstart(i){let t=i.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchmove(i){let t=j(i),e=i.changedTouches[0],r=e.clientX,n=e.clientY;$r(this.info,r,n)&&(this.info.state==="start"&&Bt("tap"),this.info.addMove({x:r,y:n}),Ve(this.info,t,e),this.info.state="track",this.info.started=!0)},touchend(i){let t=j(i),e=i.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:e.clientX,y:e.clientY}),Ve(this.info,t,e))}});Ze({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(i){K(i)&&(this.info.x=i.clientX,this.info.y=i.clientY)},click(i){K(i)&&Tr(this.info,i)},touchstart(i){let t=i.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchend(i){Tr(this.info,i.changedTouches[0],i)}})});var Do,Lr,Dr=l(()=>{"use strict";C();Do=i=>class extends i{ready(){super.ready(),this.addEventListener("keydown",e=>{this._onKeyDown(e)}),this.addEventListener("keyup",e=>{this._onKeyUp(e)})}_onKeyDown(e){switch(e.key){case"Enter":this._onEnter(e);break;case"Escape":this._onEscape(e);break;default:break}}_onKeyUp(e){}_onEnter(e){}_onEscape(e){}},Lr=v(Do)});var jt,Xe=l(()=>{"use strict";Pr();ct();Dr();jt=i=>class extends N(Lr(i)){get _activeKeys(){return[" "]}ready(){super.ready(),Ye(this,"down",e=>{this._shouldSetActive(e)&&this._setActive(!0)}),Ye(this,"up",()=>{this._setActive(!1)})}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(e){return!this.disabled}_onKeyDown(e){super._onKeyDown(e),this._shouldSetActive(e)&&this._activeKeys.includes(e.key)&&(this._setActive(!0),document.addEventListener("keyup",r=>{this._activeKeys.includes(r.key)&&this._setActive(!1)},{once:!0}))}_setActive(e){this.toggleAttribute("active",e)}}});var Rt,Je=l(()=>{"use strict";ct();Rt=i=>class extends N(i){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged",sync:!0},_lastTabIndex:{type:Number}}}_disabledChanged(e,r){super._disabledChanged(e,r),!this.__shouldAllowFocusWhenDisabled()&&(e?(this.tabindex!==void 0&&(this._lastTabIndex=this.tabindex),this.setAttribute("tabindex","-1")):r&&(this._lastTabIndex!==void 0?this.setAttribute("tabindex",this._lastTabIndex):this.tabindex=void 0))}_tabindexChanged(e){this.__shouldAllowFocusWhenDisabled()||this.disabled&&e!==-1&&(this._lastTabIndex=e,this.setAttribute("tabindex","-1"))}focus(e){(!this.disabled||this.__shouldAllowFocusWhenDisabled())&&super.focus(e)}__shouldAllowFocusWhenDisabled(){return!1}}});var Bo,Br,jr=l(()=>{"use strict";Xe();Et();Je();Bo=["mousedown","mouseup","click","dblclick","keypress","keydown","keyup"],Br=i=>class extends jt(Rt(X(i))){constructor(){super(),this.__onInteractionEvent=this.__onInteractionEvent.bind(this),Bo.forEach(e=>{this.addEventListener(e,this.__onInteractionEvent,!0)}),this.tabindex=0}get _activeKeys(){return["Enter"," "]}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","button"),this.__shouldAllowFocusWhenDisabled()&&this.style.setProperty("--_vaadin-button-disabled-pointer-events","auto")}_onKeyDown(e){super._onKeyDown(e),!(e.altKey||e.shiftKey||e.ctrlKey||e.metaKey)&&this._activeKeys.includes(e.key)&&(e.preventDefault(),this.click())}__onInteractionEvent(e){this.__shouldSuppressInteractionEvent(e)&&e.stopImmediatePropagation()}__shouldSuppressInteractionEvent(e){return this.disabled}}});var Ft,Qe=l(()=>{"use strict";b();ht();ut();pt();je();ft();Fe();Er();jr();Ft=class extends Br(P(Dt(L(D(g))))){static get is(){return"vaadin-button"}static get styles(){return Sr}static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}render(){return _`
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
    `}ready(){super.ready(),this._tooltipController=new et(this),this.addController(this._tooltipController)}__shouldAllowFocusWhenDisabled(){return window.Vaadin.featureFlags.accessibleDisabledButtons}};O(Ft)});var Rr={};Qt(Rr,{Button:()=>Ft});var Fr=l(()=>{"use strict";Qe();Qe()});var zr,Vr=l(()=>{"use strict";q();b();zr=(i,t=i)=>m`
  :host {
    align-items: baseline;
    column-gap: var(--vaadin-${h(t)}-gap, var(--vaadin-gap-s));
    grid-template: none;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(auto-fill, minmax(0, max-content));
    -webkit-tap-highlight-color: transparent;
    --_cursor: var(--vaadin-clickable-cursor);
    --_marker-color: var(--vaadin-${h(t)}-marker-color, var(--vaadin-${h(t)}-background, var(--vaadin-background-color)));
    --_marker-filter: var(--vaadin-${h(t)}-marker-color, saturate(0) invert(1) hue-rotate(180deg) contrast(100) brightness(100));
  }

  :host(:not([has-label])) {
    column-gap: 0;
  }

  :host([data-form-layout-has-labels-aside]) {
    padding-inline-start: calc(var(--vaadin-form-layout-label-width) + var(--vaadin-form-layout-label-spacing));
  }

  [part='${h(i)}'],
  ::slotted(input),
  [part='label'],
  ::slotted(label) {
    grid-row: 1;
  }

  [part='label'],
  ::slotted(label) {
    font-size: var(--vaadin-${h(t)}-label-font-size, var(--vaadin-input-field-label-font-size, inherit));
    line-height: var(--vaadin-${h(t)}-label-line-height, var(--vaadin-input-field-label-line-height, inherit));
    font-weight: var(--vaadin-${h(t)}-label-font-weight, var(--vaadin-input-field-label-font-weight, 500));
    color: var(--vaadin-${h(t)}-label-color, var(--vaadin-input-field-label-color, var(--vaadin-text-color)));
    word-break: break-word;
    cursor: var(--_cursor);
  }

  [part='${h(i)}'],
  ::slotted(input) {
    grid-column: 1;
  }

  [part='label'],
  [part='helper-text'],
  [part='error-message'] {
    margin-bottom: 0;
    grid-column: 2;
    width: auto;
    min-width: auto;
  }

  [part='helper-text'],
  [part='error-message'] {
    margin-top: var(--_gap-s);
    grid-row: auto;
  }

  /* Baseline vertical alignment */
  :host::before {
    grid-row: 1;
    grid-column: 1;
    margin: 0;
    padding: 0;
    border: 0;
    height: auto;
  }

  /* visually hidden */
  ::slotted(input) {
    cursor: inherit;
    align-self: stretch;
    appearance: none;
    cursor: var(--_cursor);
    /* Override 16px from iOS UA stylesheet and CSS resets */
    width: auto !important;
    height: auto !important;
    /* Ensure minimum click target (WCAG) */
    margin: min(0px, (24px - 100%) / -2) !important;
    /* Extend the input to cover the gap between the checkbox/radio and label */
    margin-inline-end: calc(min(0px, (24px - 100%) / -2) - var(--vaadin-${h(t)}-gap, var(--vaadin-gap-s))) !important;
  }

  /* Control container (checkbox, radio button) */
  [part='${h(i)}'] {
    background: var(--vaadin-${h(t)}-background, var(--vaadin-background-color));
    border-color: var(--vaadin-${h(t)}-border-color, var(--vaadin-input-field-border-color, var(--vaadin-border-color)));
    border-radius: var(--vaadin-${h(t)}-border-radius, var(--vaadin-radius-s));
    border-style: var(--_border-style, solid);
    --_border-width: var(--vaadin-${h(t)}-border-width, var(--vaadin-input-field-border-width, 1px));
    border-width: var(--_border-width);
    box-sizing: border-box;
    color: var(--_marker-color);
    height: var(--vaadin-${h(t)}-size, round(1.125em, 2px));
    width: var(--vaadin-${h(t)}-size, round(1.125em, 2px));
    position: relative;
    cursor: var(--_cursor);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host(:is([checked], [indeterminate])) {
    --vaadin-${h(t)}-background: var(--vaadin-text-color);
    --vaadin-${h(t)}-border-color: transparent;
  }

  :host([readonly]) {
    --vaadin-${h(i)}-background: transparent;
    --vaadin-${h(i)}-border-color: var(--vaadin-border-color);
    --vaadin-${h(i)}-marker-color: var(--vaadin-text-color);
    --_border-style: dashed;
    --_cursor: var(--vaadin-disabled-cursor);

    [part='label'],
    ::slotted(label) {
      cursor: default;
    }
  }

  :host([disabled]) {
    --vaadin-${h(t)}-background: var(--vaadin-input-field-disabled-background, var(--vaadin-background-container-strong));
    --vaadin-${h(t)}-border-color: transparent;
    --vaadin-${h(t)}-marker-color: var(--vaadin-text-color-disabled);
    --_cursor: var(--vaadin-disabled-cursor);
  }

  /* Focus ring */
  :host([focus-ring]) [part='${h(i)}'] {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--_border-width) * -1);
  }

  :host([focus-ring]:is([checked], [indeterminate])) [part='${h(i)}'] {
    outline-offset: 1px;
  }

  :host([readonly][focus-ring]) [part='${h(i)}'] {
    --vaadin-${h(t)}-border-color: transparent;
    outline-offset: calc(var(--_border-width) * -1);
    outline-style: dashed;
  }

  /* Checked indicator (checkmark, dot) */
  [part='${h(i)}']::after {
    content: '\\2003' / '';
    background: currentColor;
    border-radius: inherit;
    display: flex;
    align-items: center;
    filter: var(--_marker-filter);
  }

  :host(:not([checked], [indeterminate])) [part='${h(i)}']::after {
    opacity: 0;
  }

  /* Reverse variant */
  :host([theme~='reverse']) {
    grid-template-columns: 1fr auto;

    &::before {
      display: none;
    }

    [part='label'],
    [part='helper-text'],
    [part='error-message'] {
      grid-column: 1;
    }

    [part='${h(i)}'],
    ::slotted(input) {
      grid-column: 2;
    }

    ::slotted(input) {
      margin-inline: calc(min(0px, (24px - 100%) / -2) - var(--vaadin-${h(t)}-gap, var(--vaadin-gap-s))) 0 !important;
    }
  }

  @media (forced-colors: active) {
    :host(:is([checked], [indeterminate])) {
      --vaadin-${h(t)}-border-color: CanvasText !important;
    }

    :host(:is([checked], [indeterminate])) [part='${h(i)}'] {
      background: SelectedItem !important;
    }

    :host(:is([checked], [indeterminate])) [part='${h(i)}']::after {
      background: SelectedItemText !important;
    }

    :host([readonly]) [part='${h(i)}']::after {
      background: CanvasText !important;
    }

    :host([disabled]) {
      --vaadin-${h(t)}-border-color: GrayText !important;
    }

    :host([disabled]) [part='${h(i)}']::after {
      background: GrayText !important;
    }
  }
`});var Ur,Yl,Zl,Hr=l(()=>{"use strict";q();b();Ur=m`
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
`,Yl=m`
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
`,Zl=m`
  :host {
    --_field-input-height: max(var(--vaadin-input-field-height, 0px), var(--_field-input-default-height));
  }
`});var jo,qr,Wr=l(()=>{"use strict";q();b();Vr();Hr();jo=m`
  [part='checkbox'] {
    color: var(--vaadin-checkbox-checkmark-color, var(--_marker-color));
  }

  [part='checkbox']::after {
    inset: 0;
    mask: var(--_vaadin-icon-checkmark) 50% /
      var(--vaadin-checkbox-checkmark-size, var(--vaadin-checkbox-marker-size, 100%)) no-repeat;
    filter: var(--vaadin-checkbox-checkmark-color, var(--_marker-filter));
  }

  :host([indeterminate]) [part='checkbox']::after {
    mask-image: var(--_vaadin-icon-minus);
  }
`,qr=[Ur,zr("checkbox"),jo]});var Ro,Kr,Yr=l(()=>{"use strict";C();Et();be();Je();Ro=i=>class extends X(Rt(i)){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged",sync:!0},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame(()=>{this.focus()})}focus(e){if(this.focusElement&&!this.disabled){if(this.focusElement.focus({preventScroll:!!e?.preventScroll}),!$i(this.focusElement))return;e?.focusVisible!==!1&&this.setAttribute("focus-ring","")}}blur(){this.focusElement&&this.focusElement.blur()}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(e,r){e?(e.disabled=this.disabled,this._addFocusListeners(e),this.__forwardTabIndex(this.tabindex)):r&&this._removeFocusListeners(r)}_addFocusListeners(e){e.addEventListener("blur",this._boundOnBlur),e.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(e){e.removeEventListener("blur",this._boundOnBlur),e.removeEventListener("focus",this._boundOnFocus)}_onFocus(e){e.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(e){e.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(e){return e.target===this.focusElement}_shouldRemoveFocus(e){return e.target===this.focusElement}_disabledChanged(e,r){super._disabledChanged(e,r),this.focusElement&&(this.focusElement.disabled=e),e&&this.blur()}_tabindexChanged(e){this.__forwardTabIndex(e)}__forwardTabIndex(e){e!==void 0&&this.focusElement&&(this.focusElement.tabIndex=e,e!==-1&&(this.tabindex=void 0)),this.disabled&&e&&(e!==-1&&(this._lastTabIndex=e),this.tabindex=void 0),e===void 0&&this.hasAttribute("tabindex")&&this.removeAttribute("tabindex")}},Kr=v(Ro)});function Fo(i){return ti.has(i)||ti.set(i,new Set),ti.get(i)}function zo(i,t){let e=document.createElement("style");e.textContent=i,t===document?document.head.appendChild(e):t.insertBefore(e,t.firstChild)}var ti,Vo,Zr,Gr=l(()=>{"use strict";C();ti=new WeakMap;Vo=i=>class extends i{get slotStyles(){return[]}connectedCallback(){super.connectedCallback(),this.__applySlotStyles()}__applySlotStyles(){let e=this.getRootNode(),r=Fo(e);this.slotStyles.forEach(n=>{r.has(n)||(zo(n,e),r.add(n))})}},Zr=v(Vo)});var Uo,Xr,Jr=l(()=>{"use strict";C();H();Uo=i=>class extends i{static get properties(){return{stateTarget:{type:Object,observer:"_stateTargetChanged"}}}static get delegateAttrs(){return[]}static get delegateProps(){return[]}ready(){super.ready(),this._createDelegateAttrsObserver(),this._createDelegatePropsObserver()}_stateTargetChanged(e){e&&(this._ensureAttrsDelegated(),this._ensurePropsDelegated())}_createDelegateAttrsObserver(){this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`)}_createDelegatePropsObserver(){this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`)}_ensureAttrsDelegated(){this.constructor.delegateAttrs.forEach(e=>{this._delegateAttribute(e,this[e])})}_ensurePropsDelegated(){this.constructor.delegateProps.forEach(e=>{this._delegateProperty(e,this[e])})}_delegateAttrsChanged(...e){this.constructor.delegateAttrs.forEach((r,n)=>{this._delegateAttribute(r,e[n])})}_delegatePropsChanged(...e){this.constructor.delegateProps.forEach((r,n)=>{this._delegateProperty(r,e[n])})}_delegateAttribute(e,r){this.stateTarget&&(e==="invalid"&&this._delegateAttribute("aria-invalid",r?"true":!1),typeof r=="boolean"?this.stateTarget.toggleAttribute(e,r):y(this.stateTarget,e,r))}_delegateProperty(e,r){this.stateTarget&&(this.stateTarget[e]=r)}},Xr=v(Uo)});var Ho,Qr,tn=l(()=>{"use strict";C();Ho=i=>class extends i{static get properties(){return{inputElement:{type:Object,readOnly:!0,observer:"_inputElementChanged",sync:!0},type:{type:String,readOnly:!0},value:{type:String,value:"",observer:"_valueChanged",notify:!0,sync:!0}}}constructor(){super(),this._boundOnInput=this._onInput.bind(this),this._boundOnChange=this._onChange.bind(this)}get _hasValue(){return this.value!=null&&this.value!==""}get _inputElementValueProperty(){return"value"}get _inputElementValue(){return this.inputElement?this.inputElement[this._inputElementValueProperty]:void 0}set _inputElementValue(e){this.inputElement&&(this.inputElement[this._inputElementValueProperty]=e)}clear(){this.value="",this._inputElementValue=""}_addInputListeners(e){e.addEventListener("input",this._boundOnInput),e.addEventListener("change",this._boundOnChange)}_removeInputListeners(e){e.removeEventListener("input",this._boundOnInput),e.removeEventListener("change",this._boundOnChange)}_forwardInputValue(e){this.inputElement&&(this._inputElementValue=e??"")}_inputElementChanged(e,r){e?this._addInputListeners(e):r&&this._removeInputListeners(r)}_onInput(e){let r=e.composedPath()[0];this.__userInput=e.isTrusted,this.value=r.value,this.__userInput=!1}_onChange(e){}_toggleHasValue(e){this.toggleAttribute("has-value",e)}_valueChanged(e,r){this._toggleHasValue(this._hasValue),!(e===""&&r===void 0)&&(this.__userInput||this._forwardInputValue(e))}},Qr=v(Ho)});var en,rn=l(()=>{"use strict";ct();Jr();tn();en=i=>class extends Xr(N(Qr(i))){static get properties(){return{checked:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0,sync:!0}}}static get delegateProps(){return[...super.delegateProps,"checked"]}_onChange(e){let r=e.target;this._toggleChecked(r.checked)}_toggleChecked(e){this.checked=e}}});var zt,nn=l(()=>{"use strict";H();zt=class{#t;#e=!1;#i;#r;#o;#n;#s;#l=[];#d=[];constructor(t){this.host=t}setTarget(t){this.#t=t,this.#c(),this.#h(),this.#a(),this.#u()}setRequired(t){this.#e=t,this.#u()}setLabel(t){this.#i=t,this.#c()}setLabelledBy(t){this.#r=t,this.#h()}setDescribedBy(t){this.#o=t,this.#a()}setErrorId(t){this.#n=t,this.#a()}setHelperId(t){this.#s=t,this.#a()}#c(){this.#t&&y(this.#t,"aria-label",this.#i)}#h(){this.#t&&(ve(this.#t,"aria-labelledby",this.#l),this.#l=[this.#r],me(this.#t,"aria-labelledby",this.#l))}#a(){this.#t&&(ve(this.#t,"aria-describedby",this.#d),this.#d=[this.#o,this.#s,this.#n],me(this.#t,"aria-describedby",this.#d))}#u(){this.#t&&(["input","textarea"].includes(this.#t.localName)||y(this.#t,"aria-required",this.#e))}}});function on(i,t={}){let e=t.mode||"polite",r=t.timeout??150;e==="alert"?(w.removeAttribute("aria-live"),w.removeAttribute("role"),Vt=Q.debounce(Vt,Ri,()=>{w.setAttribute("role","alert")})):(Vt&&Vt.cancel(),w.removeAttribute("role"),w.setAttribute("aria-live",e)),w.textContent="",setTimeout(()=>{w.textContent=i},r)}var w,Vt,sn=l(()=>{"use strict";Mt();we();w=document.createElement("div");w.style.position="fixed";w.style.clip="rect(0px, 0px, 0px, 0px)";w.setAttribute("aria-live","polite");document.body.appendChild(w)});var R,Ut=l(()=>{"use strict";H();Lt();R=class extends B{#t;constructor(t,e,r,n={}){super(t,e,r,{...n,useUniqueId:!0})}initCustomNode(t){this.#e(t),this._notifyChange(t)}teardownNode(t){let e=this.getSlotChild();e&&e!==this.defaultNode?this._notifyChange(e):(this.restoreDefaultNode(),this.updateDefaultNode(this.node))}attachDefaultNode(){let t=super.attachDefaultNode();return t&&this.#e(t),t}restoreDefaultNode(){}updateDefaultNode(t){this._notifyChange(t)}observeNode(t){this.#t&&this.#t.disconnect(),this.#t=new MutationObserver(e=>{e.forEach(r=>{let n=r.target,o=n===this.node;r.type==="attributes"?o&&this.#e(n):(o||n.parentElement===this.node)&&this._notifyChange(this.node)})}),this.#t.observe(t,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}_notifyChange(t){this.dispatchEvent(new CustomEvent("slot-content-changed",{detail:{hasContent:Ai(t),node:t}}))}#e(t){let e=!this.nodes||t===this.nodes[0];t.nodeType===Node.ELEMENT_NODE&&(!this.multiple||e)&&!t.id&&(t.id=this.defaultId)}}});var Ht,an=l(()=>{"use strict";sn();Ut();Ht=class extends R{constructor(t){super(t,"error-message","div")}setErrorMessage(t){this.errorMessage=t,this.updateDefaultNode(this.node)}setInvalid(t){this.invalid=t,this.updateDefaultNode(this.node)}initAddedNode(t){t!==this.defaultNode&&this.initCustomNode(t)}initNode(t){this.updateDefaultNode(t)}initCustomNode(t){t.textContent&&!this.errorMessage&&(this.errorMessage=t.textContent.trim()),super.initCustomNode(t)}restoreDefaultNode(){this.attachDefaultNode()}updateDefaultNode(t){let{errorMessage:e,invalid:r}=this,n=!!(r&&e&&e.trim()!=="");t&&(t.textContent=n?e:"",t.hidden=!n,n&&on(e,{mode:"assertive"})),super.updateDefaultNode(t)}}});var qt,ln=l(()=>{"use strict";Ut();qt=class extends R{constructor(t){super(t,"helper",null)}setHelperText(t){this.helperText=t,this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){let{helperText:t}=this;if(t&&t.trim()!==""){this.tagName="div";let e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(t){t&&(t.textContent=this.helperText),super.updateDefaultNode(t)}initCustomNode(t){super.initCustomNode(t),this.observeNode(t)}}});var Wt,dn=l(()=>{"use strict";Ut();Wt=class extends R{constructor(t){super(t,"label","label")}setLabel(t){this.label=t,this.getSlotChild()||this.restoreDefaultNode(),this.node===this.defaultNode&&this.updateDefaultNode(this.node)}restoreDefaultNode(){let{label:t}=this;if(t&&t.trim()!==""){let e=this.attachDefaultNode();this.observeNode(e)}}updateDefaultNode(t){t&&(t.textContent=this.label),super.updateDefaultNode(t)}initCustomNode(t){super.initCustomNode(t),this.observeNode(t)}}});var cn,hn=l(()=>{"use strict";dn();cn=i=>class extends i{static get properties(){return{label:{type:String,observer:"_labelChanged"}}}constructor(){super(),this._labelController=new Wt(this),this._labelController.addEventListener("slot-content-changed",e=>{this.toggleAttribute("has-label",e.detail.hasContent)})}get _labelId(){return this._labelNode?.id}get _labelNode(){return this._labelController.node}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(e){this._labelController.setLabel(e)}}});var qo,un,pn=l(()=>{"use strict";C();qo=i=>class extends i{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1,sync:!0},manualValidation:{type:Boolean,value:!1},required:{type:Boolean,reflectToAttribute:!0,sync:!0}}}validate(){let t=this.checkValidity();return this._setInvalid(!t),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:t}})),t}checkValidity(){return!this.required||!!this.value}_setInvalid(t){this._shouldSetInvalid(t)&&(this.invalid=t)}_shouldSetInvalid(t){return!0}_requestValidation(){this.manualValidation||this.validate()}},un=v(qo)});var fn,mn=l(()=>{"use strict";nn();an();ln();hn();pn();fn=i=>class extends un(cn(i)){static get properties(){return{ariaTarget:{type:Object},errorMessage:{type:String},helperText:{type:String},accessibleName:{type:String},accessibleNameRef:{type:String},accessibleDescriptionRef:{type:String}}}constructor(){super(),this._labelController.addEventListener("slot-content-changed",e=>{this.#t(e)}),this._helperController=new qt(this),this._helperController.addEventListener("slot-content-changed",e=>{this.#e(e)}),this._errorController=new Ht(this),this._errorController.addEventListener("slot-content-changed",e=>{this.#i(e)}),this._fieldAriaController=new zt(this)}get _errorNode(){return this._errorController.node}get _helperNode(){return this._helperController.node}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}updated(e){super.updated(e),e.has("invalid")&&this._errorController.setInvalid(this.invalid),e.has("errorMessage")&&this._errorController.setErrorMessage(this.errorMessage),e.has("helperText")&&this._helperController.setHelperText(this.helperText),e.has("ariaTarget")&&this._fieldAriaController.setTarget(this.ariaTarget),e.has("required")&&this._fieldAriaController.setRequired(this.required),e.has("accessibleName")&&this.__updateFieldAriaControllerLabel(),(e.has("accessibleName")||e.has("accessibleNameRef"))&&this.__updateFieldAriaControllerLabelledBy(),e.has("accessibleDescriptionRef")&&this.__updateFieldAriaControllerDescribedBy()}__updateFieldAriaControllerLabel(){this._fieldAriaController.setLabel(this.accessibleName)}__updateFieldAriaControllerLabelledBy(){let e=null;this.accessibleNameRef?e=this.accessibleNameRef:this.hasAttribute("has-label")&&!this.accessibleName&&(e=this._labelNode?.id),this._fieldAriaController.setLabelledBy(e)}__updateFieldAriaControllerDescribedBy(){this._fieldAriaController.setDescribedBy(this.accessibleDescriptionRef)}#t(e){this.__updateFieldAriaControllerLabelledBy()}#e(e){let{hasContent:r}=e.detail;this.toggleAttribute("has-helper",r),r?this._fieldAriaController.setHelperId(this._helperNode?.id):this._fieldAriaController.setHelperId(null)}#i(e){this.toggleAttribute("has-error-message",e.detail.hasContent),setTimeout(()=>{this.invalid?this._fieldAriaController.setErrorId(this._errorNode?.id):this._fieldAriaController.setErrorId(null)})}}});var Kt,vn=l(()=>{"use strict";Lt();Kt=class extends B{constructor(t,e,r={}){let{uniqueIdPrefix:n}=r;super(t,"input","input",{initializer:(o,s)=>{s.value&&(o.value=s.value),s.type&&o.setAttribute("type",s.type),o.id=this.defaultId,typeof e=="function"&&e(o)},useUniqueId:!0,uniqueIdPrefix:n})}}});var Yt,gn=l(()=>{"use strict";Yt=class{constructor(t,e){this.input=t,e.addEventListener("slot-content-changed",r=>{this.#t(r.detail.node)}),this.#t(e.node)}#t(t){t&&(t.addEventListener("click",this.#e),this.input&&t.setAttribute("for",this.input.id))}#e=()=>{let t=e=>{e.stopImmediatePropagation(),this.input.removeEventListener("click",t)};this.input.addEventListener("click",t)}}});var bn,_n=l(()=>{"use strict";Xe();Yr();H();Gr();rn();mn();vn();gn();bn=i=>class extends Zr(fn(en(Kr(jt(i))))){static get properties(){return{name:{type:String,value:""},readonly:{type:Boolean,value:!1,reflectToAttribute:!0}}}static get observers(){return["__readonlyChanged(readonly, inputElement)"]}static get delegateAttrs(){return[...super.delegateAttrs,"name","invalid","required"]}constructor(){super(),this._setType("checkbox"),this._boundOnInputClick=this._onInputClick.bind(this),this.value="on",this.tabindex=0}get slotStyles(){return[`
          ${this.localName} > input[slot='input'] {
            opacity: 0;
          }
        `]}ready(){super.ready(),this.addController(new Kt(this,e=>{this._setInputElement(e),this._setFocusElement(e),this.stateTarget=e,this.ariaTarget=e})),this.addController(new Yt(this.inputElement,this._labelController)),this._createPropertyObserver("checked","_checkedChanged")}updated(e){super.updated(e),e.has("required")&&this.required===!1&&this._requestValidation()}_shouldSetActive(e){let[r]=e.composedPath(),n=r===this.inputElement||r.part.contains("required-indicator")||this._labelNode.contains(r)&&!r.closest("a");return this.readonly||!n?!1:super._shouldSetActive(e)}_addInputListeners(e){super._addInputListeners(e),e.addEventListener("click",this._boundOnInputClick)}_removeInputListeners(e){super._removeInputListeners(e),e.removeEventListener("click",this._boundOnInputClick)}_onInputClick(e){this.readonly&&e.preventDefault()}__readonlyChanged(e,r){r&&y(r,"aria-readonly",e)}checkValidity(){return!this.required||!!this.checked}_setFocused(e){super._setFocused(e),!e&&document.hasFocus()&&this._requestValidation()}_checkedChanged(e,r){(e||r)&&this._requestValidation()}_onRequiredIndicatorClick(){this._labelNode.click()}}});var Zt,ei=l(()=>{"use strict";b();ht();ut();pt();je();ft();Fe();Wr();_n();Zt=class extends bn(P(Dt(L(D(g))))){static get is(){return"vaadin-checkbox"}static get styles(){return qr}static get properties(){return{indeterminate:{type:Boolean,notify:!0,value:!1,reflectToAttribute:!0}}}static get delegateProps(){return[...super.delegateProps,"indeterminate"]}render(){return _`
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <div part="label">
          <slot name="label"></slot>
          <div part="required-indicator" @click="${this._onRequiredIndicatorClick}"></div>
        </div>
        <div part="helper-text">
          <slot name="helper"></slot>
        </div>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `}ready(){super.ready(),this._tooltipController=new et(this),this._tooltipController.setAriaTarget(this.inputElement),this.addController(this._tooltipController)}_toggleChecked(t){this.indeterminate&&(this.indeterminate=!1),super._toggleChecked(t)}};O(Zt)});var xn={};Qt(xn,{Checkbox:()=>Zt});var yn=l(()=>{"use strict";ei();ei()});window.Vaadin??={};window.Vaadin.featureFlags??={};window.Vaadin.featureFlags.stepperComponent=!0;await Promise.resolve().then(()=>(_r(),br));await Promise.resolve().then(()=>(Fr(),Rr));await Promise.resolve().then(()=>(yn(),xn));var gt=new URLSearchParams(location.search),[wn="lumo",ii="light"]=(gt.get("theme")||"lumo:light").split(":");document.querySelectorAll("[data-set-theme]").forEach(i=>{i.dataset.setTheme===wn&&i.setAttribute("theme","primary"),i.addEventListener("click",()=>{gt.set("theme",`${i.dataset.setTheme}:${ii}`),location.search=gt.toString()})});var Cn=document.querySelector("#scheme");Cn.textContent=ii==="dark"?"Light mode":"Dark mode";Cn.addEventListener("click",()=>{gt.set("theme",`${wn}:${ii==="dark"?"light":"dark"}`),location.search=gt.toString()});var Gt=document.querySelector("#wizard"),$=[...Gt.querySelectorAll("vaadin-step")],Wo=document.querySelector("#wizard-content"),kn=document.querySelector("#back"),Sn=document.querySelector("#next"),En=document.querySelector("#invalid"),x=0,Xt=0;function An(){$.forEach((i,t)=>{i.current=t===x,i.path=t<=Xt?`#${i.dataset.id}`:null}),En.checked=$[x].invalid,Wo.textContent=`Content of step ${x+1}: ${$[x].firstChild.textContent.trim()}`,kn.disabled=x===0,Sn.textContent=x===$.length-1?"Finish":"Next"}function Jt(i){x=Math.max(0,Math.min(i,$.length-1)),Xt=Math.max(Xt,x),An()}Sn.addEventListener("click",()=>{$[x].completed=!0,Jt(x+1)});kn.addEventListener("click",()=>Jt(x-1));En.addEventListener("checked-changed",i=>{$[x].invalid=i.detail.value});document.querySelector("#vertical").addEventListener("checked-changed",i=>{Gt.orientation=i.detail.value?"vertical":"horizontal",document.querySelector(".wizard").classList.toggle("vertical",i.detail.value)});document.querySelector("#small").addEventListener("checked-changed",i=>{Gt.toggleAttribute("theme",i.detail.value),i.detail.value&&Gt.setAttribute("theme","small")});document.querySelector("#reset").addEventListener("click",()=>{$.forEach(i=>{i.completed=!1,i.invalid=!1}),Xt=0,Jt(0)});window.addEventListener("hashchange",()=>{let i=$.findIndex(t=>`#${t.dataset.id}`===location.hash);i>=0&&Jt(i)});An();document.body.classList.add("resolved");
