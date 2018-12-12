import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import MantaStyle from '..';
import { Annotation, Type } from '@manta-style/core';

export default class IndexedAccessType extends Type {
  private readonly objectType: Type;
  private readonly indexType: Type;
  constructor(objectType: Type, indexType: Type) {
    super();
    this.objectType = objectType;
    this.indexType = indexType;
  }
  public getProperty() {
    const { type: objType } = resolveReferencedType(this.objectType);
    const { type: indexType } = resolveReferencedType(this.indexType);
    const indexName = indexType.deriveLiteral([]).mock();
    if (objType instanceof TypeLiteral) {
      return objType
        ._getProperties()
        .find((property) => property.name === indexName);
    }
  }
  private getObjectIndexTypes(parentAnnotations: Annotation[] = []) {
    const {
      objectType: maybeReferencedObjectType,
      indexType: maybeReferencedIndexType,
    } = this;
    const objectType = resolveReferencedType(
      maybeReferencedObjectType,
    ).type.deriveLiteral(parentAnnotations);
    const { type: indexType } = resolveReferencedType(maybeReferencedIndexType);
    return { objectType, indexType };
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const { objectType, indexType } = this.getObjectIndexTypes();
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType);
      } else if (indexType instanceof UnionType) {
        const indexTypes = indexType.derivePreservedUnionLiteral([]).getTypes();
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
      return objectType.deriveLiteral(parentAnnotations);
    }
  }
  public validate(value: unknown): value is any {
    const { objectType, indexType } = this.getObjectIndexTypes();
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType).validate(value);
      } else if (indexType instanceof UnionType) {
        const indexTypes = indexType.derivePreservedUnionLiteral([]).getTypes();
        return new UnionType(
          indexTypes.map((indType) =>
            indexedAccessTypeLiteral(objectType, indType),
          ),
        ).validate(value);
      } else {
        // search for index signatures
        // TODO: Implement for index signatures
        throw Error('Unimplemented');
      }
    } else {
      return objectType.validate(value);
    }
  }
  public format(value: unknown) {
    const { objectType, indexType } = this.getObjectIndexTypes();
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
        return indexedAccessTypeLiteral(objectType, indexType).format(value);
      } else if (indexType instanceof UnionType) {
        const indexTypes = indexType.derivePreservedUnionLiteral([]).getTypes();
        return new UnionType(
          indexTypes.map((indType) =>
            indexedAccessTypeLiteral(objectType, indType),
          ),
        ).format(value);
      } else {
        // search for index signatures
        // TODO: Implement for index signatures
        throw Error('Unimplemented');
      }
    } else {
      return objectType.format(value);
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
