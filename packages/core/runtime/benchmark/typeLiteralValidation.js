// @ts-check
const { default: MS } = require('@manta-style/runtime');
const { PluginSystem } = require('@manta-style/core');
const prettyHrTime = require('pretty-hrtime');

const context = { query: {}, param: {}, plugins: PluginSystem.default() };

const HelperType = MS.TypeAliasDeclaration(
  'TestType',
  () =>
    MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.BooleanKeyword, false, []);
      currentType.property('b', MS.StringKeyword, false, []);
      currentType.property(
        'c',
        MS.UnionType([MS.NullKeyword, MS.StringKeyword]),
        false,
        [],
      );
      currentType.property('d', MS.BooleanKeyword, false, []);
      currentType.property('e', MS.BooleanKeyword, false, []);
    }),
  [],
);

const TestType = MS.TypeAliasDeclaration(
  'TestType',
  () =>
    MS.TypeLiteral((currentType) => {
      currentType.property('a', MS.NumberKeyword, false, []);
      currentType.property('b', HelperType, false, []);
      currentType.property('c', MS.NumberKeyword, false, []);
      currentType.property('d', HelperType, false, []);
      currentType.property('e', MS.NumberKeyword, false, []);
      currentType.property('f', HelperType, false, []);
    }),
  [],
);

async function benchmark() {
  const timeStart = process.hrtime();
  let result = false;
  for (let i = 0; i < 5000000; i++) {
    result = TestType.validate(
      {
        a: 134,
        b: { a: true, b: 'heiheihei', c: null, d: false, e: true },
        c: 495,
        d: { a: true, b: 'hoho', c: 'yes', d: true, e: true },
        e: 391,
        f: { a: true, b: 'zzz', c: 'elel', d: false, e: true },
      }
    );
  }
  const timeEnd = process.hrtime(timeStart);
  console.log(prettyHrTime(timeEnd), 'Result is', result);
  console.log(process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
}

benchmark();
