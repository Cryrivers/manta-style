import getTranspiledString from '../src/utils/transpile';
import { BuilderPluginTestHelper } from '@manta-style/test-helpers';

const testTranspiledString = BuilderPluginTestHelper.testTranspiledString(
  getTranspiledString,
);

describe('Operators', () => {
  test('Unions', () => {
    expect(testTranspiledString('type Test = 1 | 2;')).toMatchSnapshot();
    expect(
      testTranspiledString('type Test<T,S> = T | S | 1 | 2;'),
    ).toMatchSnapshot();
  });
  test('Intersections', () => {
    expect(testTranspiledString('type Test = number & any;')).toMatchSnapshot();
    expect(
      testTranspiledString('type Test<T,S> = T & S & number;'),
    ).toMatchSnapshot();
  });
  test('Intersection and Union composed with brackets', () => {
    expect(
      testTranspiledString('type Test<T,S> = number & (1 | T | S)'),
    ).toMatchSnapshot();
  });
  test('$Keys', () => {
    expect(
      testTranspiledString(
        'type Keys = $Keys<{ a:number, b:string, c: boolean }>;',
      ),
    ).toMatchSnapshot();
    expect(
      testTranspiledString(
        'type Obj = { a:number, b:string, c: boolean }; type Keys = $Keys<Obj>;',
      ),
    ).toMatchSnapshot();
    expect(
      testTranspiledString('type Keys<T: Object> = $Keys<T>;'),
    ).toMatchSnapshot();
  });
  test('$Values', () => {
    expect(
      testTranspiledString(
        'type Values = $Values<{ a:number, b:string, c: boolean }>;',
      ),
    ).toMatchSnapshot();
    expect(
      testTranspiledString(
        'type Obj = { a:number, b:string, c: boolean }; type Values = $Values<Obj>;',
      ),
    ).toMatchSnapshot();
    expect(
      testTranspiledString('type Values<T: Object> = $Values<T>;'),
    ).toMatchSnapshot();
  });
  test('$PropertyType', () => {
    expect(
      testTranspiledString(
        "type Obj = { a:number, b:string, c: boolean }; type PropertyType = $PropertyType<Obj, 'b'>;",
      ),
    ).toMatchSnapshot();
  });
});
