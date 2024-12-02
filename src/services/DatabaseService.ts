import { Sqlite } from '@nativescript/sqlite';
import { Cliente, ConfiguracionPrestamo, PeriodoPago } from '../models/Cliente';
import { Loan, Payment } from '../models/Loan';

export class DatabaseService {
  private db: Sqlite;

  constructor() {
    this.db = new Sqlite('loans.db');
    this.initDatabase();
  }

  private async initDatabase() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        nombreCompleto TEXT NOT NULL,
        telefono TEXT NOT NULL,
        direccion TEXT NOT NULL,
        fechaRegistro TEXT NOT NULL
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS configuracion_prestamos (
        id TEXT PRIMARY KEY,
        tasaInteres REAL NOT NULL,
        descripcion TEXT NOT NULL,
        estado TEXT NOT NULL
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS periodos_pago (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        diasPeriodo INTEGER NOT NULL,
        estado TEXT NOT NULL
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS prestamos (
        id TEXT PRIMARY KEY,
        clienteId TEXT NOT NULL,
        monto REAL NOT NULL,
        tasaInteres REAL NOT NULL,
        fechaInicio TEXT NOT NULL,
        fechaFin TEXT NOT NULL,
        tipo TEXT NOT NULL,
        estado TEXT NOT NULL,
        frecuenciaPago TEXT NOT NULL,
        saldoPendiente REAL NOT NULL,
        fechaProximoPago TEXT NOT NULL,
        FOREIGN KEY (clienteId) REFERENCES clientes(id)
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS pagos (
        id TEXT PRIMARY KEY,
        prestamoId TEXT NOT NULL,
        clienteId TEXT NOT NULL,
        monto REAL NOT NULL,
        fecha TEXT NOT NULL,
        notas TEXT,
        FOREIGN KEY (prestamoId) REFERENCES prestamos(id),
        FOREIGN KEY (clienteId) REFERENCES clientes(id)
      )
    `);
  }

  // Métodos para Clientes
  async crearCliente(cliente: Cliente): Promise<void> {
    const query = `
      INSERT INTO clientes (id, nombreCompleto, telefono, direccion, fechaRegistro)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await this.db.execute(query, [
      cliente.id,
      cliente.nombreCompleto,
      cliente.telefono,
      cliente.direccion,
      cliente.fechaRegistro.toISOString()
    ]);
  }

  async obtenerClientePorId(id: string): Promise<Cliente | null> {
    const results = await this.db.select(
      'SELECT * FROM clientes WHERE id = ?',
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async obtenerClientes(pagina: number, porPagina: number): Promise<Cliente[]> {
    const offset = (pagina - 1) * porPagina;
    return await this.db.select(
      'SELECT * FROM clientes LIMIT ? OFFSET ?',
      [porPagina, offset]
    );
  }

  async buscarClientes(termino: string): Promise<Cliente[]> {
    return await this.db.select(
      'SELECT * FROM clientes WHERE nombreCompleto LIKE ? OR telefono LIKE ?',
      [`%${termino}%`, `%${termino}%`]
    );
  }

  async eliminarCliente(id: string): Promise<void> {
    await this.db.execute('DELETE FROM clientes WHERE id = ?', [id]);
  }

  // Métodos para Préstamos
  async obtenerPrestamosPorCliente(clienteId: string): Promise<Loan[]> {
    return await this.db.select(
      'SELECT * FROM prestamos WHERE clienteId = ? ORDER BY fechaInicio DESC',
      [clienteId]
    );
  }

  async getActiveLoans(): Promise<Loan[]> {
    return await this.db.select(
      'SELECT * FROM prestamos WHERE estado = "active" ORDER BY fechaProximoPago ASC'
    );
  }

  // Métodos para Configuración de Préstamos
  async crearConfiguracionPrestamo(config: ConfiguracionPrestamo): Promise<void> {
    const query = `
      INSERT INTO configuracion_prestamos (id, tasaInteres, descripcion, estado)
      VALUES (?, ?, ?, ?)
    `;
    
    await this.db.execute(query, [
      config.id,
      config.tasaInteres,
      config.descripcion,
      config.estado
    ]);
  }

  async obtenerConfiguracionesPrestamo(): Promise<ConfiguracionPrestamo[]> {
    return await this.db.select('SELECT * FROM configuracion_prestamos');
  }

  async obtenerPeriodosPago(): Promise<PeriodoPago[]> {
    return await this.db.select('SELECT * FROM periodos_pago');
  }
}

export const databaseService = new DatabaseService();