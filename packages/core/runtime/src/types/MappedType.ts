import TypeParameter from '../nodes/TypeParameter';
import { ErrorType } from '../utils/pseudoTypes';
import { QuestionToken } from '../utils/baseType';
import Literal from './Literal';
import TypeLiteral from './TypeLiteral';
import { resolveReferencedType } from '../utils/referenceTypes';
import UnionType from './UnionType';
import IndexedAccessType from './IndexedAccessType';
import { Annotation, Type } from '@manta-style/core';
import { throwUnsupported } from '../utils/errorReporting';

const ErrType = new ErrorType("MappedType hasn't been initialized");

function modifyQuestionMark(
  questionToken: QuestionToken,
  originalValue: boolean = false,
): boolean {
  return questionToken === QuestionToken.QuestionToken
    ? true
    : questionToken === QuestionToken.MinusToken
      ? false
      : originalValue;
}
export default class MappedType extends Type {
  private typeParameter: Type = ErrType;
  private type: Type = ErrType;
  private constraint: Type = ErrType;
  private questionToken: QuestionToken = QuestionToken.None;
  public deriveLiteral(parentAnnotations: Annotation[]) {
    /**
     * type X = {
     *  [typeParameter in constraint]: type
     * }
     */
    const { typeParameter } = this;
    const { type: constraint } = resolveReferencedType(this.constraint);
    const { type } = resolveReferencedType(this.type);
    const newTypeLiteral = new TypeLiteral();
    if (
      (constraint instanceof UnionType || constraint instanceof Literal) &&
      typeParameter instanceof TypeParameter
    ) {
      const unionKeyTypes =
        constraint instanceof UnionType
          ? constraint.derivePreservedUnionLiteral(parentAnnotations).getTypes()
          : [constraint];

      for (const keyType of unionKeyTypes) {
        let finalTypeForThisProperty: Type = ErrType;
        let originalQuestionMark = false;
        let literalKeyType = keyType.deriveLiteral(parentAnnotations);
        typeParameter.setActualType(literalKeyType);
        if (type instanceof IndexedAccessType) {
          const property = type.getProperty();
          if (property) {
            originalQuestionMark = property.questionMark;
            finalTypeForThisProperty = property.type;
          } else {
            throw Error(`Property ${literalKeyType.mock()} doesn't exist`);
          }
        } else {
          finalTypeForThisProperty = type;
        }
        newTypeLiteral.property(
          keyType.mock(),
          finalTypeForThisProperty,
          modifyQuestionMark(this.questionToken, originalQuestionMark),
          [],
        );
      }
      return newTypeLiteral.deriveLiteral(parentAnnotations);
    } else {
      throw Error(
        'Constraint other than UnionType and Literal in MappedType is not supported yet',
      );
    }
  }
  public validate(value: any): value is any {
    return throwUnsupported({
      typeName: 'MappedType',
      message: 'validate() is not supported yet.',
    });
  }
  public format(value: unknown) {
    throwUnsupported({
      typeName: 'MappedType',
      message: 'format() is not supported yet.',
    });
  }
  public TypeParameter(name: string) {
    const newTypeParam = new TypeParameter(name);
    this.typeParameter = newTypeParam;
    return newTypeParam;
  }
  public setConstraint(type: Type) {
    this.constraint = type;
  }
  public setType(type: Type) {
    this.type = type;
  }
  public setQuestionToken(token: QuestionToken) {
    this.questionToken = token;
  }
}
