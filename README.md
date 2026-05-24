# app-habitos

Aplicación móvil para crear y mantener hábitos durante 21 días consecutivos con interfaz minimalista tipo iOS. Cuando completes un hábito durante 21 días seguidos, se marca como adquirido y se agrega a tu historial personal.

**Stack:** React Native + Expo + TypeScript + Supabase + Vitest

## 🚀 Configuración inicial

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea/inicia sesión en tu proyecto
2. Abre el archivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Copia TODO el SQL que aparece ahí
4. Ve a tu proyecto en Supabase → **SQL Editor** → **New Query**
5. Pega el SQL y ejecuta
6. Espera a que se creen todas las tablas

### Paso 3: Configurar variables de entorno

1. Ve a tu proyecto en Supabase → **Project Settings** → **API**
2. Copia el **Project URL** (ej: `https://xxxxx.supabase.co`)
3. Copia el **anon public key**
4. Crea un archivo `.env` en la raíz (copia desde `.env.example`)
5. Pega tus credenciales:
```
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 4: Ejecutar la app

```bash
npx expo start -c
```

Luego presiona:
- `w` para abrir en el navegador (recomendado para probar)
- `a` para Android (requiere emulador)
- `i` para iOS (requiere Mac)

## 📋 Características principales

✅ **Crear hábitos** con nombre, descripción, categoría y color personalizable
✅ **Racha individual** - Contador de días consecutivos completados por hábito
✅ **Racha general** - Contador de días con al menos 1 hábito completado
✅ **Ciclo de 21 días** - Automáticamente se marca como adquirido tras 21 días consecutivos
✅ **Confirmación de completado** - Diálogo para evitar completar hábitos accidentalmente
✅ **Calendario visual** - Visualiza el progreso de 21 días de cada hábito
✅ **Métricas** - Dashboard con racha general, hábitos adquiridos y activos
✅ **Perfil** - Gestión de username y datos de usuario
✅ **Autenticación** - Login/Registro seguro con Supabase Auth
✅ **Persistencia completa** - Todo guardado en base de datos Supabase

## 🎨 Pantallas

| Pantalla | Función |
|----------|---------|
| **Auth** | Login y registro de usuarios |
| **Home** | Lista de hábitos activos, racha general y botón para crear |
| **Calendario** | Visualización de 21 días con hábitos activos marcados |
| **Estadísticas** | Dashboard con métricas y hábitos adquiridos |
| **Perfil** | Gestión de usuario y opciones de testing |

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── HabitCard.tsx    # Tarjeta individual de hábito
│   └── TabBar.tsx       # Navegación inferior
├── lib/
│   └── supabase.ts      # Configuración de Supabase
├── models/
│   └── Habit.ts         # Interfaces TypeScript
├── screens/             # Pantallas principales
│   ├── Auth.tsx
│   ├── Home.tsx
│   ├── Calendar.tsx
│   ├── Metrics.tsx
│   └── Profile.tsx
├── storage/             # Servicios de datos
│   ├── habitService.ts   # Lógica de hábitos
│   ├── userService.ts    # Gestión de usuarios
│   └── seedData.ts       # Datos de testing
├── theme/
│   └── colors.ts        # Diseño y colores
└── __tests__/           # Tests unitarios
    ├── habitService.test.ts
    └── calendar.test.ts
```

## 🧪 Testing

Ejecutar tests unitarios:
```bash
npm test              # Modo watch
npm test -- --run     # Una sola pasada
npm test -- --coverage  # Con reporte de cobertura
```

**Estado actual:** ✅ 13 tests pasando (7 utilidades + 6 lógica de calendario)

## 🎨 Diseño y UX

- **Estética iOS minimalista** con colores neutros
- **Tarjetas sin bordes** para diseño limpio (excepto racha general)
- **TabBar transparente** (opacity 0.7) con navegación fluida
- **Títulos grandes** (Typography.title1) con espaciado superior generoso
- **StatusBar blanco** (light-content) en todas las pantallas
- **Confirmación de acciones** antes de completar o eliminar hábitos

## 🔐 Seguridad

- **RLS (Row Level Security)** activado en todas las tablas
- Cada usuario solo puede ver/editar sus propios datos
- **Autenticación con Supabase Auth** (JWT tokens)
- Variables de entorno protegidas

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| "Cannot find EXPO_PUBLIC_SUPABASE_URL" | Verifica que `.env` existe en raíz y reinicia con `npx expo start -c` |
| "Tables don't exist" | Ejecuta el SQL de `SUPABASE_SETUP.md` en Supabase SQL Editor |
| "Cannot use JSX" | Asegúrate que archivos son `.tsx` no `.ts` |
| "Permission denied" | Verifica RLS policies en Supabase (ver `SUPABASE_SETUP.md`) |

## 📚 Documentación adicional

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Guía detallada de configuración
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - SQL y configuración de base de datos
- [FIX_RLS_USERS.md](./FIX_RLS_USERS.md) - Notas sobre Row Level Security

## 📦 Dependencias principales

- `expo` - Framework React Native
- `@supabase/supabase-js` - Cliente de base de datos
- `react-native` - Framework móvil
- `typescript` - Tipado estático
- `vitest` - Testing framework
