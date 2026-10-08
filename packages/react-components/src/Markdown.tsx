/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  Markdown as _Markdown,
  type MarkdownElement,
  type MarkdownProps as _MarkdownProps,
} from './generated/Markdown.js';

export * from './generated/Markdown.js';

export type MarkdownProps = Partial<Omit<_MarkdownProps, 'children' | 'content'>> &
  Readonly<{
    children?: string | null;
  }>;

function Markdown({ children, ...props }: MarkdownProps, ref: ForwardedRef<MarkdownElement>): ReactElement | null {
  return <_Markdown {...props} ref={ref} content={children ?? ''} />;
}

const ForwardedMarkdown = forwardRef(Markdown) as (
  props: MarkdownProps & RefAttributes<MarkdownElement>,
) => ReactElement | null;

export { ForwardedMarkdown as Markdown };
