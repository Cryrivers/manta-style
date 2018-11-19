import { resolveReferencedType } from '@manta-style/runtime';
import {
  Annotation,
  MantaStyleContext,
  Type,
  CustomType,
} from '@manta-style/core';
import { timeout } from '../utils/timeout';

export default class DelayType extends CustomType {
  private readonly type: Type;
  private readonly timeout: Type;
  constructor(type: Type, timeout: Type) {
    super();
    this.type = type;
    this.timeout = timeout;
  }
  private async delayDeriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
    dryrun: boolean,
  ) {
    const [{ type }, { type: timeoutType }] = await Promise.all([
      resolveReferencedType(this.type, context),
      resolveReferencedType(this.timeout, context),
    ]);
    const result = (await timeoutType.deriveLiteral(
      annotations,
      context,
    )).mock();
    if (typeof result === 'number' && !dryrun) {
      await timeout(result);
    }
    return type.deriveLiteral(annotations, context);
  }
  public validate(value: unknown, context: MantaStyleContext) {
    return this.type.validate(value, context);
  }
  public typeForAssignabilityTest(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    return this.delayDeriveLiteral(annotations, context, true);
  }
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    return this.delayDeriveLiteral(annotations, context, false);
  }
}
