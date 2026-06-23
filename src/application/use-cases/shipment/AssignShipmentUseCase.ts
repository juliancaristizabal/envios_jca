import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { IRouteRepository } from '../../../domain/repositories/IRouteRepository';
import { Shipment } from '../../../domain/entities/Shipment';
import { AssignShipmentDto } from '../../dtos/ShipmentDto';
import { AppError } from '../../../shared/errors/AppError';

export class AssignShipmentUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly carrierRepository: ICarrierRepository,
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(shipmentId: number, dto: AssignShipmentDto): Promise<Omit<Shipment, 'toPublic'>> {
    // Validaciones de existencia fuera de la transacción (lecturas baratas sin lock)
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) throw new AppError('Envío no encontrado', 404);
    if (shipment.status !== 'pending') {
      throw new AppError('Solo se pueden asignar envíos en estado pendiente', 400);
    }

    const carrier = await this.carrierRepository.findById(dto.carrierId);
    if (!carrier) throw new AppError('Transportista no encontrado', 404);

    const route = await this.routeRepository.findById(dto.routeId);
    if (!route) throw new AppError('Ruta no encontrada', 404);

    // La validación de capacidad y la asignación ocurren dentro de una
    // transacción con FOR UPDATE para evitar condiciones de carrera
    const updated = await this.shipmentRepository.assignWithLock(
      shipmentId,
      dto.carrierId,
      dto.routeId,
      shipment.weight,
      shipment.volumeM3,
    );

    return updated.toPublic();
  }
}
