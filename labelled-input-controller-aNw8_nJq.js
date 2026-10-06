/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class t{constructor(t,e){this.input=t,e.addEventListener("slot-content-changed",t=>{this.#t(t.detail.node)}),this.#t(e.node)}#t(t){t&&(t.addEventListener("click",this.#e),this.input&&t.setAttribute("for",this.input.id))}#e=()=>{const t=e=>{e.stopImmediatePropagation(),this.input.removeEventListener("click",t)};this.input.addEventListener("click",t)}}export{t as L};
