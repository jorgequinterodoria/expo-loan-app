import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { ClientesDashboard } from "./screens/clientes/ClientesDashboard";
import { ClienteForm } from "./screens/clientes/ClienteForm";
import { ClienteDetalle } from "./screens/clientes/ClienteDetalle";
import { ConfiguracionPrestamos } from "./screens/configuracion/ConfiguracionPrestamos";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Clientes"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#65adf1",
                },
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Clientes"
                component={ClientesDashboard}
                options={{ title: "Gestión de Clientes" }}
            />
            <StackNavigator.Screen
                name="NuevoCliente"
                component={ClienteForm}
                options={{ title: "Nuevo Cliente" }}
            />
            <StackNavigator.Screen
                name="DetalleCliente"
                component={ClienteDetalle}
                options={{ title: "Detalle del Cliente" }}
            />
            <StackNavigator.Screen
                name="ConfiguracionPrestamos"
                component={ConfiguracionPrestamos}
                options={{ title: "Configuración de Préstamos" }}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);