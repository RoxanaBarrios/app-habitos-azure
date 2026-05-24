import { useEffect, useState } from "react";
import { View, TextInput, FlatList, Alert, Text, ScrollView, TouchableOpacity, Modal, StatusBar } from "react-native";
import HabitCard from "../components/HabitCard";
import TabBar from "../components/TabBar";
import { Habit } from "../models/Habit";
import {
  loadHabits,
  createHabitInSupabase,
  completeHabitInSupabase,
  updateHabitNameInSupabase,
  deleteHabitInSupabase,
  getGeneralStreak,
  getAcquiredHabitsCount,
} from "../storage/habitService";
import Profile from "./Profile";
import Metrics from "./Metrics";
import Calendar from "./Calendar";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

interface HomeProps {
  userId: string;
  onLogout: () => Promise<void>;
}

const CATEGORIES = ["Salud", "Deporte", "Trabajo", "Hogar"] as const;
const COLORS = ["Azul", "Amarillo", "Verde", "Rojo", "Morado"] as const;

type Screen = "home" | "profile" | "metrics" | "calendar";

export default function Home({ userId, onLogout }: HomeProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Salud" | "Deporte" | "Trabajo" | "Hogar">("Salud");
  const [selectedColor, setSelectedColor] = useState<"Azul" | "Amarillo" | "Verde" | "Rojo" | "Morado">("Azul");
  const [isLoading, setIsLoading] = useState(true);
  const [generalStreak, setGeneralStreak] = useState(0);
  const [acquiredCount, setAcquiredCount] = useState(0);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const loadedHabits = await loadHabits(userId);
      setHabits(loadedHabits);

      const streak = await getGeneralStreak(userId);
      setGeneralStreak(streak);

      const acquired = await getAcquiredHabitsCount(userId);
      setAcquiredCount(acquired);

      setIsLoading(false);
    };

    loadData();
  }, [userId]);

  const handleLogout = async () => {
    await onLogout();
  };

  const resetForm = () => {
    setEditingHabitId(null);
    setName("");
    setDescription("");
    setSelectedCategory("Salud");
    setSelectedColor("Azul");
  };

  const handleSubmitHabit = async () => {
    // Validar nombre en ambos casos (crear y editar)
    if (!name.trim()) {
      Alert.alert("Error", "El nombre del hábito no puede estar vacío");
      return;
    }

    if (editingHabitId) {
      const updated = await updateHabitNameInSupabase(editingHabitId, name);
      if (updated) {
        setHabits(habits.map((h) => (h.id === editingHabitId ? updated : h)));
        resetForm();
        setShowCreateModal(false);
      }
      return;
    }

    const newHabit = await createHabitInSupabase(
      userId,
      name,
      selectedCategory,
      selectedColor,
      description
    );

    if (newHabit) {
      setHabits([...habits, newHabit]);
      resetForm();
      setShowCreateModal(false);
    } else {
      Alert.alert("Error", "No se pudo crear el hábito");
    }
  };

  const handleComplete = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    Alert.alert(
      "Marcar como completado",
      `¿Completaste "${habit.name}" hoy?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, completé",
          style: "default",
          onPress: async () => {
            const updated = await completeHabitInSupabase(userId, habit);

            if (updated === null) {
              setHabits(habits.filter((h) => h.id !== id));
              const acquired = await getAcquiredHabitsCount(userId);
              setAcquiredCount(acquired);
              Alert.alert("¡Felicidades!", "¡Has adquirido este hábito! 🎉");
            } else if (updated) {
              setHabits(habits.map((h) => (h.id === id ? updated : h)));
              const streak = await getGeneralStreak(userId);
              setGeneralStreak(streak);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setName(habit.name);
    setDescription(habit.description || "");
    setSelectedCategory(habit.category);
    setSelectedColor(habit.color);
    setShowCreateModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar hábito",
      "¿Seguro que quieres eliminar este hábito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const success = await deleteHabitInSupabase(id);
            if (success) {
              setHabits(habits.filter((h) => h.id !== id));
              if (editingHabitId === id) {
                resetForm();
              }
            }
          },
        },
      ]
    );
  };

  if (isLoading && currentScreen === "home") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text }}>Cargando...</Text>
      </View>
    );
  }

  if (currentScreen === "profile") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Profile userId={userId} onClose={() => setCurrentScreen("home")} onLogout={handleLogout} />
        <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </View>
    );
  }

  if (currentScreen === "metrics") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Metrics userId={userId} onClose={() => setCurrentScreen("home")} />
        <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </View>
    );
  }

  if (currentScreen === "calendar") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Calendar userId={userId} onClose={() => setCurrentScreen("home")} />
        <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </View>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  const completedToday = habits.filter((h) => h.completed_today).length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xl + 60 }}
      >
        {/* Cabecera */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.lg, marginTop: Spacing.xl * 2 }}>
          <View>
            <Text style={{ ...Typography.title1, color: Colors.text }}>Hábitos</Text>
            <Text style={{ ...Typography.footnote, color: Colors.textSecondary, marginTop: Spacing.xs }}>
              {dateStr}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            style={{
              width: 44,
              height: 44,
              backgroundColor: Colors.primary,
              borderRadius: Radius.full,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "600", color: Colors.text }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de racha */}
        <View style={{ marginBottom: Spacing.xl }}>
          <View style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: Colors.warning }}>
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
        </View>

        {/* Lista de hábitos */}
        {habits.length === 0 ? (
          <View style={{ padding: Spacing.xl, alignItems: "center" }}>
            <Text style={{ ...Typography.body, color: Colors.textSecondary, textAlign: "center" }}>
              No tienes hábitos activos.{"\n"}¡Crea uno para empezar!
            </Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          />
        )}
      </ScrollView>

      {/* Modal para crear hábito */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          resetForm();
          setShowCreateModal(false);
        }}
      >
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          {/* Encabezado del modal */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: Colors.divider,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setShowCreateModal(false);
              }}
            >
              <Text style={{ ...Typography.headline, color: Colors.primary }}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={{ ...Typography.headline, color: Colors.text }}>
              {editingHabitId ? "Editar hábito" : "Nuevo hábito"}
            </Text>
            <TouchableOpacity onPress={handleSubmitHabit}>
              <Text style={{ ...Typography.headline, color: Colors.primary, fontWeight: "600" }}>
                {editingHabitId ? "Guardar" : "Agregar"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.lg,
            }}
          >
            {/* Inputs */}
            <View style={{ gap: Spacing.md, marginBottom: Spacing.xl }}>
              <View>
                <Text style={{ ...Typography.callout, color: Colors.text, marginBottom: Spacing.sm }}>
                  Hábito
                </Text>
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor={Colors.textSecondary}
                  value={name}
                  onChangeText={setName}
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
              </View>

              <View>
                <Text style={{ ...Typography.callout, color: Colors.text, marginBottom: Spacing.sm }}>
                  Descripción
                </Text>
                <TextInput
                  placeholder="Descripción (opcional)"
                  placeholderTextColor={Colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.md,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.md,
                    color: Colors.text,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: Colors.divider,
                    minHeight: 100,
                  }}
                />
              </View>

              {!editingHabitId && (
                <>
                  <View>
                    <Text style={{ ...Typography.callout, color: Colors.text, marginBottom: Spacing.sm }}>
                      Categoría
                    </Text>
                    <View style={{ flexDirection: "row", gap: Spacing.md, flexWrap: "wrap" }}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setSelectedCategory(cat)}
                          style={{
                            paddingHorizontal: Spacing.md,
                            paddingVertical: Spacing.sm,
                            borderRadius: Radius.full,
                            backgroundColor:
                              selectedCategory === cat ? Colors.primary : Colors.surface,
                            borderWidth: 1,
                            borderColor:
                              selectedCategory === cat ? Colors.primary : Colors.divider,
                          }}
                        >
                          <Text
                            style={{
                              color: selectedCategory === cat ? Colors.text : Colors.textSecondary,
                              fontSize: 14,
                              fontWeight: "500",
                            }}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View>
                    <Text style={{ ...Typography.callout, color: Colors.text, marginBottom: Spacing.sm }}>
                      Color
                    </Text>
                    <View style={{ flexDirection: "row", gap: Spacing.md, flexWrap: "wrap" }}>
                      {COLORS.map((col) => {
                        const colorValue =
                          col === "Azul"
                            ? Colors.primary
                            : col === "Amarillo"
                            ? Colors.warning
                            : col === "Verde"
                            ? Colors.success
                            : col === "Rojo"
                            ? Colors.danger
                            : "#A855F7";

                        return (
                          <TouchableOpacity
                            key={col}
                            onPress={() => setSelectedColor(col)}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: Radius.full,
                              backgroundColor: colorValue,
                              borderWidth: 3,
                              borderColor:
                                selectedColor === col ? Colors.text : "transparent",
                            }}
                          />
                        );
                      })}
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* TabBar */}
      <TabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />
    </View>
  );
}
