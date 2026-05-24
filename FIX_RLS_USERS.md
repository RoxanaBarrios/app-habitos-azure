# Fix para errores de RLS en tabla users

Ejecuta esto en Supabase → SQL Editor → New Query

```sql
-- Eliminar políticas viejas
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Crear nuevas políticas que permiten inserción
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

Luego presiona **Run** y espera confirmación.
