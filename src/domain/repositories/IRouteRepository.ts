import { Route } from '../entities/Route';

export interface IRouteRepository {
  findById(id: number): Promise<Route | null>;
  findAll(): Promise<Route[]>;
  save(route: Route): Promise<Route>;
}
