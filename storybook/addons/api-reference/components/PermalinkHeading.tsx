import { DocsContext } from '@storybook/addon-docs/blocks';
import React, { type ReactNode, useContext } from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import { styled } from 'storybook/theming/emotion';

const AnchorLink = styled.a({
  '&&': {
    marginInlineStart: '0.25em',
    color: 'transparent',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  '&&::after': { content: '"#"' },
  '*:hover > &&': { color: 'inherit' },
});

export type HeadingTag = 'h2' | 'h3' | 'h4';

export interface PermalinkHeadingProps {
  readonly as: HeadingTag;
  readonly id: string;
  readonly children: ReactNode;
}

export function PermalinkHeading({ as: Tag, id, children }: PermalinkHeadingProps) {
  const context = useContext(DocsContext);
  return (
    <Tag id={id}>
      {children}
      <AnchorLink
        className="anchor-link sb-unstyled"
        href={`#${id}`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => context.channel.emit(NAVIGATE_URL, `#${id}`)}
      />
    </Tag>
  );
}
