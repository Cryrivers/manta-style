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
  const errMessage = `${typeName} cannot be formatted.`;
  const errReason = ` Reason: ${
    reason ? reason : 'It cannot pass the loose validation.'
  }`;
  const errYourInput = ` Input: ${JSON.stringify(inputValue, undefined, 2)}`;
  const errExpectedValue = expectedValue
    ? ` Expected Value: ${JSON.stringify(expectedValue)}`
    : '';
  throw new Error(errMessage + errReason + errYourInput + errExpectedValue);
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
