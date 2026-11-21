import type { StrictArgTypes, StrictInputType } from 'storybook/internal/types';
import type { ManifestEvent, ManifestMember, TypeContext } from '../../../../api-docs/types.ts';

type TypeLookup = Pick<TypeContext, 'getMemberType' | 'findRelatedTypes' | 'findEventType'>;

interface TableType {
  summary: string;
  detail?: string;
}

interface ArgTypeContext {
  typeContext: TypeLookup;
  members: ManifestMember[];
  events: ManifestEvent[];
  fixLinks(markdown: string): string;
}

function propertyType(typeContext: TypeLookup, member: ManifestMember): TableType {
  const summary = typeContext.getMemberType(member);
  const related = typeContext.findRelatedTypes(member.type);
  const detail = related.map((type) => type.declarationText.trim()).join('\n\n');
  return detail ? { summary, detail } : { summary };
}

function eventType(typeContext: TypeLookup, event: ManifestEvent): TableType | undefined {
  const type = typeContext.findEventType(event);
  return type ? { summary: type.name, detail: type.declarationText.trim() } : undefined;
}

function tableType(argType: StrictInputType, { typeContext, members, events }: ArgTypeContext): TableType | undefined {
  const member = members.find((m) => m.name === argType.name);
  const event = events.find((e) => e.name === argType.name);
  switch (argType.table?.category) {
    case 'properties':
      return member && propertyType(typeContext, member);
    case 'methods':
      return member && { summary: typeContext.getMemberType(member) };
    case 'events':
      return event && eventType(typeContext, event);
    default:
      // Attributes, slots, CSS parts and CSS properties have no TypeScript type
      return undefined;
  }
}

function updateArgType(argType: StrictInputType, context: ArgTypeContext): StrictInputType {
  const type = tableType(argType, context);
  return {
    ...argType,
    description: argType.description && context.fixLinks(argType.description),
    table: type ? { ...argType.table, type: { ...argType.table?.type, ...type } } : argType.table,
  };
}

export function updateArgTypes(argTypes: StrictArgTypes, context: ArgTypeContext): StrictArgTypes {
  return Object.fromEntries(Object.entries(argTypes).map(([key, argType]) => [key, updateArgType(argType, context)]));
}
