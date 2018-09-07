import TypeParameter from './TypeParameter';
import {
  MantaStyleAnnotation,
  MantaStyleContext,
  Type,
} from '@manta-style/core';
import { ErrorType } from '../utils/pseudoTypes';
import { resolveReferencedType } from '../utils/referenceTypes';
import UnionType from '../types/UnionType';

export default class TypeAliasDeclaration extends Type {
  protected readonly name: string;
  protected readonly annotations: MantaStyleAnnotation;
  protected readonly preserveUnion: boolean;

  private typeParameterTypes: Type[] = [];
  private typeParameters: TypeParameter[] = [];
  protected type: Type = new ErrorType(
    `TypeAliasDeclaration "${this.name}" hasn't been initialized.`,
  );
  constructor(
    name: string,
    annotations: MantaStyleAnnotation,
    preserveUnion: boolean,
  ) {
    super();
    this.name = name;
    this.annotations = annotations;
    this.preserveUnion = preserveUnion;
  }
  public TypeParameter(name: string) {
    const newTypeParam = new TypeParameter(name);
    this.typeParameters.push(newTypeParam);
    return newTypeParam;
  }
  public argumentTypes(types: Type[]): TypeAliasDeclaration {
    this.typeParameterTypes = types;
    return this;
  }
  public setType(type: Type) {
    this.type = type;
  }
  public getType() {
    return this.type;
  }
  public getAnnotations() {
    return this.annotations;
  }
  public async deriveLiteral(
    parentAnnotations: MantaStyleAnnotation,
    context: MantaStyleContext,
  ) {
    const combinedAnnotations = this.annotations.inherit(parentAnnotations);
    // Set actual type of type parameters
    for (let i = 0; i < this.typeParameterTypes.length; i++) {
      const { type, annotations } = await resolveReferencedType(
        this.typeParameterTypes[i],
        context,
      );
      const mergedAnnotations = this.annotations.inherit(combinedAnnotations);
      if (type instanceof UnionType && this.preserveUnion) {
        await this.typeParameters[i].setActualType(
          await type.derivePreservedUnionLiteral(mergedAnnotations, context),
          context,
        );
      } else {
        await this.typeParameters[i].setActualType(
          await type.deriveLiteral(mergedAnnotations, context),
          context,
        );
      }
    }
    return this.type.deriveLiteral(combinedAnnotations, context);
  }
}
