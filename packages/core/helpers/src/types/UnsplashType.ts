import MantaStyle, { resolveReferencedType } from '@manta-style/runtime';
import { Annotation, MantaStyleContext, Type } from '@manta-style/core';

export default class UnsplashType extends Type {
  private readonly keyword: Type;
  private readonly width: Type;
  private readonly height: Type;
  constructor(keyword: Type, width: Type, height: Type) {
    super();
    this.keyword = keyword;
    this.width = width;
    this.height = height;
  }
  public async deriveLiteral(
    annotations: Annotation[],
    context: MantaStyleContext,
  ) {
    const [
      { type: keywordType },
      { type: widthType },
      { type: heightType },
    ] = await Promise.all([
      resolveReferencedType(this.keyword, context),
      resolveReferencedType(this.width, context),
      resolveReferencedType(this.height, context),
    ]);

    const [keyword, width, height] = (await Promise.all([
      keywordType.deriveLiteral(annotations, context),
      widthType.deriveLiteral(annotations, context),
      heightType.deriveLiteral(annotations, context),
    ])).map((itemType) => itemType.mock());

    return MantaStyle.Literal(
      `https://source.unsplash.com/${width}x${height}/?${keyword}`,
    );
  }
}
