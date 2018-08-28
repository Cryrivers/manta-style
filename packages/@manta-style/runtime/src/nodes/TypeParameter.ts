import { Annotation, Type, MantaStyleContext } from '../utils/baseType';
import { ErrorType } from '../utils/pseudoTypes';
import { isAssignable } from '../utils/assignable';

export default class TypeParameter extends Type {
  private readonly name: string;
  private actualType?: Type;
  private readonly constraintType?: Type;
  private readonly defaultType: Type;
  constructor(name: string, constraintType?: Type, defaultType?: Type) {
    super();
    this.name = name;
    this.constraintType = constraintType;
    this.defaultType =
      defaultType ||
      new ErrorType(
        `Generic type parameter "${name}" have not been initialized. `,
      );
  }
  public getTypeParameterName() {
    return this.name;
  }
  public async setActualType(type: Type, context: MantaStyleContext) {
    if (
      this.constraintType &&
      !(await isAssignable(type, this.constraintType, context))
    ) {
      throw Error(
        'Constraint is not satisfied. Please check the error message from TypeScript.',
      );
    }
    this.actualType = type;
  }
  public getActualType() {
    return this.actualType || this.defaultType;
  }
  public deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ) {
    return this.getActualType().deriveLiteral(parentAnnotations, context);
  }
}
