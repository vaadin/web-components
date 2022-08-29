/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/tabs/src/vaadin-tab.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { DelegateStateMixin } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { Tabs } from '@vaadin/tabs/src/vaadin-tabs.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-tabsheet>` is a Web Component for organizing and grouping content
 * into scrollable panels. The panels can be switched between by using tabs.
 *
 * ```
 *  <vaadin-tabsheet>
 *    <div slot="prefix">Prefix</div>
 *    <div slot="suffix">Suffix</div>
 *
 *    <vaadin-tabs slot="tabs">
 *      <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
 *      <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
 *      <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
 *    </vaadin-tabs>
 *
 *    <div tab="tab-1">Panel 1</div>
 *    <div tab="tab-2">Panel 2</div>
 *    <div tab="tab-3">Panel 3</div>
 *  </vaadin-tabsheet>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name | Description
 * --------- | ---------------
 * `tabs-container`    | The container for the slotted prefix, tabs and suffix
 * `content`    | The container for the slotted panels
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `loading` | Set when a tab without associated content is selected | :host
 * `overflow`   | Set to `top`, `bottom`, `start`, `end`, all of them, or none.
 *
 * See [Styling Components](hhttps://vaadin.com/docs/latest/components/ds-resources/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes ControllerMixin
 * @mises DelegateStateMixin
 */
class TabSheet extends ControllerMixin(DelegateStateMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none !important;
        }

        :host {
          display: flex;
          flex-direction: column;
        }

        [part='tabs-container'] {
          position: relative;
          display: flex;
          align-items: baseline;
        }

        ::slotted([slot='tabs']) {
          overflow: hidden;
          flex: 1;
        }

        ::slotted([slot='prefix']),
        ::slotted([slot='suffix']) {
          flex: none;
        }

        [part='content'] {
          position: relative;
          overflow: auto;
          flex: 1;
          box-sizing: border-box;
        }
      </style>

      <div part="tabs-container">
        <slot name="prefix"></slot>
        <slot name="tabs"></slot>
        <slot name="suffix"></slot>
      </div>

      <div part="content">
        <div part="loader"></div>
        <slot id="panel-slot"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-tabsheet';
  }

  static get properties() {
    return {
      /**
       * The list of `<vaadin-tab>`s from which a selection can be made.
       * It is populated from the elements passed inside the slotted
       * `<vaadin-tabs>`, and updated dynamically when adding or removing items.
       *
       * Note: unlike `<vaadin-combo-box>`, this property is read-only.
       * @type {!Array<!Tab> | undefined}
       */
      items: {
        type: Array,
        readOnly: true,
        notify: true,
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number,
        reflectToAttribute: true,
        notify: true,
      },

      /**
       * The slotted <vaadin-tabs> element.
       */
      __tabs: {
        type: Object,
      },

      /**
       * The panel elements.
       */
      __panels: {
        type: Array,
      },
    };
  }

  /** @override */
  static get delegateProps() {
    return ['selected'];
  }

  /** @protected */
  ready() {
    super.ready();

    const tabsItemsChangedListener = () => this._setItems(this.__tabs.items);

    const tabsSelectedChangedListener = () => {
      this.selected = this.__tabs.selected;
    };

    this.__overflowController = new OverflowController(this, this.shadowRoot.querySelector('[part="content"]'));
    this.addController(this.__overflowController);

    // Observe the tabs slot for a <vaadin-tabs> element.
    this._tabsSlotController = new (class extends SlotController {
      constructor(host) {
        super(host, 'tabs');
      }

      initCustomNode(tabs) {
        if (!(tabs instanceof Tabs)) {
          throw Error('The "tabs" slot of a <vaadin-tabsheet> must only contain a <vaadin-tabs> element!');
        }
        tabs.addEventListener('items-changed', tabsItemsChangedListener);
        tabs.addEventListener('selected-changed', tabsSelectedChangedListener);
        this.host.__tabs = tabs;
        this.host.stateTarget = tabs;
      }

      teardownNode(tabs) {
        tabs.removeEventListener('items-changed', tabsItemsChangedListener);
        tabs.removeEventListener('selected-changed', tabsSelectedChangedListener);
        this.host._setItems([]);
        this.host.stateTarget = undefined;
      }
    })(this);
    this.addController(this._tabsSlotController);

    // Observe the panels slot for nodes. Set the assigned element nodes as the __panels array.
    const panelSlot = this.shadowRoot.querySelector('#panel-slot');
    this.__panelsObserver = new FlattenedNodesObserver(panelSlot, () => {
      this.__panels = Array.from(panelSlot.assignedNodes({ flatten: true })).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      );
    });
  }

  static get observers() {
    return ['__itemsOrPanelsChanged(items, __panels)', '__selectedTabItemChanged(selected, items, __panels)'];
  }

  /**
   * An observer which applies the necessary roles and ARIA attributes
   * to associate the tab elements with the panels.
   * @private
   */
  __itemsOrPanelsChanged(items, panels) {
    if (!items || !panels) {
      return;
    }

    items.forEach((tabItem) => {
      const panel = panels.find((panel) => panel.getAttribute('tab') === tabItem.id);
      if (panel) {
        panel.role = 'tabpanel';
        panel.id = panel.id || `tabsheet-panel-${generateUniqueId()}`;
        panel.setAttribute('aria-labelledby', tabItem.id);

        tabItem.setAttribute('aria-controls', panel.id);
      }
    });
  }

  /**
   * An observer which toggles the visibility of the panels based on the selected tab.
   * @private
   */
  __selectedTabItemChanged(selected, items, panels) {
    if (!items || !panels || selected === undefined) {
      return;
    }

    const content = this.shadowRoot.querySelector('[part="content"]');

    const selectedTab = items[selected];
    const selectedTabId = selectedTab ? selectedTab.id : '';
    const selectedPanel = panels.find((panel) => panel.getAttribute('tab') === selectedTabId);

    // Mark loading state if a selected panel is not found.
    this.toggleAttribute('loading', !selectedPanel);

    const hasOneVisiblePanel = panels.filter((panel) => !panel.hidden).length === 1;

    if (selectedPanel) {
      // A selected panel is found, remove the loading state fallback height.
      content.style.minHeight = '';
    } else if (hasOneVisiblePanel) {
      // Make sure the empty content has a fallback height in loading state..
      content.style.minHeight = `${content.offsetHeight}px`;
    }

    // Hide all panels and show only the selected panel.
    panels.forEach((panel) => {
      panel.hidden = panel !== selectedPanel;
    });
  }
}

customElements.define(TabSheet.is, TabSheet);

export { TabSheet };
