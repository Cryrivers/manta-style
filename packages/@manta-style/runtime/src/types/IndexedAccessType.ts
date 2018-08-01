import { Type } from '../utils/baseType';
import Literal from './Literal';
import { resolveReferencedType } from '../utils/referenceTypes';
import TypeLiteral from './TypeLiteral';
import UnionType from './UnionType';
import MantaStyle from '..';

export default class IndexedAccessType extends Type {
  private objectType: Type;
  private indexType: Type;
  constructor(objectType: Type, indexType: Type) {
    super();
    this.objectType = objectType;
    this.indexType = indexType;
  }
  public getProperty() {
    const objType = resolveReferencedType(this.objectType);
    const indexType = resolveReferencedType(this.indexType);
    const indexName = indexType.deriveLiteral().mock();
    if (objType instanceof TypeLiteral) {
      return objType
        ._getProperties()
        .find((property) => property.name === indexName);
    }
  }
  public deriveLiteral() {
    const {
      objectType: maybeReferencedObjectType,
      indexType: maybeReferencedIndexType,
    } = this;
    const objectType = resolveReferencedType(
      maybeReferencedObjectType,
    ).deriveLiteral();
    const indexType = resolveReferencedType(maybeReferencedIndexType);
    if (objectType instanceof TypeLiteral) {
      if (indexType instanceof Literal) {
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
      } else {
        // search for index signatures
        // TODO: Implement for index signatures
        return new Literal('Unimplemented');
      }
    } else {
      return objectType.deriveLiteral();
    }
  }
}
