/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/tabs/vaadin-tab.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { Tabs } from '@vaadin/tabs/vaadin-tabs.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * TODO
 */
class TabSheet extends ControllerMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none !important;
        }

        :host {
          display: flex;
          height: 400px;
        }

        :host([orientation='horizontal']) {
          flex-direction: column;
        }

        [part='tabs-container'] {
          display: flex;
          flex-direction: column;
          align-items: baseline;
        }

        :host([orientation='horizontal']) [part='tabs-container'] {
          flex-direction: row;
        }

        [part='panels'] {
          overflow: auto;
          flex: 1;
        }
      </style>

      <!-- TODO: part naming (just tabs?) -->
      <div part="tabs-container">
        <slot name="prefix"></slot>
        <slot name="tabs"></slot>
        <slot name="suffix"></slot>
      </div>

      <div part="panels">
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
       * The tabsheet's orientation. Possible values are `horizontal|vertical`
       * @type {!TabSheetOrientation}
       */
      orientation: {
        reflectToAttribute: true,
        // TODO: Drop default value?
        value: 'horizontal',
        type: String,
        observer: '__orientationChanged',
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number,
        notify: true,
      },

      /**
       * The slotted <vaadin-tabs> element.
       */
      __tabs: {
        type: Object,
      },

      /**
       * The <vaadin-tab> elements.
       */
      __tabItems: {
        type: Array,
      },

      /**
       * The panel elements.
       */
      __panels: {
        type: Array,
      },
    };
  }

  ready() {
    super.ready();

    this.role = 'tablist';

    const tabsItemsChangedListener = () => {
      this.__tabItems = this.__tabs.items;
    };

    const tabsSelectedChangedListener = () => {
      this.selected = this.__tabs.selected;
    };

    // Observe the tabs slot for a
    this.addController(
      new (class extends SlotController {
        constructor(host) {
          super(host, 'tabs');
        }

        initCustomNode(tabs) {
          if (!(tabs instanceof Tabs)) {
            throw Error('The "tabs" slot of a <vaadin-tabsheet> must only contain a <vaadin-tabs> element!');
          }
          this.host.__tabs = tabs;
          tabs.orientation = this.host.orientation;
          tabs.selected = this.host.selected;
          tabs.addEventListener('items-changed', tabsItemsChangedListener);
          tabs.addEventListener('selected-changed', tabsSelectedChangedListener);
        }

        teardownNode(tabs) {
          tabs.removeEventListener('items-changed', tabsItemsChangedListener);
          tabs.removeEventListener('selected-changed', tabsSelectedChangedListener);
        }
      })(this),
    );

    // Observe the panels slot for nodes. Set the assigned element nodes as the __panels array.
    const panelSlot = this.shadowRoot.querySelector('#panel-slot');
    this.__panelsObserver = new FlattenedNodesObserver(panelSlot, () => {
      this.__panels = Array.from(panelSlot.assignedNodes({ flatten: true })).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      );
    });
  }

  static get observers() {
    return [
      '__tabItemsOrPanelsChanged(__tabItems, __panels)',
      '__selectedTabItemChanged(selected, __tabItems, __panels)',
      '__propagateTabsProperties(__tabs, orientation, selected)',
    ];
  }

  /**
   * An observer which applies the necessary roles and ARIA attributes
   * to associate the tab elements with the panels.
   * @private
   */
  __tabItemsOrPanelsChanged(tabItems, panels) {
    if (!tabItems || !panels) {
      return;
    }

    tabItems.forEach((tabItem) => {
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
  __selectedTabItemChanged(selected, tabItems, panels) {
    if (!tabItems || !panels || selected === undefined) {
      return;
    }

    const selectedTab = tabItems[selected];
    const selectedTabId = selectedTab ? selectedTab.id : '';

    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute('tab') !== selectedTabId;
    });
  }

  /**
   * An observer which propagates property value changes to the slotted <vaadin-tabs>.
   * @private
   */
  __propagateTabsProperties(tabs, orientation, selected) {
    if (tabs) {
      tabs.orientation = orientation;
      tabs.selected = selected;
    }
  }

  /**
   * An observer which reflects the orientation property to the host as aria-orientation.
   * @private
   */
  __orientationChanged(orientation) {
    if (orientation) {
      this.setAttribute('aria-orientation', orientation);
    } else {
      this.removeAttribute('aria-orientation');
    }
  }
}

customElements.define(TabSheet.is, TabSheet);

export { TabSheet };
