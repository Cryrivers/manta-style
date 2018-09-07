export const enum ErrorCode {
  UNSUPPORTED_EXTENSION = 0,
  BUILDER_PLUGIN_ERROR = 1,
  MOCK_PLUGIN_ERROR = 2,
}

type ErrorDetail = {
  [ErrorCode.UNSUPPORTED_EXTENSION]: (extension: string) => string;
  [ErrorCode.BUILDER_PLUGIN_ERROR]: (
    builderName: string,
    errorMessage: string,
  ) => string;
  [ErrorCode.MOCK_PLUGIN_ERROR]: (
    mockerName: string,
    errorMessage: string,
  ) => string;
};

function errmsg(message: TemplateStringsArray, ...keys: string[]): string {
  let finalMessage = '';
  const normalizedMessage = message.map((str) => str.replace('"', "'"));
  const { length } = normalizedMessage;
  for (let i = 0; i < length; i++) {
    finalMessage += normalizedMessage[i];
    if (i < length - 1) {
      finalMessage += '"' + keys[i] + '"';
    }
  }
  return finalMessage;
}

const errorMessages: ErrorDetail = {
  [ErrorCode.UNSUPPORTED_EXTENSION]: (extension: string) =>
    errmsg`Extension ${extension} is not handled by any builder plugins.`,
  [ErrorCode.BUILDER_PLUGIN_ERROR]: (
    builderName: string,
    errorMessage: string,
  ) => ``,
  [ErrorCode.MOCK_PLUGIN_ERROR]: (mockerName: string, errorMessage: string) =>
    ``,
};

export function generateErrorMessage<T extends ErrorCode>(
  errorCode: T,
  ...args: ErrorDetail[T] extends (...args: infer R) => string ? R : []
) {
  // touch the limitation of TypeScript again, :facepalm:
  // @ts-ignore
  return `MS-${errorCode}: ${errorMessages[errorCode](...args)}`;
}

export function parseErrorMessage(
  message: string,
): { errorCode: ErrorCode; params: string[] } {
  // TODO: Implement this
  return { errorCode: 0, params: [] };
}
