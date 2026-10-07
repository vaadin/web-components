/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const t=["__proto__","constructor","prototype"],r=t=>{if(!t||"object"!=typeof t)return!1;const r=Object.getPrototypeOf(t);return r===Object.prototype||null===r};function e(n,o,c){return r(n)&&r(o)?(Object.keys(o).forEach(u=>{if(t.includes(u))return;const f=o[u];if(r(f)){if(!Object.hasOwn(n,u)||!r(n[u])){if(c&&Object.hasOwn(n,u)&&n[u])return;n[u]={}}e(n[u],f,c)}else c&&Array.isArray(f)?n[u]=[...f]:c&&null==f||(n[u]=f)}),n):n}function n(t,r){return e(t,r,!1)}function o(t,...r){return r.forEach(r=>e(t,r,!0)),t}export{n as a,o as d};
