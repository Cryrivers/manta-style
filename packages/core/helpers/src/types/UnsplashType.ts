import MantaStyle, { resolveReferencedType } from '@manta-style/runtime';
import { Annotation, Type, CustomType } from '@manta-style/core';

const UNSPLASH_PREFIX = 'https://source.unsplash.com';

export default class UnsplashType extends CustomType {
  private readonly keyword: Type;
  private readonly width: Type;
  private readonly height: Type;
  constructor(keyword: Type, width: Type, height: Type) {
    super();
    this.keyword = keyword;
    this.width = width;
    this.height = height;
  }
  public typeForAssignabilityTest() {
    return MantaStyle.StringKeyword;
  }
  public validate(value: unknown): value is any {
    return typeof value === 'string' && value.startsWith(UNSPLASH_PREFIX);
  }
  public format(value: unknown) {
    if (this.validate(value)) {
      return value;
    } else {
      return this.deriveLiteral([]).mock();
    }
  }
  public deriveLiteral(annotations: Annotation[]) {
    const [{ type: keywordType }, { type: widthType }, { type: heightType }] = [
      resolveReferencedType(this.keyword),
      resolveReferencedType(this.width),
      resolveReferencedType(this.height),
    ];

    const [keyword, width, height] = [
      keywordType.deriveLiteral(annotations),
      widthType.deriveLiteral(annotations),
      heightType.deriveLiteral(annotations),
    ].map((itemType) => itemType.mock());

    return MantaStyle.Literal(
      `${UNSPLASH_PREFIX}/${width}x${height}/?${keyword}`,
    );
  }
}
