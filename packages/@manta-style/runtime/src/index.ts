import { Type, Literals } from "./utils";
import NumberKeyword from "./types/NumberKeyword";
import BooleanKeyword from "./types/BooleanKeyword";
import UndefinedKeyword from "./types/UndefinedKeyword";
import NullKeyword from "./types/NullKeyword";
import TypeLiteral from "./types/TypeLiteral";
import ArrayType from "./types/ArrayType";
import LiteralType from "./types/LiteralType";
import UnionType from "./types/UnionType";
import AnyKeyword from "./types/AnyKeyword";
import NeverKeyword from "./types/NeverKeyword";
import StringKeyword from "./types/StringKeyword";

class MantaStyle {
  public static TypeLiteral(typeCallback: (currentType: TypeLiteral) => void) {
    const newType = new TypeLiteral();
    typeCallback(newType);
    return newType;
  }
  public static UnionType(types: Type[]) {
    return new UnionType(types);
  }
  public static LiteralType(literal: Literals) {
    return new LiteralType(literal);
  }
  public static ArrayType(elementType: Type) {
    return new ArrayType(elementType);
  }
  public static NumberKeyword = new NumberKeyword();
  public static BooleanKeyword = new BooleanKeyword();
  public static StringKeyword = new StringKeyword();
  public static NeverKeyword = new NeverKeyword();
  public static NullKeyword = new NullKeyword();
  public static UndefinedKeyword = new UndefinedKeyword();
  public static AnyKeyword = new AnyKeyword();

  public static KeyOfKeyword(type: TypeLiteral) {
    const keys = type.getKeys();
    return new UnionType(keys.map(key => new LiteralType(key)));
  }
}

export default MantaStyle;
