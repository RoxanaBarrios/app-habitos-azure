import { supabase } from '../lib/supabase';

/**
 * Script para agregar datos ficticios a la base de datos para testing
 * Crea hábitos con diferentes estados de racha y hábitos adquiridos
 */

export const seedTestData = async (userId: string) => {
  try {
    console.log('Iniciando seed de datos ficticios...');

    // 1. Hábito creado hoy (racha: 0)
    const today = new Date().toISOString();
    await supabase.from('habits').insert([
      {
        user_id: userId,
        name: 'Meditar 10 min',
        description: 'Meditación matutina',
        category: 'Salud',
        color: 'Azul',
        completed_today: false,
        streak: 0,
        last_completed_date: null,
        created_at: today,
        updated_at: today,
      },
    ]);

    // 2. Hábito creado hace 5 días (racha: 5)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await supabase.from('habits').insert([
      {
        user_id: userId,
        name: 'Ejercicio 30 min',
        description: 'Correr o ir al gym',
        category: 'Deporte',
        color: 'Verde',
        completed_today: false,
        streak: 5,
        last_completed_date: yesterdayStr,
        created_at: `${fiveDaysAgoStr}T08:00:00.000Z`,
        updated_at: today,
      },
    ]);

    // 3. Hábito creado hace 15 días (racha: 15 - casi a completar)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const fifteenDaysAgoStr = fifteenDaysAgo.toISOString().split('T')[0];

    await supabase.from('habits').insert([
      {
        user_id: userId,
        name: 'Leer 20 páginas',
        description: 'Leer un libro',
        category: 'Trabajo',
        color: 'Amarillo',
        completed_today: false,
        streak: 15,
        last_completed_date: yesterdayStr,
        created_at: `${fifteenDaysAgoStr}T09:00:00.000Z`,
        updated_at: today,
      },
    ]);

    // 4. Hábito creado hace 12 días (racha: 10 - quebrada la racha)
    const twelveDaysAgo = new Date();
    twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 12);
    const twelveDaysAgoStr = twelveDaysAgo.toISOString().split('T')[0];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

    await supabase.from('habits').insert([
      {
        user_id: userId,
        name: 'Beber agua 2L',
        description: 'Hidratación diaria',
        category: 'Salud',
        color: 'Morado',
        completed_today: false,
        streak: 5, // Racha reiniciada
        last_completed_date: threeDaysAgoStr,
        created_at: `${twelveDaysAgoStr}T07:00:00.000Z`,
        updated_at: today,
      },
    ]);

    // 5. Hábito adquirido (completó los 21 días)
    const twentytwoDaysAgo = new Date();
    twentytwoDaysAgo.setDate(twentytwoDaysAgo.getDate() - 22);
    const twentytwoDaysAgoStr = twentytwoDaysAgo.toISOString().split('T')[0];

    await supabase.from('acquired_habits').insert([
      {
        user_id: userId,
        name: 'Yoga matutino',
        description: 'Rutina de yoga 30 min',
        category: 'Salud',
        color: 'Verde',
        completed_at: today,
        created_at: `${twentytwoDaysAgoStr}T06:00:00.000Z`,
      },
    ]);

    // 6. Otro hábito adquirido
    const thirtydaysAgo = new Date();
    thirtydaysAgo.setDate(thirtydaysAgo.getDate() - 30);
    const thirtydaysAgoStr = thirtydaysAgo.toISOString().split('T')[0];

    await supabase.from('acquired_habits').insert([
      {
        user_id: userId,
        name: 'Código diario',
        description: 'Practicar programación 1 hora',
        category: 'Trabajo',
        color: 'Azul',
        completed_at: `${thirtydaysAgoStr}T18:00:00.000Z`,
        created_at: `${thirtydaysAgo.toISOString().split('T')[0]}T12:00:00.000Z`,
      },
    ]);

    // 7. Registrar racha general
    await supabase.from('daily_streak').insert([
      {
        user_id: userId,
        date: yesterdayStr,
        completed_count: 3,
      },
      {
        user_id: userId,
        date: fiveDaysAgoStr,
        completed_count: 2,
      },
    ]);

    console.log('Datos ficticios agregados exitosamente');
    return true;
  } catch (error) {
    console.error('Error al agregar datos ficticios:', error);
    return false;
  }
};

/**
 * Limpia todos los datos del usuario (útil para resetear entre tests)
 */
export const clearUserData = async (userId: string) => {
  try {
    console.log('Limpiando datos del usuario...');

    await Promise.all([
      supabase.from('habits').delete().eq('user_id', userId),
      supabase.from('acquired_habits').delete().eq('user_id', userId),
      supabase.from('daily_streak').delete().eq('user_id', userId),
    ]);

    console.log('Datos del usuario eliminados');
    return true;
  } catch (error) {
    console.error('Error al limpiar datos:', error);
    return false;
  }
};
