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
import Modal from "../../components/Modal";
const API_URL = process.env.NEXT_PUBLIC_SPOTIFY_API_URL;

export default function ArtistProfile() {
  // Hooks
  const { id } = useParams();
  const router = useRouter();

  // Estado locales
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumsSaved, setAlbumsSaved] = useState<boolean[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
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
        const resArtist = await fetch(`${API_URL}/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const artistData = await resArtist.json();
        setArtist(artistData);

        const resAlbums = await fetch(
          `${API_URL}/artists/${id}/albums?limit=12&page=${currentPage}`,
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

  // Chequear si los álbumes del artista ya están guardados
  useEffect(() => {
    const checkAlbumsSaved = async () => {
      if (!albums.length) return setAlbumsSaved([]);
      const token = localStorage.getItem("spotify_token");
      if (!token) return setAlbumsSaved([]);
      try {
        const ids = albums.map((a) => a.id).join(",");
        const res = await fetch(
          `${API_URL}/me/albums/contains?ids=${encodeURIComponent(ids)}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setAlbumsSaved(data);
        } else {
          setAlbumsSaved([]);
        }
      } catch {
        setAlbumsSaved([]);
      }
    };
    checkAlbumsSaved();
  }, [albums]);

  // Guardar un solo álbum
  const handleSaveAlbum = async (albumId: string, idx: number) => {
    const token = localStorage.getItem("spotify_token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/me/albums`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [albumId] }),
      });
      setAlbumsSaved((prev) => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
      setModalMsg("Álbum guardado en tu biblioteca.");
      setModalOpen(true);
    } catch (e) {
      setModalMsg("Error al guardar el álbum. Verifica tu sesión de Spotify.");
      setModalOpen(true);
    }
  };

  // Eliminar un solo álbum
  const handleRemoveAlbum = async (albumId: string, idx: number) => {
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
      setAlbumsSaved((prev) => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
      setModalMsg("Álbum eliminado de tu biblioteca.");
      setModalOpen(true);
    } catch (e) {
      setModalMsg("Error al eliminar el álbum. Verifica tu sesión de Spotify.");
      setModalOpen(true);
    }
  };

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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
      />
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
              {paginatedAlbums.map((album, idx) => (
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
                    {albumsSaved[idx] ? (
                      <button
                        className={styles.addButton}
                        style={{ backgroundColor: "#E3513D", color: "white" }}
                        onClick={() => handleRemoveAlbum(album.id, idx)}
                      >
                        Remove album
                      </button>
                    ) : (
                      <button
                        className={styles.addButton}
                        onClick={() => handleSaveAlbum(album.id, idx)}
                      >
                        + Add album
                      </button>
                    )}
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
