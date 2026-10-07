/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const a=a=>a.test(navigator.userAgent),t=a=>a.test(navigator.platform),o=a(/Android/u),e=a(/Chrome/u)&&/Google Inc/u.test(navigator.vendor);const r=a(/Firefox/u),n=t(/^iPad/u)||t(/^Mac/u)&&navigator.maxTouchPoints>1,s=t(/^iPhone/u)||n,u=a(/^((?!chrome|android).)*safari/iu),i=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(a){return!1}})();export{u as a,e as b,s as c,o as d,r as e,i};
