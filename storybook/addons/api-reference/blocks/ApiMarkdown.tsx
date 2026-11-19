import { AnchorMdx, CodeOrSourceMdx, HeadersMdx, Markdown } from '@storybook/addon-docs/blocks';
import React from 'react';
import { type HeadingTag, PermalinkHeading, type PermalinkHeadingProps } from '../components/PermalinkHeading.js';
import { createSlugger } from '../utils/slug.js';

const markdownHeading = (as: HeadingTag) => (props: Omit<PermalinkHeadingProps, 'as'>) => (
  <PermalinkHeading as={as} {...props} />
);

const OVERRIDES = {
  // The Markdown block replaces its own overrides with these, so repeat its defaults
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx,
  h2: markdownHeading('h2'),
  h3: markdownHeading('h3'),
  h4: markdownHeading('h4'),
};

interface ApiMarkdownProps {
  readonly children: string;
  /** Headings above on the page, which keep their ids */
  readonly seed: string[];
}

export function ApiMarkdown({ children, seed }: ApiMarkdownProps) {
  // A new slugger for each render keeps the ids the same between renders
  return <Markdown options={{ slugify: createSlugger(seed), overrides: OVERRIDES }}>{children}</Markdown>;
}
