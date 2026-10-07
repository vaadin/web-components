import{D as e,a as t}from"./element-mixin-DsE5nz_5.js";
/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const i=document.createElement("div");let o;function r(r,l={}){const n=l.mode||"polite",a=l.timeout??150;"alert"===n?(i.removeAttribute("aria-live"),i.removeAttribute("role"),o=e.debounce(o,t,()=>{i.setAttribute("role","alert")})):(o&&o.cancel(),i.removeAttribute("role"),i.setAttribute("aria-live",n)),i.textContent="",setTimeout(()=>{i.textContent=r},a)}i.style.position="fixed",i.style.clip="rect(0px, 0px, 0px, 0px)",i.setAttribute("aria-live","polite"),document.body.appendChild(i);export{r as a};
