import {
  MantaStyleAnnotation,
  MantaStyleContext,
  Type,
} from '@manta-style/core';
import TypeLiteral from './TypeLiteral';

export default class Shape extends Type {
  private type: Type;
  constructor(type: Type) {
    super();
    this.type = type;
  }
  public async deriveLiteral(
    annotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const type = await this.type.deriveLiteral(annotations, context);
    if (type instanceof TypeLiteral) {
      const returnType = new TypeLiteral();
      for (const property of type._getProperties()) {
        returnType.property(
          property.name,
          property.type,
          true,
          property.annotations,
        );
      }
      for (const property of type._getComputedProperties()) {
        returnType.computedProperty(
          property.name,
          property.keyType,
          property.type,
          property.operator,
          true,
          property.annotations,
        );
      }
      return returnType;
    }
    return type;
  }
}
