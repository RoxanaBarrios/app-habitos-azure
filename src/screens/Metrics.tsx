import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { AcquiredHabit } from "../models/Habit";
import { getGeneralStreak, getAcquiredHabits, getAcquiredHabitsCount, loadHabits } from "../storage/habitService";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

interface MetricsProps {
  userId: string;
  onClose: () => void;
}

const getColorValue = (color: string) => {
  const colorMap: { [key: string]: string } = {
    Azul: Colors.primary,
    Amarillo: Colors.warning,
    Verde: Colors.success,
    Rojo: Colors.danger,
    Morado: "#A855F7",
  };
  return colorMap[color] || Colors.primary;
};

export default function Metrics({ userId, onClose }: MetricsProps) {
  const [generalStreak, setGeneralStreak] = useState(0);
  const [acquiredCount, setAcquiredCount] = useState(0);
  const [acquiredHabits, setAcquiredHabits] = useState<AcquiredHabit[]>([]);
  const [activeHabitsCount, setActiveHabitsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const streak = await getGeneralStreak(userId);
      setGeneralStreak(streak);

      const acquired = await getAcquiredHabitsCount(userId);
      setAcquiredCount(acquired);

      const habits = await getAcquiredHabits(userId);
      setAcquiredHabits(habits);

      const activeHabits = await loadHabits(userId);
      setActiveHabitsCount(activeHabits.length);

      setIsLoading(false);
    };

    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text }}>Cargando métricas...</Text>
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
          Estadísticas
        </Text>

        {/* Tarjetas de métricas principales */}
        <View style={{ marginBottom: Spacing.xl }}>
          {/* Racha General */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.lg,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 2,
              borderColor: Colors.warning,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.xs }}>
                  🔥 Racha General
                </Text>
                <Text style={{ ...Typography.title1, color: Colors.warning }}>
                  {generalStreak}
                </Text>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginTop: Spacing.xs }}>
                  días consecutivos
                </Text>
              </View>
              <Text style={{ fontSize: 48 }}>🔥</Text>
            </View>
          </View>

          {/* Hábitos Adquiridos */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.lg,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 2,
              borderColor: Colors.success,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.xs }}>
                  🏆 Hábitos Adquiridos
                </Text>
                <Text style={{ ...Typography.title1, color: Colors.success }}>
                  {acquiredCount}
                </Text>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginTop: Spacing.xs }}>
                  completados en 21 días
                </Text>
              </View>
              <Text style={{ fontSize: 48 }}>🏆</Text>
            </View>
          </View>

          {/* Hábitos Activos */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.lg,
              padding: Spacing.lg,
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginBottom: Spacing.xs }}>
                  📋 Hábitos Activos
                </Text>
                <Text style={{ ...Typography.title1, color: Colors.primary }}>
                  {activeHabitsCount}
                </Text>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginTop: Spacing.xs }}>
                  en progreso
                </Text>
              </View>
              <Text style={{ fontSize: 48 }}>📋</Text>
            </View>
          </View>
        </View>

        {/* Lista de hábitos adquiridos */}
        {acquiredHabits.length > 0 && (
          <View style={{ marginTop: Spacing.xl }}>
            <Text style={{ ...Typography.headline, color: Colors.text, marginBottom: Spacing.md }}>
              Mis Logros
            </Text>

            {acquiredHabits.map((habit) => {
              const colorValue = getColorValue(habit.color);

              return (
                <View
                  key={habit.id}
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    marginBottom: Spacing.md,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing.sm }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      {/* Círculo de color */}
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: Radius.full,
                          backgroundColor: colorValue,
                          marginRight: Spacing.md,
                        }}
                      />
                      <Text style={{ ...Typography.callout, color: Colors.text, fontWeight: "600" }}>
                        {habit.name}
                      </Text>
                    </View>
                    {/* Categoría en esquina superior derecha */}
                    <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginLeft: Spacing.md }}>
                      {habit.category}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: Spacing.xs }}>
                    <Text style={{ ...Typography.footnote, color: Colors.textSecondary }}>
                      {new Date(habit.completed_at).toLocaleDateString("es-ES")}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {acquiredHabits.length === 0 && (
          <View style={{ marginTop: Spacing.xl, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.lg, alignItems: "center" }}>
            <Text style={{ ...Typography.body, color: Colors.textSecondary, textAlign: "center" }}>
              Aún no tienes hábitos adquiridos.{"\n"}¡Completa un hábito durante 21 días para verlo aquí!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
