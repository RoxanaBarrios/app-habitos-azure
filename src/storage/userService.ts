import { supabase } from '../lib/supabase';
import { User } from '../models/Habit';

/**
 * Crea o obtiene el usuario en la tabla users
 */
export const ensureUserExists = async (userId: string, email: string): Promise<User | null> => {
  try {
    // Verifica si el usuario ya existe
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Si no existe, generar un username basado en el email
    const baseUsername = email.split('@')[0];
    let username = baseUsername;
    let counter = 1;

    // Verificar si el username ya existe
    while (true) {
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (!existingUsername) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Crear nuevo usuario
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creando usuario:', createError);
      // Si falla por RLS, el usuario se creó pero no podemos leerlo
      // Retornamos null y lo intentamos de nuevo después
      return null;
    }
    
    return newUser;
  } catch (error) {
    console.error('Error asegurando usuario:', error);
    return null;
  }
};

/**
 * Obtiene los datos del usuario
 */
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

/**
 * Actualiza el nombre de usuario
 */
export const updateUsername = async (userId: string, newUsername: string): Promise<User | null> => {
  try {
    const trimmedUsername = newUsername.trim();

    // Verificar que el nuevo username no exista (excepto el del usuario actual)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', trimmedUsername)
      .neq('id', userId)
      .maybeSingle();

    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        username: trimmedUsername,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error actualizando username:', error);
    return null;
  }
};
