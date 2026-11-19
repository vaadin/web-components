import { Description, Primary, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import React from 'react';
import { headingTexts } from '../utils/slug.js';
import { ApiMarkdown } from './ApiMarkdown.js';
import { useDocgen } from './use-docgen.js';

export function ApiDocsPage() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const payload = useDocgen(preparedMeta.componentId).data;
  const description = payload?.description;
  const apiDescription = payload?.apiDescription;

  return (
    <>
      <Title />
      <Subtitle />
      {description ? <ApiMarkdown seed={[]}>{description}</ApiMarkdown> : <Description />}
      <Primary />
      {apiDescription ? <ApiMarkdown seed={headingTexts(description ?? '')}>{apiDescription}</ApiMarkdown> : null}
    </>
  );
}
