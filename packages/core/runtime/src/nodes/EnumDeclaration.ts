import { sample } from 'lodash-es';
import { Type, Annotation } from '@manta-style/core';
import Literal from '../types/Literal';
import { Literals } from '../utils/baseType';
import MS from '..';
import UnionType from '../types/UnionType';

export default class EnumDeclaration extends Type {
  private enums: { [key: string]: Literals };
  constructor(enums: { [key: string]: any }) {
    super();
    this.enums = enums;
  }
  public getValueByKey(key: string) {
    return this.enums[key];
  }
  public getLiteralByKey(key: string) {
    return new Literal(this.getValueByKey(key));
  }
  public deriveLiteral() {
    const value = sample(Object.values(this.enums));
    if (value) {
      return new Literal(value);
    } else {
      return MS.NeverKeyword;
    }
  }
  public validate(value: unknown): value is any {
    return Object.values(this.enums).includes(value as Literals);
  }
  public format(value: unknown) {
    return new UnionType(
      Object.values(this.enums).map((item) => new Literal(item)),
    ).format(value);
  }
}
