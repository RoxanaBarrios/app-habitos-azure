# 🚀 Guía de Configuración - app-habitos

Este documento te guía paso a paso para configurar y ejecutar la aplicación completa.

## 📋 Requisitos previos

- Node.js instalado
- Cuenta en [Supabase](https://supabase.com)
- Expo CLI (se instala con npm)

---

## ✅ Paso 1: Instalar dependencias

Ya lo hiciste con `npm install`. Si aún no lo haces:

```bash
cd c:\Users\wendy\app-habitos
npm install
```

---

## 🔐 Paso 2: Configurar Supabase (CRÍTICO)

### 2.1 Crear tablas en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto o selecciona uno existente
4. En el sidebar, ve a **SQL Editor**
5. Haz clic en **New Query**
6. Abre el archivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) en tu editor
7. Copia TODO el SQL (desde `CREATE TABLE users` hasta el final)
8. Pégalo en la query de Supabase
9. Haz clic en **Run** (arriba a la derecha)
10. Espera a que se ejecute sin errores ✅

**Si ves errores:**
- Verifica que hayas copiado TODO el SQL
- Intenta correr cada tabla por separado si hay conflictos

### 2.2 Obtener credenciales

1. En Supabase, ve a **Project Settings** (ícono de engranaje, abajo en sidebar)
2. En la izquierda, ve a **API**
3. Verás:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** (es tu ANON_KEY)

**Copia ambos valores**

---

## 🔑 Paso 3: Crear archivo `.env`

1. En VS Code, abre la carpeta `c:\Users\wendy\app-habitos`
2. Crea un archivo llamado `.env` (sin nada antes del punto)
3. Pega esto:

```
EXPO_PUBLIC_SUPABASE_URL=https://tu-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

4. Reemplaza:
   - `https://tu-project-url.supabase.co` → tu Project URL
   - `tu-anon-key-aqui` → tu anon public key

5. **Guarda el archivo** (Ctrl+S)

---

## 🎮 Paso 4: Ejecutar la aplicación

### En Windows PowerShell:

```bash
cd c:\Users\wendy\app-habitos
npx expo start -c
```

**Espera hasta que veas:**
```
Opening Expo Go on your phone...
or press 'w' to open in web
```

### Opciones para abrir:

- **Presiona `w`** → Abre en navegador (recomendado para empezar)
- **Presiona `a`** → Abre en emulador Android (requiere Android Studio)
- **Presiona `i`** → Abre en emulador iOS (requiere Mac)

---

## 🧪 Paso 5: Probar la aplicación

### Primera vez (sin cuenta):

1. Haz clic en **"No tengo cuenta, crear una"**
2. Completa:
   - **Email**: algo@gmail.com
   - **Nombre de usuario**: tusername
   - **Contraseña**: mínimo 6 caracteres
   - **Confirmar contraseña**: igual a arriba
3. Haz clic en **"Registrarme"**
4. Verás: "Cuenta creada. Revisa tu correo para confirmar"
5. Supabase enviará un email (puede tardar 1-2 minutos)
6. Haz clic en el enlace del email
7. Vuelve a la app e **inicia sesión**

### Una vez dentro:

1. **Crear un hábito**:
   - Nombre: "Correr"
   - Categoría: "Deporte"
   - Color: "Verde"
   - Descripción: "Correr 5km"
   - Haz clic en **"Agregar hábito"**

2. **Completar el hábito**:
   - Haz clic en **"Completar"** en la tarjeta
   - Verás que la barra de progreso avanza (1/21)
   - La racha general sube a 1

3. **Acceso a otras pantallas**:
   - **📊 Métricas**: Ve tu racha y hábitos adquiridos
   - **📅 Calendario**: Ve días con hábitos programados
   - **👤 Perfil**: Edita tu nombre de usuario

---

## 🎯 Flujo completo del app

```
Registro/Login
      ↓
Home (crear hábitos)
      ↓
Crear: Nombre → Categoría → Color → Agregar
      ↓
Lista de hábitos (con progreso 1/21)
      ↓
Completar cada día → Racha sube
      ↓
Día 21 → ¡Hábito adquirido! 🎉
      ↓
Se elimina de activos → Aparece en Métricas
```

---

## 📊 Lógica de rachas

**Racha Individual** (por hábito):
- Empieza en 0
- +1 cada día que lo completes
- Se reinicia a 0 si no lo completas
- Al llegar a 21 → Adquirido ✓

**Racha General** (usuario):
- Cuenta días seguidos completando AL MENOS 1 hábito
- Si un día NO completa ninguno → Se reinicia a 0

---

## 🆘 Troubleshooting

### Error: "Cannot find EXPO_PUBLIC_SUPABASE_URL"
**Solución:**
- Verifica que `.env` existe en la raíz
- Reinicia Expo: `npx expo start -c`
- Recarga el navegador (F5)

### Error: "relation 'habits' does not exist"
**Solución:**
- Las tablas no se crearon en Supabase
- Vuelve al Paso 2.1 y ejecuta el SQL de nuevo

### Error: "Invalid login credentials"
**Solución:**
- Verifica que el email existe en Supabase
- Puede que no hayas confirmado el email
- Revisa spam/correo no deseado

### La app se ve fea / texto pequeño
**Solución:**
- Es normal en navegador
- Funciona mejor en móvil
- Puedes ajustar zoom del navegador (Ctrl + mouse wheel)

---

## 🚀 Próximos pasos (opcionales)

Para mejorar más:
- [ ] Agregar foto de perfil
- [ ] Notificaciones locales diarias
- [ ] Exportar hábitos a PDF
- [ ] Dark mode
- [ ] Modo offline

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los errores en la consola (en rojo)
2. Verifica que Supabase está configurado correctamente
3. Asegúrate que `.env` tiene las credenciales correctas
4. Intenta: `npx expo start -c` (con -c limpia caché)

---

¡Listo! 🎉 La aplicación está completamente configurada.
