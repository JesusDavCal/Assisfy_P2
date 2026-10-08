import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import { areFieldsComplete, isValidEmail } from "../../src/auth/validators";
import { authConfig } from "../../src/config/authConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Añadimos isAuthenticated para observar el estado
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  // ✅ ESTE useEffect navega cuando el estado cambia a autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(app)");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // 1️⃣ Validación de campos
    if (!areFieldsComplete({ email, password })) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    // 2️⃣ Ejecutar login
    setLoading(true);
    try {
      const result = await signIn(email, password);

      if (!result.success) {
        Alert.alert("Error de autenticación", result.message);
      }
      // NO navegues aquí. El useEffect de arriba lo hace automáticamente
      // cuando isAuthenticated cambie a true.
    } catch (error) {
      console.error("❌ Error en login:", error);
      Alert.alert("Error", "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../../assets/images/nexo.png")}
        style={{
          width: 120,
          height: 120,
          resizeMode: "contain",
          marginBottom: 15,
          alignSelf: "center",
        }}
      />
      <Text style={styles.title}>Bienvenido a Assisfy</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      {/* ⚠️ Este Link se muestra solo si el registro está habilitado */}
      {authConfig.REGISTRATION_ENABLED && (
        <Link href="/(auth)/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      )}

      <Text style={styles.hint}>
        Usuario de prueba: admin@unicaribe.edu / Admin123
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#003366",
    fontSize: 15,
  },
  hint: {
    marginTop: 24,
    textAlign: "center",
    color: "#999",
    fontSize: 12,
  },
});
