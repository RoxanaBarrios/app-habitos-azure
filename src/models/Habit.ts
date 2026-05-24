export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: 'Salud' | 'Deporte' | 'Trabajo' | 'Hogar';
  color: 'Azul' | 'Amarillo' | 'Verde' | 'Rojo' | 'Morado';
  completed_today: boolean;
  streak: number;
  last_completed_date: string | null; // Fecha del último día que se completó (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
}

export interface AcquiredHabit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: 'Salud' | 'Deporte' | 'Trabajo' | 'Hogar';
  color: 'Azul' | 'Amarillo' | 'Verde' | 'Rojo' | 'Morado';
  completed_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}