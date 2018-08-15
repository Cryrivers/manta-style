import { getTranspiledString } from '../utils/transpiler';

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
  test('KeyOf', () => {
    expect(
      getTranspiledString(
        'type Keys = keyof { a:number, b:string, c: boolean };',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString(
        'type Obj = { a:number, b:string, c: boolean }; type Keys = keyof Obj;',
      ),
    ).toMatchSnapshot();
    expect(
      getTranspiledString('type Keys<T extends object> = keyof T;'),
    ).toMatchSnapshot();
  });
});
