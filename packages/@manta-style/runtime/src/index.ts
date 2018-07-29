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
import { Type, Literals, Annotation } from './utils/baseType';

class MantaStyle {
  private static typeReferences: { [key: string]: TypeAliasDeclaration } = {};
  public static _registerType(name: string, type: TypeAliasDeclaration) {
    if (MantaStyle.typeReferences[name]) {
      throw new Error(`Type "${name}" has already been registered.`);
    } else {
      MantaStyle.typeReferences[name] = type;
    }
  }
  public static _referenceType(name: string): TypeAliasDeclaration {
    if (!MantaStyle.typeReferences[name]) {
      throw new Error(`Type "${name}" hasn't been registered yet.`);
    } else {
      return MantaStyle.typeReferences[name];
    }
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
