import TypeParameter from './TypeParameter';
import { Type, Annotation } from '../utils/baseType';
import { ErrorType } from '../utils/pseudoTypes';
import { findAnnotation, inheritAnnotations } from '../utils/annotation';
import { resolveReferencedType } from '../utils/referenceTypes';
import UnionType from '../types/UnionType';

export default class TypeAliasDeclaration extends Type {
  private readonly name: string;
  private typeParameters: TypeParameter[] = [];
  private type: Type = new ErrorType(
    `TypeAliasDeclaration "${this.name}" hasn't been initialized.`,
  );
  private readonly annotations: Annotation[];
  constructor(name: string, annotations: Annotation[]) {
    super();
    this.name = name;
    this.annotations = annotations;
  }
  public TypeParameter(name: string) {
    const newTypeParam = new TypeParameter(name);
    this.typeParameters.push(newTypeParam);
    return newTypeParam;
  }
  public argumentTypes(types: Type[]) {
    const preserveUnionType = findAnnotation('preserveUnion', this.annotations);
    for (let i = 0; i < types.length; i++) {
      const type = resolveReferencedType(types[i]);
      if (type instanceof UnionType && preserveUnionType) {
        this.typeParameters[i].setActualType(
          type.derivePreservedUnionLiteral(this.annotations),
        );
      } else {
        this.typeParameters[i].setActualType(
          type.deriveLiteral(this.annotations),
        );
      }
    }
    return this;
  }
  public setType(type: Type) {
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public deriveLiteral(parentAnnotations: Annotation[]) {
    const combinedAnnotations = inheritAnnotations(
      parentAnnotations,
      this.annotations,
    );
    return this.type.deriveLiteral(combinedAnnotations);
  }
}
