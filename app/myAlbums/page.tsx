"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
const API_URL = process.env.NEXT_PUBLIC_SPOTIFY_API_URL;

export default function MyAlbums() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;
  const totalPages = Math.ceil(albums.length / pageSize);
  const paginatedAlbums = albums.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // FUNCIONES

  // Función para eliminar un álbum
  const handleRemoveAlbum = async (albumId: string) => {
    const token = localStorage.getItem("spotify_token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/me/albums`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [albumId] }),
      });
      setAlbums((prev: any[]) => prev.filter((a) => a.album.id !== albumId));
    } catch (e) {
      alert("Error al eliminar el álbum. Verifica tu sesión de Spotify.");
    }
  };

  // EFECTOS

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Obtener álbumes guardados
  useEffect(() => {
    const fetchAlbums = async () => {
      const token = localStorage.getItem("spotify_token");
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/me/albums`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAlbums(data.items || []);
        setCurrentPage(1);
      } catch (e) {
        setAlbums([]);
      }
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Mis albumes <span className={styles.highlight}>guardados</span>
          </h1>
          <p className={styles.subtitle}>
            Disfruta de tu música a un solo click y descube que discos has
            guardado dentro de “mis álbumes”
          </p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.resultsSection}>
            <p className={styles.resultsText}>
              {albums.length > 0 &&
                `Mostrando 4 resultados de ${albums.length}`}
            </p>
            <div className={styles.grid}>
              {paginatedAlbums.map((item) => (
                <div className={styles.card} key={item.album.id}>
                  <div className={styles.cardImage}>
                    <img
                      src={item.album.images[0]?.url || "/default-artist.png"}
                      alt={item.album.name}
                    />
                  </div>
                  <h3 className={styles.cardTitle}>{item.album.name}</h3>
                  <p className={styles.cardFollowers}>
                    {item.album.artists.map((a: any) => a.name).join(", ")}
                  </p>
                  <p className={styles.cardFollowers}>
                    Publicado: {item.album.release_date}
                  </p>
                  <button
                    className={styles.addButton}
                    style={{ backgroundColor: "#E3513D", color: "white" }}
                    onClick={() => handleRemoveAlbum(item.album.id)}
                  >
                    Remove album
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.paginationLeft}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
