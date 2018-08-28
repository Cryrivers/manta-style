import { Type, Annotation, MantaStyleContext } from '../utils/baseType';
import { getNumberFromAnnotationKey } from '../utils/annotation';
import ArrayLiteral from './ArrayLiteral';

export default class ArrayType extends Type {
  private elementType: Type;
  constructor(elementType: Type) {
    super();
    this.elementType = elementType;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const array: Type[] = [];
    const lengthFromJSDoc = getNumberFromAnnotationKey({
      key: 'length',
      precision: 0,
      annotations,
    });
    const length =
      typeof lengthFromJSDoc !== 'undefined'
        ? lengthFromJSDoc
        : Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < length; i++) {
      array.push(await this.elementType.deriveLiteral(annotations, context));
    }
    return new ArrayLiteral(array);
  }
}
