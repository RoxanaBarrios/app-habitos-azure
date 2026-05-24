import { supabase } from '../lib/supabase';
import { Habit, AcquiredHabit } from '../models/Habit';

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Verifica si una fecha es hoy
 */
export const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return dateString === getTodayDate();
};

/**
 * Verifica si una fecha es ayer
 */
export const isYesterday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
};

/**
 * Carga todos los hábitos del usuario desde Supabase
 */
export const loadHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error cargando hábitos:', error);
    return [];
  }
};

/**
 * Crea un nuevo hábito
 */
export const createHabitInSupabase = async (
  userId: string,
  name: string,
  category: 'Salud' | 'Deporte' | 'Trabajo' | 'Hogar',
  color: 'Azul' | 'Amarillo' | 'Verde' | 'Rojo' | 'Morado',
  description?: string
): Promise<Habit | null> => {
  try {
    const newHabit = {
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || null,
      category,
      color,
      completed_today: false,
      streak: 0,
      last_completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('habits')
      .insert([newHabit])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creando hábito:', error);
    return null;
  }
};

/**
 * Marca un hábito como completado hoy y actualiza su racha
 */
export const completeHabitInSupabase = async (
  userId: string,
  habit: Habit
): Promise<Habit | null> => {
  try {
    // Si ya completó hoy, no hacer nada
    if (isToday(habit.last_completed_date)) {
      console.log('Ya completaste este hábito hoy');
      return habit;
    }

    // Calcula la nueva racha
    let newStreak = habit.streak;
    if (isYesterday(habit.last_completed_date)) {
      newStreak = habit.streak + 1;
    } else if (!habit.last_completed_date) {
      newStreak = 1;
    } else {
      newStreak = 1;
    }

    const today = getTodayDate();

    // Si llegó a 21 días, mover a hábitos adquiridos
    if (newStreak >= 21) {
      // Crear en tabla de adquiridos
      await supabase.from('acquired_habits').insert([
        {
          user_id: userId,
          name: habit.name,
          description: habit.description,
          category: habit.category,
          color: habit.color,
          completed_at: new Date().toISOString(),
        },
      ]);

      // Eliminar de activos
      await supabase.from('habits').delete().eq('id', habit.id);

      console.log('¡Hábito adquirido! Has completado 21 días consecutivos.');
      return null; // Retorna null para indicar que fue eliminado
    }

    // Actualizar hábito
    const { data, error } = await supabase
      .from('habits')
      .update({
        completed_today: true,
        streak: newStreak,
        last_completed_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habit.id)
      .select()
      .single();

    if (error) throw error;

    // Registrar en tabla daily_streak para racha general
    await recordDailyStreak(userId, today);

    return data;
  } catch (error) {
    console.error('Error completando hábito:', error);
    return null;
  }
};

/**
 * Actualiza el nombre de un hábito
 */
export const updateHabitNameInSupabase = async (
  habitId: string,
  name: string
): Promise<Habit | null> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .update({
        name: name.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error actualizando hábito:', error);
    return null;
  }
};

/**
 * Elimina un hábito
 */
export const deleteHabitInSupabase = async (habitId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error eliminando hábito:', error);
    return false;
  }
};

/**
 * Registra que el usuario completó al menos un hábito hoy
 */
export const recordDailyStreak = async (userId: string, date: string): Promise<void> => {
  try {
    const { data: existingRecord } = await supabase
      .from('daily_streak')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (existingRecord) {
      // Ya existe, actualizar
      await supabase
        .from('daily_streak')
        .update({ completed_any_habit: true })
        .eq('id', existingRecord.id);
    } else {
      // Crear nuevo
      await supabase.from('daily_streak').insert([
        {
          user_id: userId,
          date,
          completed_any_habit: true,
        },
      ]);
    }
  } catch (error) {
    console.error('Error registrando racha diaria:', error);
  }
};

/**
 * Obtiene la racha general del usuario (días consecutivos)
 */
export const getGeneralStreak = async (userId: string): Promise<number> => {
  try {
    const { data: streakData, error } = await supabase
      .from('daily_streak')
      .select('date, completed_any_habit')
      .eq('user_id', userId)
      .eq('completed_any_habit', true)
      .order('date', { ascending: false });

    if (error) throw error;

    if (!streakData || streakData.length === 0) return 0;

    // Cuenta días consecutivos desde hoy hacia atrás
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];

      const hasCompletion = streakData.some((d: any) => d.date === checkDateStr);

      if (hasCompletion) {
        streak++;
      } else {
        break; // Rompe cuando encuentra un día sin completar
      }
    }

    return streak;
  } catch (error) {
    console.error('Error obteniendo racha general:', error);
    return 0;
  }
};

/**
 * Obtiene total de hábitos adquiridos
 */
export const getAcquiredHabitsCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('acquired_habits')
      .select('id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error('Error contando hábitos adquiridos:', error);
    return 0;
  }
};

/**
 * Obtiene hábitos adquiridos
 */
export const getAcquiredHabits = async (userId: string): Promise<AcquiredHabit[]> => {
  try {
    const { data, error } = await supabase
      .from('acquired_habits')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error cargando hábitos adquiridos:', error);
    return [];
  }
};
