import React from 'react';

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
type PropsOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

export interface BoxOwnProps<E extends React.ElementType = React.ElementType> {
  as?: E;
}

export type BoxProps<E extends React.ElementType> = BoxOwnProps<E> &
  Omit<PropsOf<E>, keyof BoxOwnProps>;

export type PolymorphicComponentProps<E extends React.ElementType, P> = P &
  BoxProps<E>;

const defaultElement = 'div';

export const Box = React.forwardRef(
  ({ as, ...restProps }: BoxOwnProps, ref: React.Ref<Element>) => {
    const Element = as || defaultElement;
    return <Element ref={ref} {...restProps} />;
  }
) as <E extends React.ElementType = typeof defaultElement>(
  props: BoxProps<E>
) => JSX.Element;
