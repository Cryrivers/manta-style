import NumberKeyword from './types/NumberKeyword';
import BooleanKeyword from './types/BooleanKeyword';
import UndefinedKeyword from './types/UndefinedKeyword';
import NullKeyword from './types/NullKeyword';
import TypeLiteral from './types/TypeLiteral';
import ArrayType from './types/ArrayType';
import Literal from './types/Literal';
import UnionType from './types/UnionType';
import AnyKeyword from './types/AnyKeyword';
import NeverKeyword from './types/NeverKeyword';
import StringKeyword from './types/StringKeyword';
import TypeAliasDeclaration from './nodes/TypeAliasDeclaration';
import LazyTypeAliasDeclaration from './nodes/LazyTypeAliasDeclaration';
import ConditionalType from './types/ConditionalType';
import KeyOfKeyword from './types/KeyOfKeyword';
import TupleType from './types/TupleType';
import RestType from './types/RestType';
import OptionalType from './types/OptionalType';
import IndexedAccessType from './types/IndexedAccessType';
import MappedType from './types/MappedType';
import { Literals, Property } from './utils/baseType';
import IntersectionType from './types/IntersectionType';
import ParenthesizedType from './types/ParenthesizedType';
import ObjectKeyword from './types/ObjectKeyword';
import ArrayLiteral from './types/ArrayLiteral';
import { Annotation, Type } from '@manta-style/core';

export type TypeAliasDeclarationFactory = () => TypeAliasDeclaration;
export type TypeLiteral = TypeLiteral;
export type Property = Property;
class MantaStyle {
  public static TypeAliasDeclaration(
    typeName: string,
    typeCallback: (currentType: TypeAliasDeclaration) => Type,
    annotations: Annotation[],
  ) {
    const newType = new LazyTypeAliasDeclaration(typeName, annotations);
    newType.setInitialize(typeCallback);
    return newType;
  }
  public static TypeLiteral(typeCallback: (currentType: TypeLiteral) => void) {
    const newType = new TypeLiteral();
    typeCallback(newType);
    return newType;
  }
  public static MappedType(typeCallback: (currentType: MappedType) => Type) {
    const newType = new MappedType();
    newType.setType(typeCallback(newType));
    return newType;
  }
  public static IndexedAccessType(objectType: Type, indexType: Type) {
    return new IndexedAccessType(objectType, indexType);
  }
  public static UnionType(types: Type[]) {
    return new UnionType(types);
  }
  public static ParenthesizedType(type: Type) {
    return new ParenthesizedType(type);
  }
  public static IntersectionType(types: Type[]) {
    return new IntersectionType(types);
  }
  public static Literal(literal: Literals) {
    return new Literal(literal);
  }
  public static ArrayType(elementType: Type) {
    return new ArrayType(elementType);
  }
  public static ArrayLiteral(elements: Type[]) {
    return new ArrayLiteral(elements);
  }
  public static TupleType(elementTypes: Type[]) {
    return new TupleType(elementTypes);
  }
  public static RestType(elementType: Type) {
    return new RestType(elementType);
  }
  public static OptionalType(type: Type) {
    return new OptionalType(type);
  }
  public static ConditionalType(
    checkType: Type,
    extendsType: Type,
    trueType: Type,
    falseType: Type,
  ) {
    return new ConditionalType(checkType, extendsType, trueType, falseType);
  }
  public static NumberKeyword = new NumberKeyword();
  public static BooleanKeyword = new BooleanKeyword();
  public static StringKeyword = new StringKeyword();
  public static NeverKeyword = new NeverKeyword();
  public static NullKeyword = new NullKeyword();
  public static UndefinedKeyword = new UndefinedKeyword();
  public static AnyKeyword = new AnyKeyword();
  public static ObjectKeyword = new ObjectKeyword();
  public static KeyOfKeyword(type: Type) {
    return new KeyOfKeyword(type);
  }
}

export default MantaStyle;
export const LiteralType = Literal;
export { resolveReferencedType } from './utils/referenceTypes';
