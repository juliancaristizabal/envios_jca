import { IRouteRepository } from '../../../domain/repositories/IRouteRepository';
import { Route } from '../../../domain/entities/Route';
import { CreateRouteDto } from '../../dtos/RouteDto';

export class CreateRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(dto: CreateRouteDto): Promise<Omit<Route, 'toPublic'>> {
    const route = await this.routeRepository.save(
      new Route(0, dto.name, dto.originCity, dto.destinationCity, dto.estimatedDays, new Date()),
    );
    return route.toPublic();
  }
}
