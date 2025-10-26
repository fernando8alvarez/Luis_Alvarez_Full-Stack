"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import type { SpotifyArtist, Album } from "../../types";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";

export default function ArtistProfile() {
  // Hooks
  const { id } = useParams();
  const router = useRouter();

  // Estado locales
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // EFECTOS

  // Obtener datos del artista y sus álbumes
  useEffect(() => {
    const token =
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SPOTIFY_TOKEN &&
      window.location.hostname === "localhost"
        ? process.env.NEXT_PUBLIC_SPOTIFY_TOKEN
        : localStorage.getItem("spotify_token");
    if (!id || !token) return;

    const fetchArtist = async () => {
      setLoading(true);
      try {
        const resArtist = await fetch(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const artistData = await resArtist.json();
        setArtist(artistData);

        const resAlbums = await fetch(
          `https://api.spotify.com/v1/artists/${id}/albums?limit=12&page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const albumsData = await resAlbums.json();
        setAlbums(albumsData.items || []);
        setCurrentPage(1);
      } catch (e) {
        setArtist(null);
        setAlbums([]);
      }
      setLoading(false);
    };
    fetchArtist();
  }, [id]);

  // Logica de paginación
  const pageSize = 4;
  const totalPages = Math.ceil(albums.length / pageSize);
  const paginatedAlbums = albums.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles.container}>
      <Header />
      {loading ? (
        <Loader />
      ) : !artist ? (
        <div className={styles.container}>
          <p>No se encontró el artista.</p>
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.profileData}>
              <div className={styles.profileImage}>
                <Image
                  src={artist.images?.[0]?.url || "/placeholder.svg"}
                  alt={artist.name}
                  width={250}
                  height={250}
                  className={styles.image}
                />
              </div>
              <div className={styles.artistInfo}>
                <div className={styles.verifiedBadge}>
                  <svg
                    className={styles.checkIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Artista certificado</span>
                </div>
                <h1 className={styles.artistName}>{artist.name}</h1>
                <div className={styles.stats}>
                  <p>Followers: {artist.followers?.total ?? 0}</p>
                  <p>
                    Géneros:{" "}
                    {artist.genres && artist.genres.length > 0
                      ? artist.genres.join(" | ")
                      : "-"}
                  </p>
                  <p>Popularidad: {artist.popularity ?? "-"}</p>
                </div>
              </div>
            </div>
            <img
              src="/assets/whiteArrow.svg"
              alt="Volver"
              className={styles.arrow}
              onClick={() => router.push("/search")}
            />
          </div>
          <div className={styles.albumsSection}>
            <h2 className={styles.sectionTitle}>
              Guarda tus álbumes favoritos de {artist.name}
            </h2>
            <div className={styles.albumsGrid}>
              {paginatedAlbums.map((album) => (
                <div key={album.id} className={styles.albumCard}>
                  <div className={styles.albumImageWrapper}>
                    <Image
                      src={album.images?.[0]?.url || "/placeholder.svg"}
                      alt={album.name}
                      width={300}
                      height={300}
                      className={styles.albumImage}
                    />
                  </div>

                  <div className={styles.albumInfo}>
                    <h3 className={styles.albumName}>{album.name}</h3>
                    <p className={styles.publishedDate}>
                      Publicado: {album.release_date}
                    </p>
                    {/* Aquí puedes agregar lógica para guardar/quitar álbum */}
                    <button className={styles.addButton}>+ Add album</button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
