export type ShipmentStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
export type ProductType = 'electronica' | 'ropa' | 'alimentos' | 'documentos' | 'fragil' | 'peligroso';

export class Shipment {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly carrierId: number | null,
    public readonly routeId: number | null,
    public readonly weight: number,
    public readonly width: number,
    public readonly height: number,
    public readonly length: number,
    public readonly productType: ProductType,
    public readonly destAddress: string,
    public readonly destCity: string,
    public readonly destCountry: string,
    public readonly destZip: string,
    public readonly status: ShipmentStatus,
    public readonly createdAt: Date,
  ) {}

  get volumeM3(): number {
    return (this.width * this.height * this.length) / 1_000_000;
  }

  toPublic(): Omit<Shipment, 'toPublic'> {
    return {
      id: this.id,
      userId: this.userId,
      carrierId: this.carrierId,
      routeId: this.routeId,
      weight: this.weight,
      width: this.width,
      height: this.height,
      length: this.length,
      productType: this.productType,
      destAddress: this.destAddress,
      destCity: this.destCity,
      destCountry: this.destCountry,
      destZip: this.destZip,
      status: this.status,
      createdAt: this.createdAt,
      volumeM3: this.volumeM3,
    };
  }
}
