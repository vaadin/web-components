# Transforming this element to hybrid element.

Following the steps from here:
 https://www.polymer-project.org/2.0/docs/devguide/hybrid-elements

## 0. Installed latest polymer-cli
$ npm install polymer-cli@next

## 1. Updated dependencies
Created new dependencies that targeted latest versions of Polymer, and set old dependencies to `variants`

- Need to make sure to test all versions.
<<<<<<< 315c0418408ac23991ed73189b524a38b014ceeb
<<<<<<< 48e55a8544895b5112e016386d3ba6c9eb6ef5a5
=======
>>>>>>> Updated to Shadow DOM v1: <content> => <slot>

## 2. Update to Shadow DOM v1
Changed `<content>` to `<slot>` and `::content foo` to `::slotted(foo)`.

Updated the demos to use the new interface.
<<<<<<< 315c0418408ac23991ed73189b524a38b014ceeb
=======
>>>>>>> Changed dependencies.
=======
>>>>>>> Updated to Shadow DOM v1: <content> => <slot>
