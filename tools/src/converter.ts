import { ICustomType, ITypeDescr } from '../integration-data-model';
import { lowercaseFirst } from './helpers';

function convertTypes(
  types: ITypeDescr[] | undefined | null,
  customTypes?: Record<string, ICustomType>,
): string[] | undefined {
  if (types === undefined || types === null || types.length === 0) {
    return undefined;
  }

  if (customTypes) {
    types.push(...expandTypes(types, customTypes));
  }

  const convertedTypes = new Set(types.map(convertType));
  if (convertedTypes.has('Any')) {
    return undefined;
  }

  return Array.from(convertedTypes);
}

function expandTypes(types: ITypeDescr[], customTypes: Record<string, ICustomType>): ITypeDescr[] {
  const expandedTypes: ITypeDescr[] = [];
  types.forEach((t) => {
    if (t.isCustomType) {
      const aliases = customTypes[t.type].types;
      if (aliases) {
        expandedTypes.push(...aliases);
      }
    }
  });
  return expandedTypes;
}

function convertType(typeDescr: ITypeDescr): string {
  const type = typeDescr.type;
  switch (type) {
    case inputTypes.string:
    case inputTypes.number:
    case inputTypes.array:
    case inputTypes.object:
      return lowercaseFirst(type);

    case inputTypes.bool:
      return 'bool';

    case inputTypes.func:
      return 'func';
    default:
      break;
  }

  if (typeDescr.isCustomType) {
    return 'object';
  }

  return 'Any';
}

const inputTypes = {
  array: 'Array',
  string: 'String',
  number: 'Number',
  object: 'Object',
  bool: 'Boolean',
  func: 'Function',
};

export {
  convertTypes,
};
