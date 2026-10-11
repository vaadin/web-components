/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox-group default"] = 
`- text: Toppings
- checkbox "Cheese" [checked=false]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked=false]
- text: Olives`;
/* end snapshot vaadin-checkbox-group default */

snapshots["vaadin-checkbox-group value"] = 
`- text: Toppings
- checkbox "Cheese" [checked]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked]
- text: Olives`;
/* end snapshot vaadin-checkbox-group value */

snapshots["vaadin-checkbox-group disabled"] = 
`- text: Toppings
- checkbox "Cheese" [disabled, checked=false]
- text: Cheese
- checkbox "Ham" [disabled, checked=false]
- text: Ham
- checkbox "Olives" [disabled, checked=false]
- text: Olives`;
/* end snapshot vaadin-checkbox-group disabled */

snapshots["vaadin-checkbox-group readonly"] = 
`- text: Toppings
- checkbox "Cheese" [checked=false]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked=false]
- text: Olives`;
/* end snapshot vaadin-checkbox-group readonly */

snapshots["vaadin-checkbox-group required"] = 
`- text: Toppings
- checkbox "Cheese" [checked=false]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked=false]
- text: Olives`;
/* end snapshot vaadin-checkbox-group required */

snapshots["vaadin-checkbox-group helper"] = 
`- text: Toppings
- checkbox "Cheese" [checked=false]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked=false]
- text: Olives
- text: Choose up to two`;
/* end snapshot vaadin-checkbox-group helper */

snapshots["vaadin-checkbox-group error"] = 
`- text: Toppings
- checkbox "Cheese" [checked=false]
- text: Cheese
- checkbox "Ham" [checked=false]
- text: Ham
- checkbox "Olives" [checked=false]
- text: Olives
- text: Choose at least one`;
/* end snapshot vaadin-checkbox-group error */

