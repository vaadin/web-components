import { createElement, type ForwardedRef, type RefAttributes, type FC } from 'react';

export default function createComponentWithOrderedProps<P extends {}, E extends HTMLElement>(
  component: FC<P>,
  ...names: ReadonlyArray<keyof P>
) {
  return (props: P, ref: ForwardedRef<E>) => {
    const orderedProps: Partial<P> & RefAttributes<E> = {};

    for (const name of Object.keys(props) as Array<keyof P>) {
      if (!names.includes(name)) {
        orderedProps[name] = props[name];
      }
    }

    for (const name of names) {
      if (props.hasOwnProperty(name)) {
        orderedProps[name] = props[name];
      }
    }

    orderedProps.ref = ref;

    return createElement(component, orderedProps as Required<P & RefAttributes<E>>);
  };
}
