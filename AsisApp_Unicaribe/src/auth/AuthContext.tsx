import React, { createContext, useContext, useEffect, useState } from "react";
// Importa AsyncStorage o la librería que uses para guardar la sesión
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Al iniciar la app, verificamos si ya hay una sesión guardada
  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem("@user_token");
        console.log("🔍 AuthContext - Token recuperado:", token);
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Error al cargar la sesión:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      console.log("🚀 AuthContext - Ejecutando signIn para:", email);

      // Aquí puedes hacer tu petición real de login a tu API o servicio si lo requieres:
      // const response = await apiLogin(email, pass);
      // const token = response.token;

      // Simulamos guardar el token exitosamente
      await AsyncStorage.setItem("@user_token", "dummy_token_123");

      // ¡ESTO ES LO MÁS IMPORTANTE! Cambiar el estado a true para que la app avance
      setIsAuthenticated(true);
      console.log("✅ AuthContext - isAuthenticated actualizado a TRUE");
    } catch (error) {
      console.error("Error en signIn:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@user_token");
      setIsAuthenticated(false);
      console.log("🚪 AuthContext - Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
