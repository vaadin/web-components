import { forwardRef, type ForwardedRef, type ReactElement, type RefAttributes } from 'react';
import {
  Markdown as _Markdown,
  type MarkdownProps as _MarkdownProps,
  type MarkdownElement,
} from './generated/Markdown.js';

export * from './generated/Markdown.js';

export type MarkdownProps = Partial<Omit<_MarkdownProps, 'children' | 'content'>> &
  Readonly<{
    children?: string | null;
  }>;

function Markdown({ children, ...props }: MarkdownProps, ref: ForwardedRef<MarkdownElement>): ReactElement | null {
  return <_Markdown {...props} ref={ref} content={children ?? ''}></_Markdown>;
}

const ForwardedMarkdown = forwardRef(Markdown) as (
  props: MarkdownProps & RefAttributes<MarkdownElement>,
) => ReactElement | null;

export { ForwardedMarkdown as Markdown };
