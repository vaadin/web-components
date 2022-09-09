const path = require('path');
const fs = require('fs');

const analysisPath = path.resolve('./analysis.json');

function loadAnalysis() {
  try {
    return JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
  } catch (e) {
    throw new Error(
      `Could not read output of the Polymer Analyzer from: ${analysisPath}. Make sure to run the Polymer Analyzer before generating web-types.`,
    );
  }
}

function writeAnalysis(analysis) {
  const analysisJson = JSON.stringify(analysis, null, 2);
  fs.writeFileSync(analysisPath, analysisJson, 'utf8');
}

function generateChangeEventName(property) {
  return `${property.name}-changed`;
}

function findEvent(element, eventName) {
  return element.events.find((event) => event.name === eventName);
}

/**
 * Adds missing change event declarations to elements. The Polymer Analyzer
 * only automatically generates these if the property is declared in the
 * component class, but not if it is declared in a mixin. This fix scans
 * for notifiable properties and adds respective change event declarations
 * if they don't exist yet.
 * @param analysis
 */
function addMissingChangeEventDeclarations(analysis) {
  const elements = analysis.elements;

  elements.forEach((element) => {
    element.properties.forEach((property) => {
      // Check if property is marked as notify, skip if not
      const hasNotify = property && property.metadata && property.metadata.polymer && property.metadata.polymer.notify;
      if (!hasNotify) {
        return;
      }
      // Check if there is an existing event declarations, skip if exists
      const changeEventName = generateChangeEventName(property);
      const existingEvent = findEvent(element, changeEventName);
      if (existingEvent) {
        return;
      }
      // Add missing event
      const eventDeclaration = {
        name: changeEventName,
        type: 'CustomEvent',
        description: `Fired when the \`${property.name}\` property changes.`,
        metadata: {},
      };
      element.events = element.events || {};
      element.events.push(eventDeclaration);
    });
  });
}

const analysis = loadAnalysis();
addMissingChangeEventDeclarations(analysis);
writeAnalysis(analysis);
