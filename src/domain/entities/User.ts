export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
  ) {}

  toPublic(): Omit<User, 'password' | 'toPublic'> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
