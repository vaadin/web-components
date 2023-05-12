export * from './generated/Crud.js';

/**
 * A helper function that allows declaring the value path (or key) on
 * the fields in a custom form of a `<Crud />` component.
 *
 * ### Usage
 *
 * ```tsx
 * <Crud>
 *   <FormLayout slot="form">
 *     <TextField label="Name" {...crudPath('name')} />
 *   </FormLayout>
 * </Crud>
 * ```
 *
 * @param path The path of the particular field's value in the CRUD
 * item objects.
 *
 * @returns object with HTML attribute values recognized on a CRUD form field.
 */
export function crudPath(path: string): Record<string, string> {
  return { path } as Record<string, string>;
}
