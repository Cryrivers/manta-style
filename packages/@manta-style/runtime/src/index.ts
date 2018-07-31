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
import TypeReference from './types/TypeReference';
import TypeAliasDeclaration from './nodes/TypeAliasDeclaration';
import ConditionalType from './types/ConditionalType';
import KeyOfKeyword from './types/KeyOfKeyword';
import ArrayLiteral from './types/ArrayLiteral';
import TupleType from './types/TupleType';
import RestType from './types/RestType';
import OptionalType from './types/OptionalType';
import { Type, Literals, Annotation } from './utils/baseType';

export const URL_QUERY_TYPE_PREFIX = '@@URLQuery/';

class MantaStyle {
  private static typeReferences: { [key: string]: TypeAliasDeclaration } = {};
  public static registerType(name: string, type: TypeAliasDeclaration) {
    if (MantaStyle.typeReferences[name]) {
      throw new Error(`Type "${name}" has already been registered.`);
    } else {
      MantaStyle.typeReferences[name] = type;
    }
  }
  public static referenceType(name: string): TypeAliasDeclaration {
    if (!MantaStyle.typeReferences[name]) {
      if (name.startsWith(URL_QUERY_TYPE_PREFIX)) {
        return MantaStyle.TypeAliasDeclaration(
          `Anonymous "Never" Type Alias`,
          () => MantaStyle.NeverKeyword,
          [],
        );
      }
      throw new Error(`Type "${name}" hasn't been registered yet.`);
    } else {
      return MantaStyle.typeReferences[name];
    }
  }
  public static clearQueryTypes() {
    Object.keys(MantaStyle.typeReferences).forEach((key) => {
      if (key.startsWith(URL_QUERY_TYPE_PREFIX)) {
        delete MantaStyle.typeReferences[key];
      }
    });
  }
  public static createTypeByQuery(key: string, value: string | string[]) {
    let type: Type;
    if (Array.isArray(value)) {
      type = new ArrayLiteral(value.map((item) => new Literal(item)));
    } else {
      type = new Literal(value);
    }
    MantaStyle.registerType(
      `${URL_QUERY_TYPE_PREFIX}${key}`,
      MantaStyle.TypeAliasDeclaration(`"${key}" in query`, () => type, []),
    );
  }
  public static TypeAliasDeclaration(
    typeName: string,
    typeCallback: (currentType: TypeAliasDeclaration) => Type,
    annotations: Annotation[],
  ) {
    const newType = new TypeAliasDeclaration(typeName, annotations);
    newType.setType(typeCallback(newType));
    return newType;
  }
  public static TypeLiteral(typeCallback: (currentType: TypeLiteral) => void) {
    const newType = new TypeLiteral();
    typeCallback(newType);
    return newType;
  }
  public static UnionType(types: Type[]) {
    return new UnionType(types);
  }
  public static Literal(literal: Literals) {
    return new Literal(literal);
  }
  public static ArrayType(elementType: Type) {
    return new ArrayType(elementType);
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
  public static TypeReference(referenceName: string) {
    return new TypeReference(referenceName);
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
  public static KeyOfKeyword(type: Type) {
    return new KeyOfKeyword(type);
  }
}

export default MantaStyle;
