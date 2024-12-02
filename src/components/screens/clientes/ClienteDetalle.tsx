import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Dialogs } from "@nativescript/core";
import { databaseService } from "../../../services/DatabaseService";
import { Cliente } from "../../../models/Cliente";
import { Loan } from "../../../models/Loan";
import { format } from "date-fns";

export function ClienteDetalle({ route, navigation }) {
  const { clienteId } = route.params;
  const [cliente, setCliente] = React.useState<Cliente | null>(null);
  const [prestamos, setPrestamos] = React.useState<Loan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    cargarDatosCliente();
  }, [clienteId]);

  async function cargarDatosCliente() {
    try {
      const clienteData = await databaseService.obtenerClientePorId(clienteId);
      const prestamosData = await databaseService.obtenerPrestamosPorCliente(clienteId);
      
      setCliente(clienteData);
      setPrestamos(prestamosData);
    } catch (error) {
      await Dialogs.alert({
        title: "Error",
        message: "No se pudieron cargar los datos del cliente",
        okButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmarEliminarCliente() {
    const result = await Dialogs.confirm({
      title: "Confirmar Eliminación",
      message: "¿Está seguro que desea eliminar este cliente?",
      okButtonText: "Sí",
      cancelButtonText: "No"
    });

    if (result) {
      try {
        await databaseService.eliminarCliente(clienteId);
        navigation.goBack();
      } catch (error) {
        await Dialogs.alert({
          title: "Error",
          message: "No se pudo eliminar el cliente",
          okButtonText: "OK"
        });
      }
    }
  }

  if (isLoading) {
    return (
      <flexboxLayout style={styles.container}>
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  if (!cliente) {
    return (
      <flexboxLayout style={styles.container}>
        <label>Cliente no encontrado</label>
      </flexboxLayout>
    );
  }

  return (
    <scrollView>
      <flexboxLayout style={styles.container}>
        <label className="text-2xl font-bold mb-6">Detalle del Cliente</label>

        <stackLayout className="bg-white p-4 rounded-lg mb-6">
          <label className="text-lg font-semibold">{cliente.nombreCompleto}</label>
          <label>Teléfono: {cliente.telefono}</label>
          <label>Dirección: {cliente.direccion}</label>
          <label>Fecha de Registro: {format(new Date(cliente.fechaRegistro), 'dd/MM/yyyy')}</label>
        </stackLayout>

        <label className="text-xl font-bold mb-4">Préstamos Activos</label>
        
        {prestamos.map(prestamo => (
          <stackLayout key={prestamo.id} className="bg-white p-4 rounded-lg mb-4">
            <label className="font-semibold">Monto: ${prestamo.amount}</label>
            <label>Tasa: {prestamo.interestRate}%</label>
            <label>Estado: {prestamo.status === 'active' ? 'Activo' : 'Finalizado'}</label>
            <label>Próximo Pago: {format(new Date(prestamo.nextPaymentDate), 'dd/MM/yyyy')}</label>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-2"
              onTap={() => navigation.navigate("DetallePrestamo", { prestamoId: prestamo.id })}
            >
              Ver Detalle
            </button>
          </stackLayout>
        ))}

        <flexboxLayout className="mt-6 space-x-4">
          <button
            className="bg-blue-500 text-white p-4 rounded-lg flex-1"
            onTap={() => navigation.navigate("EditarCliente", { clienteId })}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white p-4 rounded-lg flex-1"
            onTap={confirmarEliminarCliente}
          >
            Eliminar
          </button>
        </flexboxLayout>
      </flexboxLayout>
    </scrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "column"
  }
});