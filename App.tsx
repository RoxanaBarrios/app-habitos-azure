import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import Home from "./src/screens/Home";
import Auth from "./src/screens/Auth";
import { supabase } from "./src/lib/supabase";
import { ensureUserExists } from "./src/storage/userService";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        // Crear/asegurar que existe el usuario en la tabla users
        ensureUserExists(data.session.user.id, data.session.user.email || "");
      }
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        // Crear/asegurar que existe el usuario cuando cambia el estado
        ensureUserExists(currentSession.user.id, currentSession.user.email || "");
      }
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <Home userId={session.user.id} onLogout={handleLogout} />;
}