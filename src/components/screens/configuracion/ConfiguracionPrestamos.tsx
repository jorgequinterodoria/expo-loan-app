import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Dialogs } from "@nativescript/core";
import { databaseService } from "../../../services/DatabaseService";
import { ConfiguracionPrestamo, PeriodoPago } from "../../../models/Cliente";

export function ConfiguracionPrestamos() {
  const [tasasInteres, setTasasInteres] = React.useState<ConfiguracionPrestamo[]>([]);
  const [periodosPago, setPeriodosPago] = React.useState<PeriodoPago[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    cargarConfiguraciones();
  }, []);

  async function cargarConfiguraciones() {
    try {
      const [tasas, periodos] = await Promise.all([
        databaseService.obtenerConfiguracionesPrestamo(),
        databaseService.obtenerPeriodosPago()
      ]);
      
      setTasasInteres(tasas);
      setPeriodosPago(periodos);
    } catch (error) {
      await Dialogs.alert({
        title: "Error",
        message: "No se pudieron cargar las configuraciones",
        okButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function agregarTasaInteres() {
    const result = await Dialogs.prompt({
      title: "Nueva Tasa de Interés",
      message: "Ingrese el porcentaje y descripción",
      okButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      inputType: "decimal",
      defaultText: ""
    });

    if (result.result) {
      try {
        const nuevaTasa: ConfiguracionPrestamo = {
          id: Date.now().toString(),
          tasaInteres: parseFloat(result.text),
          descripcion: "Tasa estándar",
          estado: "activo"
        };

        await databaseService.crearConfiguracionPrestamo(nuevaTasa);
        await cargarConfiguraciones();
      } catch (error) {
        await Dialogs.alert({
          title: "Error",
          message: "No se pudo guardar la tasa de interés",
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

  return (
    <scrollView>
      <flexboxLayout style={styles.container}>
        <label className="text-2xl font-bold mb-6">Configuración de Préstamos</label>

        <stackLayout className="mb-6">
          <label className="text-xl font-semibold mb-4">Tasas de Interés</label>
          <button
            className="bg-blue-500 text-white p-4 rounded-lg mb-4"
            onTap={agregarTasaInteres}
          >
            Agregar Tasa
          </button>

          {tasasInteres.map(tasa => (
            <stackLayout key={tasa.id} className="bg-white p-4 rounded-lg mb-2">
              <label className="font-semibold">{tasa.tasaInteres}%</label>
              <label>{tasa.descripcion}</label>
              <label className={`${tasa.estado === 'activo' ? 'text-green-500' : 'text-red-500'}`}>
                {tasa.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </label>
            </stackLayout>
          ))}
        </stackLayout>

        <stackLayout>
          <label className="text-xl font-semibold mb-4">Períodos de Pago</label>
          
          {periodosPago.map(periodo => (
            <stackLayout key={periodo.id} className="bg-white p-4 rounded-lg mb-2">
              <label className="font-semibold">{periodo.nombre}</label>
              <label>{periodo.diasPeriodo} días</label>
              <label className={`${periodo.estado === 'activo' ? 'text-green-500' : 'text-red-500'}`}>
                {periodo.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </label>
            </stackLayout>
          ))}
        </stackLayout>
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