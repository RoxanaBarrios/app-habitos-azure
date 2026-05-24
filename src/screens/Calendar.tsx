import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, StatusBar } from "react-native";
import { loadHabits } from "../storage/habitService";
import { Habit } from "../models/Habit";
import { Colors, Spacing, Typography, Radius } from "../theme/colors";

interface CalendarProps {
  userId: string;
  onClose: () => void;
}

interface DayHabits {
  day: number;
  habits: Habit[];
}

export default function Calendar({ userId, onClose }: CalendarProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayHabits | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const loadedHabits = await loadHabits(userId);
      setHabits(loadedHabits);
      setIsLoading(false);
    };

    loadData();
  }, [userId]);

  // Generar días del calendario actual
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: (number | null)[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      if (date.getMonth() === month) {
        days.push(date.getDate());
      } else {
        days.push(null);
      }
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const getDayStatus = (day: number | null): "active" | "empty" | "none" => {
    if (!day) return "none";
    const habitsForDay = getHabitsForDay(day);
    return habitsForDay.length > 0 ? "active" : "empty";
  };

  const getHabitsForDay = (day: number): Habit[] => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Normalizar a medianoche para comparación correcta
    date.setHours(0, 0, 0, 0);
    
    return habits.filter((habit) => {
      // Si no tiene fecha de último completado, usar created_at
      if (!habit.last_completed_date) {
        const createdDate = new Date(habit.created_at);
        createdDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(createdDate);
        endDate.setDate(endDate.getDate() + 20);
        
        return createdDate.getTime() <= date.getTime() && date.getTime() <= endDate.getTime();
      }
      
      // Si tiene streak, calcular el inicio basado en el streak actual
      // streakStartDate = lastCompletedDate - (streak - 1)
      const lastCompletedDate = new Date(habit.last_completed_date);
      lastCompletedDate.setHours(0, 0, 0, 0);
      
      const streakStartDate = new Date(lastCompletedDate);
      streakStartDate.setDate(streakStartDate.getDate() - (habit.streak - 1));
      
      const streakEndDate = new Date(streakStartDate);
      streakEndDate.setDate(streakEndDate.getDate() + 20); // 21 días totales
      
      // Mostrar hábito solo en el período actual del streak
      return streakStartDate.getTime() <= date.getTime() && date.getTime() <= streakEndDate.getTime();
    });
  };

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text }}>Cargando calendario...</Text>
      </View>
    );
  }

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xl + 60 }}
      >
        <Text style={{ ...Typography.title1, color: Colors.text, marginBottom: Spacing.lg, marginTop: Spacing.xl * 2 }}>
          Calendario
        </Text>

        {/* Navegación de meses */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.lg,
            backgroundColor: Colors.surface,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            borderRadius: Radius.lg,
          }}
        >
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={{ ...Typography.headline, color: Colors.primary, fontWeight: "600" }}>
              ← Anterior
            </Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.headline, color: Colors.text, fontWeight: "600" }}>
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={{ ...Typography.headline, color: Colors.primary, fontWeight: "600" }}>
              Siguiente →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Encabezado con días de la semana */}
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.xl,
          }}
        >
          {/* Días de semana */}
          <View style={{ flexDirection: "row", marginBottom: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider }}>
            {weekDays.map((day) => (
              <View key={day} style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ ...Typography.footnote, color: Colors.textSecondary, fontWeight: "600" }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Grid de días */}
          <View>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
              <View key={weekIndex} style={{ flexDirection: "row", marginBottom: Spacing.md }}>
                {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                  const status = getDayStatus(day);
                  const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();
                  const habitsForDay = day ? getHabitsForDay(day) : [];

                  return (
                    <TouchableOpacity
                      key={`${weekIndex}-${dayIndex}`}
                      onPress={() => {
                        if (day && habitsForDay.length > 0) {
                          setSelectedDay({ day, habits: habitsForDay });
                          setShowDayModal(true);
                        }
                      }}
                      disabled={!day || habitsForDay.length === 0}
                      style={{
                        flex: 1,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: Radius.md,
                        backgroundColor:
                          status === "none"
                            ? Colors.background
                            : status === "active"
                            ? Colors.divider
                            : Colors.background,
                        borderWidth: isToday ? 2 : 0,
                        borderColor: Colors.primary,
                        opacity: habitsForDay.length > 0 ? 1 : 0.5,
                      }}
                    >
                      <Text
                        style={{
                          ...Typography.footnote,
                          color:
                            status === "none"
                              ? Colors.textSecondary
                              : status === "active"
                              ? Colors.text
                              : Colors.textSecondary,
                          fontWeight: "600",
                        }}
                      >
                        {day || ""}
                      </Text>
                      {status === "active" && (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: Colors.primary,
                            marginTop: 2,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Leyenda */}
        <View style={{ backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg }}>
          <Text style={{ ...Typography.callout, color: Colors.text, fontWeight: "600", marginBottom: Spacing.md }}>
            Leyenda
          </Text>
          <View style={{ gap: Spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.md }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: Radius.md,
                  backgroundColor: Colors.divider,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: Colors.primary,
                  }}
                />
              </View>
              <Text style={{ ...Typography.footnote, color: Colors.text }}>
                Días con hábitos activos (toca para ver)
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.md }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: Radius.md,
                  backgroundColor: Colors.background,
                  borderWidth: 1,
                  borderColor: Colors.divider,
                }}
              />
              <Text style={{ ...Typography.footnote, color: Colors.text }}>
                Días sin hábitos
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.md }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: Radius.md,
                  backgroundColor: Colors.background,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                }}
              />
              <Text style={{ ...Typography.footnote, color: Colors.text }}>
                Día actual
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de hábitos del día */}
      <Modal
        visible={showDayModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowDayModal(false);
          setSelectedDay(null);
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
                setShowDayModal(false);
                setSelectedDay(null);
              }}
            >
              <Text style={{ ...Typography.headline, color: Colors.primary }}>Cerrar</Text>
            </TouchableOpacity>
            <Text style={{ ...Typography.headline, color: Colors.text }}>
              {selectedDay?.day} de {currentMonth.toLocaleDateString("es-ES", { month: "long" })}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          {/* Lista de hábitos del día */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.lg,
            }}
          >
            {selectedDay?.habits.map((habit) => {
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

              const colorValue = getColorValue(habit.color);

              return (
                <View
                  key={habit.id}
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: Radius.lg,
                    padding: Spacing.md,
                    marginBottom: Spacing.md,
                    borderLeftWidth: 4,
                    borderLeftColor: colorValue,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: Spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colorValue,
                    }}
                  />
                  <Text style={{ ...Typography.callout, color: Colors.text, fontWeight: "600" }}>
                    {habit.name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
