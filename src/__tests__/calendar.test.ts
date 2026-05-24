/**
 * Teste para la lógica del calendario
 * Verifica que los hábitos se marquen correctamente para 21 días
 */

import { Habit } from '../models/Habit';

describe('Calendar Logic - 21 Day Habit Marking', () => {
  // Función auxiliar para crear un hábito de prueba
  const createTestHabit = (daysAgo: number): Habit => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    return {
      id: `habit-${daysAgo}`,
      user_id: 'test-user',
      name: `Test Habit ${daysAgo} days ago`,
      category: 'Salud',
      color: 'Azul',
      completed_today: false,
      streak: daysAgo,
      last_completed_date: null,
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // Función que simula getHabitsForDay (de Calendar.tsx)
  const getHabitsForDay = (day: number, month: Date, habits: Habit[]): Habit[] => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    
    return habits.filter((habit) => {
      const createdDate = new Date(habit.created_at);
      createdDate.setHours(0, 0, 0, 0);
      
      // Calcular el día límite (21 días desde creación)
      const endDate = new Date(createdDate);
      endDate.setDate(endDate.getDate() + 20); // +20 para tener 21 días en total
      
      // Mostrar hábito solo si el día está dentro del período de 21 días
      return createdDate.getTime() <= date.getTime() && date.getTime() <= endDate.getTime();
    });
  };

  it('debería mostrar un hábito creado hoy', () => {
    const today = new Date();
    const habit = createTestHabit(0);
    
    const habitsForToday = getHabitsForDay(today.getDate(), today, [habit]);
    expect(habitsForToday.length).toBe(1);
  });

  it('debería mostrar un hábito en el día 10 de su período de 21 días', () => {
    const today = new Date();
    const habit = createTestHabit(10);
    
    const habitsForToday = getHabitsForDay(today.getDate(), today, [habit]);
    expect(habitsForToday.length).toBe(1);
  });

  it('debería mostrar un hábito en el día 21 (último día)', () => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - 20); // Hace 20 días
    
    const habit: Habit = {
      id: 'habit-21',
      user_id: 'test-user',
      name: 'Test Habit - Day 21',
      category: 'Salud',
      color: 'Azul',
      completed_today: false,
      streak: 20,
      last_completed_date: null,
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const today = new Date();
    const habitsForToday = getHabitsForDay(today.getDate(), today, [habit]);
    expect(habitsForToday.length).toBe(1);
  });

  it('NO debería mostrar un hábito después del día 21', () => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - 21); // Hace 21 días (ya pasó el período)
    
    const habit: Habit = {
      id: 'habit-22',
      user_id: 'test-user',
      name: 'Test Habit - After Day 21',
      category: 'Salud',
      color: 'Azul',
      completed_today: false,
      streak: 21,
      last_completed_date: null,
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const today = new Date();
    const habitsForToday = getHabitsForDay(today.getDate(), today, [habit]);
    expect(habitsForToday.length).toBe(0);
  });

  it('debería mostrar múltiples hábitos en su período de 21 días', () => {
    const habit1 = createTestHabit(5);
    const habit2 = createTestHabit(10);
    const habit3 = createTestHabit(0);
    
    const today = new Date();
    const habitsForToday = getHabitsForDay(today.getDate(), today, [habit1, habit2, habit3]);
    expect(habitsForToday.length).toBe(3);
  });

  it('no debería mostrar hábitos adquiridos (que pasaron su período)', () => {
    const acquiredHabit = createTestHabit(22); // Hace más de 21 días
    const activeHabit = createTestHabit(10);
    
    const today = new Date();
    const habitsForToday = getHabitsForDay(today.getDate(), today, [acquiredHabit, activeHabit]);
    expect(habitsForToday.length).toBe(1);
    expect(habitsForToday[0].id).toBe('habit-10');
  });
});
