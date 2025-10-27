"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
const scopes = "user-read-email user-library-read user-library-modify";

export default function Login() {
  // Estado local
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&scope=${encodeURIComponent(scopes)}`;

  // FUNCIONES

  // Login con Spotify
  const handleLogin = () => {
    setLoading(true);
    window.location.href = authUrl;
  };

  // EFECTOS

  // Manejar el callback de Spotify
  useEffect(() => {
    if (code) {
      setLoading(true);
      fetch(`/api/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("spotify_token", data.access_token);
            window.location.replace("/search");
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [code]);

  // Obtener el código de autorización de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCode(params.get("code"));
  }, []);

  // Redirigir si ya hay usuario logueado
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("spotify_token");
      if (token) {
        setLoading(true);
        window.location.replace("/search");
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      <header className={styles.header}>
        <h1 className={styles.logo}>V-Music</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.arrowSection}>
            <div className={styles.arrowContainer}>
              <img
                src="/assets/greenArrow.svg"
                className={styles.arrowIcon}
                alt=""
              />
            </div>
          </div>
          <div className={styles.textContent}>
            <div>
              <h2 className={styles.heading}>
                <span className={styles.headingWhite}>Disfruta de la</span>
                <br />
                <span className={styles.headingGreen}>mejor música</span>
              </h2>
              <p className={styles.description}>
                Accede a tu cuenta para guardar tus álbumes favoritos.
              </p>
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>
              <span className={styles.loginText}>Log in con Spotify</span>
              <img src="/assets/whiteArrow.svg" className={styles.arrowSmall} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
