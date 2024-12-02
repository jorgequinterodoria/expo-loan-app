export interface Cliente {
  id: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  fechaRegistro: Date;
}

export interface ConfiguracionPrestamo {
  id: string;
  tasaInteres: number;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}

export interface PeriodoPago {
  id: string;
  nombre: 'semanal' | 'quincenal' | 'mensual' | 'bimensual';
  diasPeriodo: number;
  estado: 'activo' | 'inactivo';
}