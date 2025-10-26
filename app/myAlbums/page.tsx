"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import type { Album } from "../types";
import Pagination from "../components/Pagination";

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

  console.log(albums);
  

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchAlbums = async () => {
      const token =
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_SPOTIFY_TOKEN &&
        window.location.hostname === "localhost"
          ? process.env.NEXT_PUBLIC_SPOTIFY_TOKEN
          : localStorage.getItem("spotify_token");
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch("https://api.spotify.com/v1/me/albums", {
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
