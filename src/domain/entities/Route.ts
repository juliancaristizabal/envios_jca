export class Route {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly originCity: string,
    public readonly destinationCity: string,
    public readonly estimatedDays: number,
    public readonly createdAt: Date,
  ) {}

  toPublic(): Omit<Route, 'toPublic'> {
    return {
      id: this.id,
      name: this.name,
      originCity: this.originCity,
      destinationCity: this.destinationCity,
      estimatedDays: this.estimatedDays,
      createdAt: this.createdAt,
    };
  }
}
