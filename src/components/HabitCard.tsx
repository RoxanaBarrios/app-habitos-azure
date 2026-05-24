import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Habit } from "../models/Habit";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
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

export default function HabitCard({ habit, onComplete, onEdit, onDelete }: HabitCardProps) {
  const progress = (habit.streak / 21) * 100;
  const colorValue = getColorValue(habit.color);

  return (
    <View
      style={{
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
      }}
    >
      {/* Header: Nombre, círculo de color y categoría en esquina superior derecha */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: Spacing.md,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {/* Círculo de color */}
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: Radius.full,
              backgroundColor: colorValue,
              marginRight: Spacing.md,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ ...Typography.headline, color: Colors.text }}>
              {habit.name}
            </Text>
            {habit.description && (
              <Text
                style={{
                  ...Typography.footnote,
                  color: Colors.textSecondary,
                  marginTop: Spacing.xs,
                }}
              >
                {habit.description}
              </Text>
            )}
          </View>
        </View>

        {/* Categoría en esquina superior derecha */}
        <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginLeft: Spacing.md }}>
          {habit.category}
        </Text>
      </View>

      {/* Barra de progreso con emoji 🔥 */}
      <View style={{ marginBottom: Spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.xs,
          }}
        >
          <Text style={{ ...Typography.footnote, color: Colors.textSecondary }}>
            🔥 Racha
          </Text>
          <Text style={{ ...Typography.callout, color: colorValue, fontWeight: "600" }}>
            {habit.streak}/21
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: Colors.divider,
            borderRadius: Radius.full,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: colorValue,
            }}
          />
        </View>
      </View>

      {/* Información adicional */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.md,
          paddingTop: Spacing.md,
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
        }}
      >
        <Text style={{ ...Typography.footnote, color: Colors.textSecondary }}>
          {habit.completed_today ? "✓ Completado hoy" : "Pendiente hoy"}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={{ flexDirection: "row", gap: Spacing.sm }}>
        <TouchableOpacity
          onPress={() => onComplete(habit.id)}
          style={{
            flex: 1,
            backgroundColor: habit.completed_today ? Colors.success : Colors.primary,
            borderRadius: Radius.md,
            paddingVertical: Spacing.md,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Typography.callout,
              color: Colors.text,
              fontWeight: "600",
            }}
          >
            {habit.completed_today ? "Completado" : "Completar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onEdit(habit)}
          style={{
            flex: 1,
            backgroundColor: Colors.divider,
            borderRadius: Radius.md,
            paddingVertical: Spacing.md,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Typography.callout,
              color: Colors.textSecondary,
              fontWeight: "600",
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(habit.id)}
          style={{
            flex: 1,
            backgroundColor: Colors.danger,
            borderRadius: Radius.md,
            paddingVertical: Spacing.md,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Typography.callout,
              color: Colors.text,
              fontWeight: "600",
            }}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
