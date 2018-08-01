import { Type } from '../utils/baseType';
import { ErrorType } from '../utils/pseudoTypes';
import { isAssignable } from '../utils/assignable';

export default class TypeParameter extends Type {
  private name: string;
  private actualType?: Type;
  private contraintType?: Type;
  private defaultType: Type;
  constructor(name: string, constraintType?: Type, defaultType?: Type) {
    super();
    this.name = name;
    this.contraintType = constraintType;
    this.defaultType =
      defaultType ||
      new ErrorType(
        `Generic type parameter "${name}" have not been initialized. `,
      );
  }
  public getTypeParameterName() {
    return this.name;
  }
  public setActualType(type: Type) {
    if (this.contraintType && !isAssignable(type, this.contraintType)) {
      throw Error(
        'Constraint is not satisfied. Please check the error message from TypeScript.',
      );
    }
    this.actualType = type;
  }
  public getActualType() {
    return this.actualType || this.defaultType;
  }
  public deriveLiteral() {
    return this.getActualType().deriveLiteral();
  }
}
