import { resolveReferencedType, LiteralType } from '@manta-style/runtime';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';
import { timeout } from '../utils/timeout';

export default class DelayType extends Type {
  private readonly type: Type;
  private readonly timeout: Type;
  constructor(type: Type, timeout: Type) {
    super();
    this.type = type;
    this.timeout = timeout;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const [{ type }, { type: timeoutType }] = await Promise.all([
      resolveReferencedType(this.type, context),
      resolveReferencedType(this.timeout, context),
    ]);
    const result = (await timeoutType.deriveLiteral(
      annotations,
      context,
    )).mock();
    if (typeof result === 'number') {
      await timeout(result);
    }
    return type.deriveLiteral(annotations, context);
  }
}
