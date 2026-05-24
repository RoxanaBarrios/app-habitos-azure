import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setMessageType("error");
      setMessage("Email y contraseña son requeridos");
      return;
    }

    if (!isSupabaseConfigured) {
      setMessageType("error");
      setMessage("Configura SUPABASE_URL y SUPABASE_ANON_KEY");
      return;
    }

    if (isRegister) {
      if (!username.trim()) {
        setMessageType("error");
        setMessage("El nombre de usuario es requerido");
        return;
      }

      if (password !== confirmPassword) {
        setMessageType("error");
        setMessage("Las contraseñas no coinciden");
        return;
      }

      if (password.length < 6) {
        setMessageType("error");
        setMessage("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    setIsLoading(true);
    setMessage("");

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message);
      } else {
        setMessageType("success");
        setMessage("Cuenta creada. Revisa tu correo para confirmar.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xl,
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      {/* Logo */}
      <View style={{ alignItems: "center", marginBottom: Spacing.xxl }}>
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: Colors.secondary,
            borderRadius: Radius.lg,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <Text style={{ fontSize: 36 }}>📱</Text>
        </View>
        <Text style={{ ...Typography.title1, color: Colors.text, marginBottom: Spacing.xs }}>
          Hábitos
        </Text>
      </View>

      {/* Título */}
      <Text style={{ ...Typography.headline, color: Colors.text, marginBottom: Spacing.lg, textAlign: "center" }}>
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </Text>

      {/* Inputs */}
      <View style={{ gap: Spacing.md, marginBottom: Spacing.lg }}>
        {isRegister && (
          <TextInput
            autoCapitalize="none"
            placeholder="Nombre de usuario"
            placeholderTextColor={Colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.md,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
              color: Colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.divider,
            }}
          />
        )}

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.md,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            color: Colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: Colors.divider,
          }}
        />

        <TextInput
          secureTextEntry
          placeholder="Contraseña"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.md,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.md,
            color: Colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: Colors.divider,
          }}
        />

        {isRegister && (
          <TextInput
            secureTextEntry
            placeholder="Confirmar contraseña"
            placeholderTextColor={Colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.md,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
              color: Colors.text,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.divider,
            }}
          />
        )}
      </View>

      {/* Botón principal */}
      <TouchableOpacity
        onPress={handleAuth}
        disabled={isLoading}
        style={{
          backgroundColor: Colors.primary,
          borderRadius: Radius.lg,
          paddingVertical: Spacing.md,
          marginBottom: Spacing.lg,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: Colors.text,
            fontSize: 17,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {isLoading ? "Cargando..." : isRegister ? "Registrarme" : "Iniciar sesión"}
        </Text>
      </TouchableOpacity>

      {/* Enlace para cambiar modo */}
      <TouchableOpacity
        onPress={() => {
          setIsRegister(!isRegister);
          setMessage("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUsername("");
        }}
      >
        <Text
          style={{
            color: Colors.primary,
            fontSize: 15,
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {isRegister ? "¿Ya tengo cuenta? Iniciar sesión" : "¿No tengo cuenta? Registrarme"}
        </Text>
      </TouchableOpacity>

      {/* Mensaje de error/éxito */}
      {message && (
        <View
          style={{
            marginTop: Spacing.lg,
            padding: Spacing.md,
            backgroundColor: messageType === "error" ? Colors.danger : Colors.success,
            borderRadius: Radius.md,
          }}
        >
          <Text style={{ color: Colors.text, fontSize: 14, fontWeight: "500" }}>
            {message}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
