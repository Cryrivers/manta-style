import ArrayLiteral from './ArrayLiteral';
import { Annotation, annotationUtils, Type } from '@manta-style/core';
import { throwUnableToFormat } from '../utils/errorReporting';

export default class ArrayType extends Type {
  private elementType: Type;
  constructor(elementType: Type) {
    super();
    this.elementType = elementType;
  }
  public deriveLiteral(annotations: Annotation[]) {
    const array: Type[] = [];
    const lengthFromJSDoc = annotationUtils.getNumberFromAnnotationKey({
      key: 'length',
      precision: 0,
      annotations,
    });
    const length =
      typeof lengthFromJSDoc !== 'undefined'
        ? lengthFromJSDoc
        : Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < length; i++) {
      array.push(this.elementType.deriveLiteral(annotations));
    }
    return new ArrayLiteral(array);
  }
  public validate(value: unknown): value is any[] {
    return (
      Array.isArray(value) &&
      value.every((item) => this.elementType.validate(item))
    );
  }
  public format(value: unknown) {
    if (Array.isArray(value)) {
      return value.map((item) => this.elementType.format(item));
    }
    throwUnableToFormat({
      typeName: 'ArrayType',
      reason: 'The value is not an array.',
      inputValue: value,
    });
  }
}
