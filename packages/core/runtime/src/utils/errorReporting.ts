const DEFAULT_UNABLE_TO_FORMAT_REASON = 'It cannot pass the loose validation.';

export class UnableToFormatError extends Error {
  private typeName: string;
  private inputValue: any;
  private reason?: string;
  private expectedValue?: any;
  constructor(
    typeName: string,
    inputValue: any,
    reason?: string,
    expectedValue?: any,
  ) {
    const errMessage = `${typeName} cannot be formatted.`;
    const errReason = ` [Reason] ${
      reason ? reason : DEFAULT_UNABLE_TO_FORMAT_REASON
    }`;
    const errYourInput = ` [Input] ${JSON.stringify(inputValue, undefined, 2)}`;
    const errExpectedValue = expectedValue
      ? ` [Expected Value] ${JSON.stringify(expectedValue)}`
      : '';

    super(errMessage + errReason + errYourInput + errExpectedValue);

    this.typeName = typeName;
    this.inputValue = inputValue;
    this.reason = reason;
    this.expectedValue = expectedValue;
  }
  public getTypeName() {
    return this.typeName;
  }
  public getInputValue() {
    return this.inputValue;
  }
  public getReason() {
    return this.reason || DEFAULT_UNABLE_TO_FORMAT_REASON;
  }
  public getExpectedValue() {
    return this.expectedValue;
  }
}
export function throwUnableToFormat({
  typeName,
  inputValue,
  reason,
  expectedValue,
}: {
  typeName: string;
  inputValue: any;
  reason?: string;
  expectedValue?: any;
}): never {
  throw new UnableToFormatError(typeName, inputValue, reason, expectedValue);
}

export function throwUnsupported({
  typeName,
  message,
}: {
  typeName: string;
  message: string;
}): never {
  throw new Error(`${typeName}: Unsupport Features. ${message}`);
}
