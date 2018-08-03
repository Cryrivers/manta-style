import { Type } from '../utils/baseType';
import TypeLiteral from './TypeLiteral';

export default class ObjectKeyword extends Type {
  public deriveLiteral() {
    return new TypeLiteral();
  }
}
