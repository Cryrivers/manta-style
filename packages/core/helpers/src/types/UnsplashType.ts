import MantaStyle, { resolveReferencedType } from '@manta-style/runtime';
import {
  Annotation,
  MantaStyleContext,
  Type,
  CustomType,
} from '@manta-style/core';

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
  public deriveLiteral(annotations: Annotation[], context: MantaStyleContext) {
    const [{ type: keywordType }, { type: widthType }, { type: heightType }] = [
      resolveReferencedType(this.keyword, context),
      resolveReferencedType(this.width, context),
      resolveReferencedType(this.height, context),
    ];

    const [keyword, width, height] = [
      keywordType.deriveLiteral(annotations, context),
      widthType.deriveLiteral(annotations, context),
      heightType.deriveLiteral(annotations, context),
    ].map((itemType) => itemType.mock());

    return MantaStyle.Literal(
      `${UNSPLASH_PREFIX}/${width}x${height}/?${keyword}`,
    );
  }
}
