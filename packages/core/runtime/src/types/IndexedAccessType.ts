import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import MantaStyle from '..';
import {
  MantaStyleAnnotation,
  MantaStyleContext,
  Type,
} from '@manta-style/core';

export default class IndexedAccessType extends Type {
  private readonly objectType: Type;
  private readonly indexType: Type;
  constructor(objectType: Type, indexType: Type) {
    super();
    this.objectType = objectType;
    this.indexType = indexType;
  }
  public async getProperty(context: MantaStyleContext) {
    const { type: objType } = await resolveReferencedType(
      this.objectType,
      context,
    );
    const { type: indexType } = await resolveReferencedType(
      this.indexType,
      context,
    );
    const indexName = (await indexType.deriveLiteral(
      MantaStyleAnnotation.empty(),
      context,
    )).mock();
    if (objType instanceof TypeLiteral) {
      return objType
        ._getProperties()
        .find((property) => property.name === indexName);
    }
  }
  public async deriveLiteral(
    parentAnnotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const {
      objectType: maybeReferencedObjectType,
      indexType: maybeReferencedIndexType,
    } = this;
    const objectType = await (await resolveReferencedType(
      maybeReferencedObjectType,
      context,
    )).type.deriveLiteral(parentAnnotations, context);
    const { type: indexType } = await resolveReferencedType(
      maybeReferencedIndexType,
      context,
    );
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType);
      } else if (indexType instanceof UnionType) {
        const indexTypes = (await indexType.derivePreservedUnionLiteral(
          MantaStyleAnnotation.empty(),
          context,
        )).getTypes();
        return new UnionType(
          indexTypes.map((indType) =>
            indexedAccessTypeLiteral(objectType, indType),
          ),
        );
      } else {
        // search for index signatures
        // TODO: Implement for index signatures
        return new Literal('Unimplemented');
      }
    } else {
      return objectType.deriveLiteral(parentAnnotations, context);
    }
  }
}

function indexedAccessTypeLiteral(
  objectType: TypeLiteral,
  indexType: Type,
): Type {
  // property index access
  const key = indexType.mock();
  const foundType = objectType
    ._getProperties()
    .find((item) => item.name === key);
  if (foundType) {
    return foundType.questionMark
      ? new UnionType([foundType.type, MantaStyle.UndefinedKeyword])
      : foundType.type;
  } else {
    // by right it should return AnyKeyword
    return MantaStyle.NeverKeyword;
  }
}
