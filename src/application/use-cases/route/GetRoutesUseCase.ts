import { IRouteRepository } from '../../../domain/repositories/IRouteRepository';
import { Route } from '../../../domain/entities/Route';

export class GetRoutesUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(): Promise<Omit<Route, 'toPublic'>[]> {
    const routes = await this.routeRepository.findAll();
    return routes.map((r) => r.toPublic());
  }
}
