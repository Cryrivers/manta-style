import TypeAliasDeclaration from './TypeAliasDeclaration';
import { Type, Annotation } from '../utils/baseType';

export default class LazyTypeAliasDeclaration extends Type {
  private initializeFn?: () => TypeAliasDeclaration;
  private typeAliasDeclarationInstance?: TypeAliasDeclaration;
  private name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
  public setInitialize(initializeFn: () => TypeAliasDeclaration) {
    this.initializeFn = initializeFn;
  }
  public initialize(): TypeAliasDeclaration {
    if (!this.initializeFn) {
      throw new Error(`${this.name} no initialize fn`);
    } else if (this.typeAliasDeclarationInstance) {
      return this.typeAliasDeclarationInstance;
    }
    return (this.typeAliasDeclarationInstance = this.initializeFn());
  }

  public deriveLiteral(parentAnnotations: Annotation[]): Type {
    return this.initialize().deriveLiteral(parentAnnotations);
  }

  public mock(): any {
    return this.initialize().mock();
  }

  public argumentTypes(types: Type[]) {
    this.initialize().argumentTypes(types);
    return this;
  }

  public getType() {
    return this.initialize().getType();
  }

  public getAnnotations() {
    return this.initialize().getAnnotations();
  }
}
