const fs = require('fs');
const path = require('path');

const PACKAGE_BASE = 'packages/vaadin-lumo-styles';

const styleModules = ['color', 'sizing', 'spacing', 'style', 'typography', 'user-colors'];
const utilityModules = [
  'accessibility',
  'background',
  'border',
  'flexbox-grid',
  'layout',
  'shadows',
  'sizing',
  'spacing',
  'typography',
];

function getCustomProperties() {
  const result = [];
  const uniqueProperties = [];

  styleModules.forEach((module) => {
    const content = fs.readFileSync(path.join(PACKAGE_BASE, `${module}.js`), 'utf8');
    const customPropertyDeclarationRegex = /--[\w\d-]+:.*;/g;
    const propertyDeclarations = content.match(customPropertyDeclarationRegex);
    propertyDeclarations.forEach((propertyDeclaration) => {
      // Avoid duplicate property declarations from dark theme
      const propertyName = propertyDeclaration.split(':')[0];
      if (!uniqueProperties.includes(propertyName)) {
        result.push(propertyDeclaration);
        uniqueProperties.push(propertyName);
      }
    });
  });

  return result;
}

function getUtilityClasses() {
  const result = [];

  utilityModules.forEach((module) => {
    const content = fs.readFileSync(path.join(PACKAGE_BASE, 'utilities', `${module}.js`), 'utf8');
    const cssSectionRegex = /css`((.|\s)*?)`/gm;
    let match;

    while ((match = cssSectionRegex.exec(content))) {
      let section = match[1];
      // Remove escape backslash
      section = section.replace(/\\\\/g, '\\');
      // Unindent
      section = section.replace(/\n\s{2}/g, '\n');
      result.push(section);
    }
  });

  return result;
}

const customProperties = getCustomProperties();
const utilityClasses = getUtilityClasses();

let result = `/* This file contains declarations for CSS custom properties and utility 
 * classes of the Lumo theme in order to provide auto-complete support 
 * for IDEs.
 * 
 * NOTE: This file is only intended to provide auto-complete support,
 * do not include it into an HTML page!
 */
 
 `;
result += '/* Custom CSS properties */\n';
result += ':host {\n';
customProperties.forEach((customProperty) => {
  result += `  ${customProperty}\n`;
});
result += '}\n\n';

result += '/* Utility classes */\n';
result += utilityClasses.join('');

fs.writeFileSync(path.join(PACKAGE_BASE, 'auto-complete.css'), result, 'utf8');
