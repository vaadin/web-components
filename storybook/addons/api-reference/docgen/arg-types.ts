import { logger } from 'storybook/internal/node-logger';
import type { StrictArgTypes, StrictInputType } from 'storybook/internal/types';
import type { TypeContext } from '../../../../api-docs/types.ts';

type TypeLookup = Pick<TypeContext, 'getMemberType' | 'findRelatedTypes' | 'findEventType'>;

interface TableType {
  summary: string;
  detail?: string;
}

interface ArgTypeContext {
  tagName: string;
  typeContext: TypeLookup;
  fixLinks(markdown: string): string;
}

function propertyType(typeContext: TypeLookup, name: string): TableType {
  const summary = typeContext.getMemberType(name);
  const related = typeContext.findRelatedTypes(summary);
  const detail = related.map((type) => type.declarationText.trim()).join('\n\n');
  return detail ? { summary, detail } : { summary };
}

function eventType(typeContext: TypeLookup, name: string): TableType | undefined {
  const type = typeContext.findEventType(name);
  return type ? { summary: type.name, detail: type.declarationText.trim() } : undefined;
}

function tableType(argType: StrictInputType, typeContext: TypeLookup): TableType | undefined {
  switch (argType.table?.category) {
    case 'properties':
      return propertyType(typeContext, argType.name);
    case 'methods':
      return { summary: typeContext.getMemberType(argType.name) };
    case 'events':
      return eventType(typeContext, argType.name);
    default:
      // Attributes, slots, CSS parts and CSS properties have no TypeScript type
      return undefined;
  }
}

function updateArgType(argType: StrictInputType, { tagName, typeContext, fixLinks }: ArgTypeContext): StrictInputType {
  let type: TableType | undefined;
  try {
    type = tableType(argType, typeContext);
  } catch (error) {
    logger.debug(`No TypeScript type for <${tagName}> ${argType.name}: ${String(error)}`);
  }
  return {
    ...argType,
    description: argType.description && fixLinks(argType.description),
    table: type ? { ...argType.table, type: { ...argType.table?.type, ...type } } : argType.table,
  };
}

export function updateArgTypes(argTypes: StrictArgTypes, context: ArgTypeContext): StrictArgTypes {
  return Object.fromEntries(Object.entries(argTypes).map(([key, argType]) => [key, updateArgType(argType, context)]));
}
