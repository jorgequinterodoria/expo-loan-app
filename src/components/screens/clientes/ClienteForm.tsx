import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Dialogs } from "@nativescript/core";
import { databaseService } from "../../../services/DatabaseService";
import { validatePhone, validateName, validateAddress, formatPhoneNumber } from "../../../utils/validations";

interface FormData {
  nombreCompleto: string;
  telefono: string;
  direccion: string;
}

interface FormErrors {
  nombreCompleto?: string;
  telefono?: string;
  direccion?: string;
}

export function ClienteForm({ navigation, route }) {
  const [formData, setFormData] = React.useState<FormData>({
    nombreCompleto: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateName(formData.nombreCompleto)) {
      newErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!validatePhone(formData.telefono)) {
      newErrors.telefono = 'Ingrese un número de teléfono válido';
    }

    if (!validateAddress(formData.direccion)) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      await Dialogs.alert({
        title: 'Error de Validación',
        message: 'Por favor corrija los errores en el formulario',
        okButtonText: 'OK'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await databaseService.crearCliente({
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date()
      });

      await Dialogs.alert({
        title: 'Éxito',
        message: 'Cliente registrado correctamente',
        okButtonText: 'OK'
      });

      navigation.goBack();
    } catch (error) {
      await Dialogs.alert({
        title: 'Error',
        message: 'No se pudo registrar el cliente',
        okButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const result = await Dialogs.confirm({
      title: 'Confirmar',
      message: '¿Desea cancelar el registro?',
      okButtonText: 'Sí',
      cancelButtonText: 'No'
    });

    if (result) {
      navigation.goBack();
    }
  };

  return (
    <scrollView>
      <flexboxLayout style={styles.container}>
        <label className="text-2xl font-bold mb-6">Registro de Cliente</label>

        <stackLayout className="mb-4">
          <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
          <textField
            className={`p-2 border rounded-lg ${errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'}`}
            text={formData.nombreCompleto}
            onTextChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.value }))}
            hint="Ingrese nombre completo"
            isEnabled={!isSubmitting}
          />
          {errors.nombreCompleto && (
            <label className="text-red-500 text-sm">{errors.nombreCompleto}</label>
          )}
        </stackLayout>

        <stackLayout className="mb-4">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <textField
            className={`p-2 border rounded-lg ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
            text={formData.telefono}
            onTextChange={(e) => setFormData(prev => ({ 
              ...prev, 
              telefono: formatPhoneNumber(e.value)
            }))}
            hint="+XX XXXX-XXXX"
            keyboardType="phone"
            isEnabled={!isSubmitting}
          />
          {errors.telefono && (
            <label className="text-red-500 text-sm">{errors.telefono}</label>
          )}
        </stackLayout>

        <stackLayout className="mb-6">
          <label className="text-sm font-medium text-gray-700">Dirección</label>
          <textField
            className={`p-2 border rounded-lg ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
            text={formData.direccion}
            onTextChange={(e) => setFormData(prev => ({ ...prev, direccion: e.value }))}
            hint="Ingrese dirección completa"
            isEnabled={!isSubmitting}
          />
          {errors.direccion && (
            <label className="text-red-500 text-sm">{errors.direccion}</label>
          )}
        </stackLayout>

        <flexboxLayout className="mt-4 space-x-4">
          <button
            className="bg-blue-500 text-white p-4 rounded-lg flex-1"
            onTap={handleSubmit}
            isEnabled={!isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            className="bg-gray-500 text-white p-4 rounded-lg flex-1"
            onTap={handleCancel}
            isEnabled={!isSubmitting}
          >
            Cancelar
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