export function add(a: number, b: number) {
  return a + b;
}

export function round(num: number) {
  return Math.floor(num);
}

export function max(values: number[]) {
  return values.reduce((prevValue, currentValue) =>
    Math.max(prevValue, currentValue),
  );
}

export function min(values: number[]) {
  return values.reduce((prevValue, currentValue) =>
    Math.min(prevValue, currentValue),
  );
}

export function sample<T>(values: T[]) {
  return values[0];
}
