/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox-group default"] = 
`- group "Toppings":
  - checkbox "Cheese"
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives"
  - text: Olives`;
/* end snapshot vaadin-checkbox-group default */

snapshots["vaadin-checkbox-group value"] = 
`- group "Toppings":
  - checkbox "Cheese" [checked]
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives" [checked]
  - text: Olives`;
/* end snapshot vaadin-checkbox-group value */

snapshots["vaadin-checkbox-group disabled"] = 
`- group "Toppings" [disabled]:
  - checkbox "Cheese" [disabled]
  - text: Cheese
  - checkbox "Ham" [disabled]
  - text: Ham
  - checkbox "Olives" [disabled]
  - text: Olives`;
/* end snapshot vaadin-checkbox-group disabled */

snapshots["vaadin-checkbox-group readonly"] = 
`- group "Toppings":
  - checkbox "Cheese"
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives"
  - text: Olives`;
/* end snapshot vaadin-checkbox-group readonly */

snapshots["vaadin-checkbox-group required"] = 
`- group "Toppings":
  - checkbox "Cheese"
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives"
  - text: Olives`;
/* end snapshot vaadin-checkbox-group required */

snapshots["vaadin-checkbox-group helper"] = 
`- group "Toppings":
  - /description: Choose up to two
  - checkbox "Cheese"
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives"
  - text: Olives
  - text: Choose up to two`;
/* end snapshot vaadin-checkbox-group helper */

snapshots["vaadin-checkbox-group error"] = 
`- group "Toppings":
  - /description: Choose at least one
  - checkbox "Cheese"
  - text: Cheese
  - checkbox "Ham"
  - text: Ham
  - checkbox "Olives"
  - text: Olives
  - text: Choose at least one`;
/* end snapshot vaadin-checkbox-group error */

