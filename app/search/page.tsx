"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "../components/Pagination";
import Header from "../components/Header";
import type { SpotifyArtist } from "../types";
import Loader from "../components/Loader";
const API_URL = process.env.NEXT_PUBLIC_SPOTIFY_API_URL;

export default function Search() {
  // Hooks
  const router = useRouter();

  // Estado locales
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const pageSize = 4;
  const totalPages = Math.ceil(artists.length / pageSize);
  const paginatedArtists = artists.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // FUNCIONES

  // Buscar artistas
  const handleSearch = async () => {
    const token = localStorage.getItem("spotify_token");

    if (!token || !query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/v1/search?type=artist&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setArtists(data.artists?.items || []);
      setCurrentPage(1);
    } catch (error) {
      setArtists([]);
    }
    setLoading(false);
  };

  // EFECTOS

  // Verificar token de Spotify al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    // if (!token) {
    //   router.replace("/login");
    // }
  }, [router]);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Busca tus <span className={styles.highlight}>artistas</span>
          </h1>
          <p className={styles.subtitle}>
            Encuentra tus artistas favoritos gracias a nuestro buscador y guarda
            tus álbumes favoritos
          </p>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={
                isMobile
                  ? "Ingresa un artista"
                  : "Ingresa el nombre de un artista"
              }
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                isMobile ? (
                  "..."
                ) : (
                  "Buscando..."
                )
              ) : isMobile ? (
                <span className={styles.searchIconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line
                      x1="18"
                      y1="18"
                      x2="15.5"
                      y2="15.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              ) : (
                "Buscar"
              )}
            </button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.resultsSection}>
            <p className={styles.resultsText}>
              {artists.length > 0 &&
                `Mostrando 4 resultados de ${artists.length}`}
            </p>
            <div className={styles.grid}>
              {paginatedArtists.map((artist) => (
                <div
                  className={styles.card}
                  key={artist.id}
                  onClick={() => router.push(`/artist/${artist.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.cardImage}>
                    <img
                      src={artist.images[0]?.url || "/default-artist.png"}
                      alt={artist.name}
                    />
                  </div>
                  <h3 className={styles.cardTitle}>{artist.name}</h3>
                  <p className={styles.cardFollowers}>
                    Followers: {artist.followers.total}
                  </p>
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
