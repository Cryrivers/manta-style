import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import MantaStyle from '..';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

export default class IndexedAccessType extends Type {
  private readonly objectType: Type;
  private readonly indexType: Type;
  constructor(objectType: Type, indexType: Type) {
    super();
    this.objectType = objectType;
    this.indexType = indexType;
  }
  public getProperty(context: MantaStyleContext) {
    const { type: objType } = resolveReferencedType(this.objectType, context);
    const { type: indexType } = resolveReferencedType(this.indexType, context);
    const indexName = indexType.deriveLiteral([], context).mock();
    if (objType instanceof TypeLiteral) {
      return objType
        ._getProperties()
        .find((property) => property.name === indexName);
    }
  }
  public deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const {
      objectType: maybeReferencedObjectType,
      indexType: maybeReferencedIndexType,
    } = this;
    const objectType = resolveReferencedType(
      maybeReferencedObjectType,
      context,
    ).type.deriveLiteral(parentAnnotations, context);
    const { type: indexType } = resolveReferencedType(
      maybeReferencedIndexType,
      context,
    );
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType);
      } else if (indexType instanceof UnionType) {
        const indexTypes = indexType
          .derivePreservedUnionLiteral([], context)
          .getTypes();
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
  public validate(value: unknown, context: MantaStyleContext): value is any {
    const {
      objectType: maybeReferencedObjectType,
      indexType: maybeReferencedIndexType,
    } = this;
    const objectType = resolveReferencedType(maybeReferencedObjectType, context)
      .type;
    const { type: indexType } = resolveReferencedType(
      maybeReferencedIndexType,
      context,
    );
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType).validate(
          value,
          context,
        );
      } else if (indexType instanceof UnionType) {
        const indexTypes = indexType
          .derivePreservedUnionLiteral([], context)
          .getTypes();
        return new UnionType(
          indexTypes.map((indType) =>
            indexedAccessTypeLiteral(objectType, indType),
          ),
        ).validate(value, context);
      } else {
        // search for index signatures
        // TODO: Implement for index signatures
        throw Error('Unimplemented');
      }
    } else {
      return objectType.validate(value, context);
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
