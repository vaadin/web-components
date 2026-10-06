import{x as t,a as s}from"./lit-element-auhBwOEL.js";import{P as e,d as a}from"./style-props-CNAjUT68.js";import{E as o}from"./element-mixin-DsE5nz_5.js";import{T as r}from"./tooltip-controller-Dzwl10F9.js";import{L as i}from"./lumo-injection-mixin-DCcyC9oP.js";import{T as n}from"./vaadin-themable-mixin-CCn25V_x.js";import{b as l}from"./vaadin-button-base-styles-DNtN-wHr.js";import{B as p}from"./vaadin-button-mixin-B73rIyss.js";
/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class d extends(p(o(n(e(i(s)))))){static get is(){return"vaadin-button"}static get styles(){return l}static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0,sync:!0}}}render(){return t`
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
    `}ready(){super.ready(),this._tooltipController=new r(this),this.addController(this._tooltipController)}__shouldAllowFocusWhenDisabled(){return window.Vaadin.featureFlags.accessibleDisabledButtons}}a(d);export{d as B};
