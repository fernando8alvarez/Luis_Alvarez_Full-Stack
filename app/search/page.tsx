"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    router.replace("/login");
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <span style={{ fontWeight: "bold" }}>V-Music</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <main style={{ padding: "2rem" }}>
        <h1>Buscar música</h1>
        <input
          type="text"
          placeholder="Buscar artista, canción o álbum..."
          style={{ width: "100%", maxWidth: 400, padding: 8, fontSize: 16 }}
        />
        {/* Aquí irá la lógica de búsqueda e integración con Spotify */}
      </main>
    </div>
  );
}
