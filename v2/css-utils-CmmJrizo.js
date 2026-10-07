/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function e(e){try{CSS.registerProperty(e)}catch(t){if(!(t instanceof DOMException&&"InvalidModificationError"===t.name))throw t;console.warn(`The CSS property ${e.name} has already been registered.`)}}const t=(e,...t)=>{const n=document.createElement("style");n.id=e,n.textContent=t.map(e=>e.toString()).join("\n"),document.head.insertAdjacentElement("afterbegin",n)};export{t as a,e as r};
