/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class e{#e=null;constructor(e,i){this.query=e,this.callback=i}hostConnected(){this.#i(),this.#e=window.matchMedia(this.query),this.#t(),this.#s(this.#e)}hostDisconnected(){this.#i()}#t(){this.#e&&this.#e.addListener(this.#s)}#i(){this.#e&&this.#e.removeListener(this.#s),this.#e=null}#s=e=>{"function"==typeof this.callback&&this.callback(e.matches)}}export{e as M};
