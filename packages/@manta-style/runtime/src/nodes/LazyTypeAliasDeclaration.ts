import TypeAliasDeclaration from './TypeAliasDeclaration';
import { Type, Annotation } from '../utils/baseType';

export default class LazyTypeAliasDeclaration extends TypeAliasDeclaration {
  private initializer: (currentType: TypeAliasDeclaration) => Type = () =>
    this.type;
  private initialized: boolean;

  constructor(name: string, annotations: Annotation[]) {
    super(name, annotations);
    this.initialized = false;
  }

  public setInitialize(
    initializer: (currentType: TypeAliasDeclaration) => Type,
  ) {
    this.initializer = initializer;
  }

  public initialize() {
    if (!this.initialized) {
      this.setType(this.initializer(this));
      this.initialized = true;
    }
  }

  public getType() {
    this.initialize();
    return super.getType();
  }

  public getAnnotations() {
    this.initialize();
    return super.getAnnotations();
  }

  public async deriveLiteral(parentAnnotations: Annotation[]): Promise<Type> {
    this.initialize();
    return super.deriveLiteral(parentAnnotations);
  }

  public argumentTypes(types: Type[]) {
    // need to create a different instance of TypeAliasDeclaration
    // for each call of argumentTypes(...);
    const typeAliasImplementation = new TypeAliasDeclaration(
      this.name,
      this.annotations,
    );
    typeAliasImplementation.setType(this.initializer(typeAliasImplementation));
    typeAliasImplementation.argumentTypes(types);
    return typeAliasImplementation;
  }
}
