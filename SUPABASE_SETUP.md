# Configuración de Supabase

## Instrucciones

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Crea una nueva query
3. Copia y pega el SQL de abajo
4. Ejecuta

## SQL para crear las tablas

```sql
-- 1. Tabla de usuarios (extendida)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS para usuarios
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 2. Tabla de hábitos activos
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Salud', 'Deporte', 'Trabajo', 'Hogar')),
  color TEXT NOT NULL CHECK (color IN ('Azul', 'Amarillo', 'Verde', 'Rojo', 'Morado')),
  streak INTEGER DEFAULT 0,
  completed_today BOOLEAN DEFAULT FALSE,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS para hábitos
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Tabla de hábitos adquiridos (completados 21 días)
CREATE TABLE acquired_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS para hábitos adquiridos
ALTER TABLE acquired_habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own acquired habits" ON acquired_habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own acquired habits" ON acquired_habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Tabla para rastrear la racha general por día
CREATE TABLE daily_streak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed_any_habit BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, date)
);

-- RLS para racha diaria
ALTER TABLE daily_streak ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own streak data" ON daily_streak
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streak data" ON daily_streak
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streak data" ON daily_streak
  FOR UPDATE USING (auth.uid() = user_id);

-- Índices para mejorar performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_acquired_habits_user_id ON acquired_habits(user_id);
CREATE INDEX idx_daily_streak_user_id ON daily_streak(user_id, date DESC);
```

## ✅ Una vez ejecutado:
- Tienes tablas listas
- La seguridad (RLS) está configurada
- Cada usuario solo puede ver sus datos

**Haz esto primero, luego me avisa cuando esté listo.**
