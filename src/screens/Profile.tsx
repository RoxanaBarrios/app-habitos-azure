import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from "react-native";
import { User } from "../models/Habit";
import { getUser, updateUsername } from "../storage/userService";
import { seedTestData, clearUserData } from "../storage/seedData";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

interface ProfileProps {
  userId: string;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export default function Profile({ userId, onClose, onLogout }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser(userId);
      if (userData) {
        setUser(userData);
        setUsername(userData.username);
      }
      setIsLoading(false);
    };

    loadUser();
  }, [userId]);

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "El nombre de usuario no puede estar vacío");
      return;
    }

    setIsSaving(true);
    const updated = await updateUsername(userId, username);
    setIsSaving(false);

    if (updated) {
      setUser(updated);
      setIsEditing(false);
      Alert.alert("Éxito", "Nombre de usuario actualizado");
    } else {
      Alert.alert("Error", "No se pudo actualizar el nombre de usuario. Podría estar en uso.");
    }
  };

  const handleSeedTestData = async () => {
    Alert.alert("Cargar datos de prueba", "Esto agregará hábitos ficticios para testing", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cargar",
        style: "default",
        onPress: async () => {
          setIsSeeding(true);
          const success = await seedTestData(userId);
          setIsSeeding(false);
          if (success) {
            Alert.alert("✅ Éxito", "Datos de prueba cargados correctamente. Recarga la app para verlos.");
          } else {
            Alert.alert("❌ Error", "No se pudieron cargar los datos de prueba");
          }
        },
      },
    ]);
  };

  const handleClearData = async () => {
    Alert.alert("Limpiar datos", "Esto eliminará todos los hábitos del usuario", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpiar",
        style: "destructive",
        onPress: async () => {
          setIsSeeding(true);
          const success = await clearUserData(userId);
          setIsSeeding(false);
          if (success) {
            Alert.alert("✅ Éxito", "Datos eliminados. Recarga la app para verlos.");
          } else {
            Alert.alert("❌ Error", "No se pudieron eliminar los datos");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text }}>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text }}>Error al cargar perfil</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xl + 60 }}
      >
        <Text style={{ ...Typography.title1, color: Colors.text, marginBottom: Spacing.lg, marginTop: Spacing.xl * 2 }}>
          Mi Perfil
        </Text>

        {/* Avatar placeholder */}
        <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: Radius.full,
              backgroundColor: Colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={{ ...Typography.headline, color: Colors.text }}>
            {user.username}
          </Text>
        </View>

        {/* Email */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: "600" }}>
            Correo electrónico
          </Text>
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.md,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
              borderWidth: 1,
              borderColor: Colors.divider,
            }}
          >
            <Text style={{ ...Typography.body, color: Colors.text }}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Nombre de usuario */}
        <View style={{ marginBottom: Spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.sm,
            }}
          >
            <Text style={{ ...Typography.footnote, color: Colors.textSecondary, fontWeight: "600" }}>
              Nombre de usuario
            </Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={{ ...Typography.footnote, color: Colors.primary, fontWeight: "600" }}>
                  Editar
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={{ flexDirection: "row", gap: Spacing.md }}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                editable={!isSaving}
                style={{
                  flex: 1,
                  backgroundColor: Colors.surface,
                  borderRadius: Radius.md,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.md,
                  color: Colors.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
              />
              <TouchableOpacity
                onPress={handleSaveUsername}
                disabled={isSaving}
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: Radius.md,
                  paddingHorizontal: Spacing.md,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {isSaving ? "..." : "OK"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: Radius.md,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                borderWidth: 1,
                borderColor: Colors.divider,
              }}
            >
              <Text style={{ ...Typography.body, color: Colors.text }}>
                {user.username}
              </Text>
            </View>
          )}
        </View>

        {/* Fecha de creación */}
        <View style={{ marginBottom: Spacing.xl }}>
          <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: "600" }}>
            Miembro desde
          </Text>
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.md,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
              borderWidth: 1,
              borderColor: Colors.divider,
            }}
          >
            <Text style={{ ...Typography.body, color: Colors.text }}>
              {new Date(user.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Botones de testing (Development) */}
        <View style={{ marginBottom: Spacing.lg, paddingTop: Spacing.xl, borderTopWidth: 1, borderTopColor: Colors.divider }}>
          <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.md, fontWeight: "600" }}>
            🧪 Testing (Desarrollo)
          </Text>
          <TouchableOpacity
            onPress={handleSeedTestData}
            disabled={isSeeding}
            style={{
              backgroundColor: "#10B981",
              borderRadius: Radius.md,
              paddingVertical: Spacing.md,
              alignItems: "center",
              marginBottom: Spacing.md,
              opacity: isSeeding ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                ...Typography.body,
                color: Colors.text,
                fontWeight: "600",
              }}
            >
              {isSeeding ? "Cargando..." : "📊 Cargar datos de prueba"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearData}
            disabled={isSeeding}
            style={{
              backgroundColor: "#F59E0B",
              borderRadius: Radius.md,
              paddingVertical: Spacing.md,
              alignItems: "center",
              opacity: isSeeding ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                ...Typography.body,
                color: Colors.text,
                fontWeight: "600",
              }}
            >
              {isSeeding ? "Limpiando..." : "🗑️ Limpiar todos los datos"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de logout */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Cerrar sesión", "¿Estás seguro?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Cerrar sesión",
                style: "destructive",
                onPress: onLogout,
              },
            ]);
          }}
          style={{
            backgroundColor: Colors.danger,
            borderRadius: Radius.md,
            paddingVertical: Spacing.lg,
            alignItems: "center",
            marginTop: Spacing.xl,
          }}
        >
          <Text
            style={{
              ...Typography.headline,
              color: Colors.text,
              fontWeight: "600",
            }}
          >
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
