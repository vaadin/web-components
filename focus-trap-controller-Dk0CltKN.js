import{g as e,a as t,i as s}from"./focus-utils-Cdox8WfX.js";
/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const o=[];function n(e){for(let t=o.length-1;t>=0;t--)if(o[t].trapNode?.contains(e))return o[t].trapNode;return null}class l{trapNode=null;constructor(e){this.host=e}get#e(){return e(this.trapNode)}get#t(){const e=this.#e;return e.indexOf(e.filter(t).pop())}hostConnected(){document.addEventListener("keydown",this.#s)}hostDisconnected(){document.removeEventListener("keydown",this.#s)}trapFocus(e){if(this.trapNode=e,0===this.#e.length)throw this.trapNode=null,new Error("The trap node should have at least one focusable descendant or be focusable itself.");o.push(this),-1===this.#t&&this.#e[0].focus({focusVisible:s()})}releaseFocus(){this.trapNode=null,o.pop()}#s=e=>{if(this.trapNode&&this===Array.from(o).pop()&&"Tab"===e.key){if(e.defaultPrevented)return;e.preventDefault();const t=e.shiftKey;this.#o(t)}};#o(e=!1){const t=this.#e,s=e?-1:1,o=this.#t,n=t[(t.length+o+s)%t.length];n.focus({focusVisible:!0}),"input"===n.localName&&n.select()}}export{l as F,n as g};
