import MantaStyle from '../index';
import { Type } from '../utils/baseType';
import TypeAliasDeclaration from '../nodes/TypeAliasDeclaration';

export default class TypeReference extends Type {
  private referenceName: string;
  private referencedType?: TypeAliasDeclaration;
  private deferredArgumentedTypes: Type[] = [];
  constructor(referenceName: string) {
    super();
    this.referenceName = referenceName;
  }
  public argumentTypes(types: Type[]) {
    this.deferredArgumentedTypes = types;
    return this;
  }
  public deriveLiteral() {
    return this.getActualType().deriveLiteral();
  }
  public getActualType() {
    if (!this.referencedType || this.referenceName.startsWith('@@URLQuery/')) {
      this.referencedType = MantaStyle.referenceType(this.referenceName);
      this.referencedType.argumentTypes(this.deferredArgumentedTypes);
    } else {
      // Same as above line, but made TypeScript happy
      this.referencedType.argumentTypes(this.deferredArgumentedTypes);
    }
    return this.referencedType;
  }
}
