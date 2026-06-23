import { Response } from 'express';

type SseClient = { shipmentId: number; res: Response };

class SseService {
  private clients: SseClient[] = [];

  addClient(shipmentId: number, res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.clients.push({ shipmentId, res });

    // Cuando el cliente cierra la conexión se elimina de la lista
    res.on('close', () => {
      this.clients = this.clients.filter((c) => c.res !== res);
    });
  }

  emit(shipmentId: number, data: object): void {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    this.clients
      .filter((c) => c.shipmentId === shipmentId)
      .forEach((c) => c.res.write(payload));
  }
}

export const sseService = new SseService();
