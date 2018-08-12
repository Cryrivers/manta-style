import MantaStyle from '../index';
import { Annotation, Type } from '../utils/baseType';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';
import { ReservedTypePrefix } from '@manta-style/consts';

export default class TypeReference extends Type {
  private readonly referenceName: string;
  private referencedType?: TypeAliasDeclaration;
  private typeParameters: Type[] = [];
  constructor(referenceName: string) {
    super();
    this.referenceName = referenceName;
  }
  public argumentTypes(actualTypes: Type[]) {
    this.typeParameters = actualTypes;
    return this;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    return this.getActualType().deriveLiteral(parentAnnotations);
  }
  public getActualType() {
    if (
      !this.referencedType ||
      this.referenceName.startsWith(ReservedTypePrefix.URLQuery)
    ) {
      this.referencedType = MantaStyle.referenceType(this.referenceName);
      this.referencedType.argumentTypes(this.typeParameters);
    } else {
      // Same as above line, but made TypeScript happy
      this.referencedType.argumentTypes(this.typeParameters);
    }
    return this.referencedType;
  }
}
