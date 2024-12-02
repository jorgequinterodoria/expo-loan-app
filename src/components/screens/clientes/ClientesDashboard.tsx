import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { databaseService } from "../../../services/DatabaseService";
import { openUrl } from "@nativescript/core/utils";

export function ClientesDashboard({ navigation }) {
    const [clientes, setClientes] = React.useState([]);
    const [paginaActual, setPaginaActual] = React.useState(1);
    const [terminoBusqueda, setTerminoBusqueda] = React.useState("");
    const clientesPorPagina = 10;

    React.useEffect(() => {
        cargarClientes();
    }, [paginaActual]);

    async function cargarClientes() {
        if (terminoBusqueda) {
            const resultados = await databaseService.buscarClientes(terminoBusqueda);
            setClientes(resultados);
        } else {
            const resultados = await databaseService.obtenerClientes(paginaActual, clientesPorPagina);
            setClientes(resultados);
        }
    }

    function abrirWhatsApp(telefono: string) {
        const numeroFormateado = telefono.replace(/\D/g, '');
        openUrl(`https://api.whatsapp.com/send?phone=${numeroFormateado}`);
    }

    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <button
                    className="bg-blue-500 text-white p-4 rounded-lg mb-4"
                    onTap={() => navigation.navigate("NuevoCliente")}
                >
                    Nuevo Cliente
                </button>

                <textField
                    hint="Buscar clientes..."
                    text={terminoBusqueda}
                    onTextChange={(e) => {
                        setTerminoBusqueda(e.value);
                        cargarClientes();
                    }}
                    className="p-2 border rounded-lg mb-4"
                />

                {clientes.map((cliente) => (
                    <flexboxLayout
                        key={cliente.id}
                        className="bg-white p-4 rounded-lg mb-4 w-full"
                    >
                        <label className="text-lg font-semibold">
                            {cliente.nombreCompleto}
                        </label>
                        <label>{cliente.telefono}</label>
                        
                        <flexboxLayout className="mt-2">
                            <button
                                className="bg-green-500 text-white p-2 rounded mr-2"
                                onTap={() => abrirWhatsApp(cliente.telefono)}
                            >
                                WhatsApp
                            </button>
                            <button
                                className="bg-blue-500 text-white p-2 rounded"
                                onTap={() => navigation.navigate("DetalleCliente", { clienteId: cliente.id })}
                            >
                                Ver Detalle
                            </button>
                        </flexboxLayout>
                    </flexboxLayout>
                ))}

                <flexboxLayout className="mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded mr-2"
                        onTap={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                        isEnabled={paginaActual > 1}
                    >
                        Anterior
                    </button>
                    <button
                        className="bg-gray-500 text-white p-2 rounded"
                        onTap={() => setPaginaActual(prev => prev + 1)}
                        isEnabled={clientes.length === clientesPorPagina}
                    >
                        Siguiente
                    </button>
                </flexboxLayout>
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column",
    }
});