/**
 * The fields of the web-types schema that the tooling writes and reads.
 * See https://github.com/JetBrains/web-types/blob/master/schema/web-types.json
 */

/** An item with a name, such as an event, a slot or a CSS part. */
export interface WebTypesItem {
  name: string;
  description?: string;
  deprecated?: boolean | string;
}

/** An attribute or a property, with the type of its value or a Lit expression. */
export interface WebTypesAttribute extends WebTypesItem {
  value?: {
    type?: string | string[];
    kind?: 'plain' | 'expression' | 'no-value';
  };
  default?: string;
}

export interface WebTypesElement extends WebTypesItem {
  extension?: boolean;
  attributes?: WebTypesAttribute[];
  slots?: WebTypesItem[];
  js?: {
    properties?: WebTypesAttribute[];
    events?: WebTypesItem[];
  };
  css?: {
    parts?: WebTypesItem[];
    properties?: WebTypesItem[];
  };
}

export interface WebTypes {
  $schema: string;
  name: string;
  version: string;
  'description-markup': 'html' | 'markdown' | 'none';
  framework?: string;
  'framework-config'?: {
    'enable-when'?: {
      'node-packages'?: string[];
    };
  };
  contributions: {
    html?: {
      elements?: WebTypesElement[];
    };
  };
}
