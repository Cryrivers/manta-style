import { Literals } from '../utils/baseType';
import { Type, Fetcher } from '@manta-style/core';

export default class Literal<T extends Literals | Fetcher<any>> extends Type {
  private readonly literal: T;
  constructor(literal: T) {
    super();
    this.literal = literal;
  }
  public deriveLiteral() {
    return this;
  }
  public validate(value: unknown): value is T {
    return this.literal instanceof Fetcher
      ? value === this.literal.read()
      : value === this.literal;
  }
  public mock() {
    return this.literal instanceof Fetcher ? this.literal.read() : this.literal;
  }
  public format(value: unknown) {
    if (value == this.literal) {
      return this.literal;
    }
    throw new Error('Cannot format as the value cannot be validated.');
  }
}
