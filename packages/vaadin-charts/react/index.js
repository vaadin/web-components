'use strict'

var DefaultEventPluginOrder = require('react/lib/DefaultEventPluginOrder');
var DOMChildrenOperations = require('react/lib/DOMChildrenOperations');
var DOMLazyTree = require('react/lib/DOMLazyTree');
var ReactDOMComponentTree = require('react/lib/ReactDOMComponentTree');
var EventConstants = require('react/lib/EventConstants');
var EventPluginRegistry = require('react/lib/EventPluginRegistry');
var EventPluginUtils = require('react/lib/EventPluginUtils');
var EventPropagators = require('react/lib/EventPropagators');
var ReactBrowserEventEmitter = require('react/lib/ReactBrowserEventEmitter');
var ReactInjection = require('react/lib/ReactInjection');
var SyntheticEvent = require('react/lib/SyntheticEvent');
var keyOf = require('fbjs/lib/keyOf');
var Polymer = global.Polymer;

// check if element is a vaadin-chart
function isVaadinChart(element) {
    return element.nodeName && element.nodeName.indexOf('VAADIN-') !== -1 &&
        (element.nodeName.indexOf('-CHART') !== -1 || element.nodeName.indexOf('-SPARKLINE') !== -1);
}

var customTopLevelTypes = {};
var VaadinChartsReactPlugin = {
    eventTypes: {},

    // Bubble vaadin-charts events to the original chart element
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var targetNode = targetInst && ReactDOMComponentTree.getNodeFromInstance(targetInst);
        if (!customTopLevelTypes.hasOwnProperty(topLevelType) ||
            !isVaadinChart(targetNode)) {
            return null;
        }
        var event = SyntheticEvent.getPooled(
            customTopLevelTypes[topLevelType],
            targetInst,
            nativeEvent,
            nativeEventTarget
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
    }
};

var registeredEvents = [];

/**
 * Register an event to listen Vaadin Chart events.
 * Complete list of events at the bottom of this file.
 * @param {string} name the event name (e.g. 'chart-loaded')
 * @param {object|string} bubbled listener attribute name as an object key (e.g. {onChange: true} or 'on-chart-loaded')
 */
function registerEvent(name, bubbled) {
    injectAll();
    if (typeof bubbled !== 'string') {
        bubbled = keyOf(bubbled);
    }

    var captured = bubbled + 'Captured';
    var regEventBubbled = registeredEvents.some(function(reg) {
      return reg.name === name || reg.bubbled === bubbled;
    });
    if (regEventBubbled) {
        return;
    }
    registeredEvents.push({
        name: name,
        bubbled: bubbled
    });

    var topLevelType = 'top-custom' + bubbled;
    var dispatchConfig = {
        phasedRegistrationNames: {
            bubbled: bubbled,
            captured: captured
        },
        dependencies: [topLevelType]
    };

    EventConstants.topLevelTypes[topLevelType] = topLevelType;

    ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
        topLevelType,
        name,
        document
    );

    VaadinChartsReactPlugin.eventTypes[bubbled] =
        EventPluginRegistry.eventNameDispatchConfigs[bubbled] =
        customTopLevelTypes[topLevelType] = dispatchConfig;

    EventPluginRegistry.registrationNameModules[bubbled] =
        EventPluginRegistry.registrationNameModules[captured] = VaadinChartsReactPlugin;

    EventPluginRegistry.registrationNameDependencies[bubbled] =
        EventPluginRegistry.registrationNameDependencies[captured] =
        dispatchConfig.dependencies;
}

var isInjected = false;

function injectAll() {
    if (isInjected) {
        return;
    }
    isInjected = true;

    require('react'); // make sure it's loaded
    require('react/lib/ReactDOM');

    ReactInjection.EventPluginHub.injectEventPluginsByName({
        VaadinChartsReactPlugin: VaadinChartsReactPlugin
    });

    ReactInjection.DOMProperty.injectDOMPropertyConfig({
        isCustomAttribute: function(name) {
            return name !== 'children';
        }
    });
}

if (EventPluginUtils.injection.Mount) {
    throw new Error('vaadin-charts-react must be required before react');
}
// must be called before require('react') is called the first time
DefaultEventPluginOrder.push(keyOf({
    VaadinChartsReactPlugin: null
}));

// Fix light DOM issues
function fixLightDom() {
  var ShadyDOMChildrenOperations = require('./ShadyDOMChildrenOperations');
  DOMChildrenOperations.replaceDelimitedText = ShadyDOMChildrenOperations.replaceDelimitedText;
  DOMChildrenOperations.processUpdates = ShadyDOMChildrenOperations.processUpdates;

  var ShadyDOMLazyTree = require('./ShadyDOMLazyTree');
  DOMLazyTree.insertTreeBefore = ShadyDOMLazyTree.insertTreeBefore;
  DOMLazyTree.replaceChildWithTree = ShadyDOMLazyTree.replaceChildWithTree;
  DOMLazyTree.queueChild = ShadyDOMLazyTree.queueChild;
  DOMLazyTree.queueHTML = ShadyDOMLazyTree.queueHTML;
  DOMLazyTree.queueText = ShadyDOMLazyTree.queueText;
}

if (Polymer) {
  var useShadyDOM = Polymer && !Polymer.Settings.useNativeShadow;
  if (useShadyDOM) {
    fixLightDom();
  }
} else {
  document.addEventListener('WebComponentsReady', function() {
    Polymer = global.Polymer;
    var useShadyDOM = Polymer && !Polymer.Settings.useNativeShadow;
    if (useShadyDOM) {
      fixLightDom();
    }
  });
}

/**
 *  Name of the chart events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('chart-loaded', 'on-chart-loaded');
registerEvent('add-series', 'on-add-series');
registerEvent('after-print', 'on-after-print');
registerEvent('before-print', 'on-before-print');
registerEvent('chart-click', 'on-chart-click');
registerEvent('drilldown', 'on-drilldown');
registerEvent('drillup', 'on-drillup');
registerEvent('redraw', 'on-redraw');
registerEvent('selection', 'on-selection');

/**
 *  Name of the series events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('series-after-animate', 'on-series-after-animate');
registerEvent('series-checkbox-click', 'on-series-checkbox-click');
registerEvent('series-click', 'on-series-click');
registerEvent('series-hide', 'on-series-hide');
registerEvent('series-legend-item-click', 'on-series-legend-item-click');
registerEvent('series-mouse-out', 'on-series-mouse-out');
registerEvent('series-mouse-over', 'on-series-mouse-over');
registerEvent('series-show', 'on-series-show');

/**
 *  Name of the point events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('point-click', 'on-point-click');
registerEvent('point-mouse-out', 'on-point-mouse-out');
registerEvent('point-mouse-over', 'on-point-mouse-over');
registerEvent('point-remove', 'on-point-remove');
registerEvent('point-select', 'on-point-select');
registerEvent('point-unselect', 'on-point-unselect');
registerEvent('point-update', 'on-point-update');
