import { parseAnnotationFromString } from '../src/index';

describe('Annotation', () => {
  test('simple', () => {
    expect(prettyParse('{{ plugin }}')).toMatchSnapshot();
    expect(prettyParse('{{ plugin "abc" 123 true }}')).toMatchSnapshot();
    expect(
      prettyParse('{{ plugin "abc" 123 true d="123" e=12 f=false }}'),
    ).toMatchSnapshot();
  });
  test('nested', () => {
    expect(prettyParse('{{ plugin "abc" nested }}')).toMatchSnapshot();
    expect(
      prettyParse('{{ plugin "abc" (nested "def") 123 }}'),
    ).toMatchSnapshot();
  });
});

function prettyParse(annotation: string) {
  return {
    FROM: annotation,
    TO: parseAnnotationFromString(annotation),
  };
}
