import jsdocParser from '../src/index';

describe('jsdocParser', () => {
  it('should parse jsdoc', () => {
    expect(
      jsdocParser(`
    @mantastyle {{ asdf asdf asdf }}
    @random foo "bar"
    @test 123 123 123
    `),
    ).toMatchSnapshot();

    expect(
      jsdocParser(`
    random message here too
    @multiline {{
      asdf 
      "asdf"
      1234
      "1234"
      (manta "rocks!" )
    }}
    random comment around
    `),
    ).toMatchSnapshot();

    expect(
      jsdocParser(`
    random message here too
    @multiline {{
      asdf 
      "asdf"
      1234
      "1234"
      (manta "rocks!" )
    }}

    @example qwer 
    Lorem Ipsum is simply dummy text of the printing and
     typesetting industry. Lorem Ipsum has been the industry
     's standard dummy text ever since the 1500s, 
     when an unknown printer took a galley of type
      and scrambled it to make a type specimen book. 
      It has survived not only five centuries, 


    `),
    ).toMatchSnapshot();
  });

  it('should work with empty strings too', () => {
    expect(jsdocParser('')).toMatchSnapshot();
    expect(
      jsdocParser(`
    
    
    
    `),
    ).toMatchSnapshot();
  });
});
