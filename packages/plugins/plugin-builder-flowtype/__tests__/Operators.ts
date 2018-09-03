import getTranspiledString from '../src/utils/transpile';

describe('Operators', () => {
  test('Unions', () => {
    expect(getTranspiledString('type Test = 1 | 2;')).toMatchSnapshot();
    expect(
      getTranspiledString('type Test<T,S> = T | S | 1 | 2;'),
    ).toMatchSnapshot();
  });
  test('Intersections', () => {
    expect(getTranspiledString('type Test = number & any;')).toMatchSnapshot();
    expect(
      getTranspiledString('type Test<T,S> = T & S & number;'),
    ).toMatchSnapshot();
  });
  test('Intersection and Union composed with brackets', () => {
    expect(
      getTranspiledString('type Test<T,S> = number & (1 | T | S)'),
    ).toMatchSnapshot();
  });
  test('$Keys', () => {
    expect(
      getTranspiledString(
        'type Keys = $Keys<{ a:number, b:string, c: boolean }>;',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString(
        'type Obj = { a:number, b:string, c: boolean }; type Keys = $Keys<Obj>;',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString('type Keys<T: Object> = $Keys<T>;'),
    ).toMatchSnapshot();
  });
  test('$Values', () => {
    expect(
      getTranspiledString(
        'type Values = $Values<{ a:number, b:string, c: boolean }>;',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString(
        'type Obj = { a:number, b:string, c: boolean }; type Values = $Values<Obj>;',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString('type Values<T: Object> = $Values<T>;'),
    ).toMatchSnapshot();
  });
  test('$PropertyType', () => {
    expect(
      getTranspiledString(
        "type Obj = { a:number, b:string, c: boolean }; type PropertyType = $PropertyType<Obj, 'b'>;",
      ),
    ).toMatchSnapshot();
  });
});
