import { Type } from '../utils/baseType';
import ArrayLiteral from './ArrayLiteral';
import OptionalType from './OptionalType';
import RestType from './RestType';

export default class TupleType extends Type {
  private elementTypes: Type[];
  constructor(elementTypes: Type[]) {
    super();
    this.elementTypes = elementTypes;
  }
  public deriveLiteral() {
    const arrayLiteral: Type[] = [];
    this.elementTypes.forEach((type) => {
      const chance = type instanceof OptionalType ? Math.random() : 1;
      if (chance > 0.5) {
        if (type instanceof RestType) {
          arrayLiteral.push(...type.deriveLiteral().getElements());
        } else {
          arrayLiteral.push(type.deriveLiteral());
        }
      }
    });
    return new ArrayLiteral(arrayLiteral);
  }
}
