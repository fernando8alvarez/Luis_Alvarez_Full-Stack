"use client";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

//   const isLocal =
//     typeof window !== "undefined" && window.location.hostname === "localhost";
//   const redirectUri = isLocal
//     ? "http://localhost:3000/login"
//     : "https://luis-alvarez-full-stack.vercel.app/login";

//   const handleLogin = () => {
//     window.location.href = `https://accounts.spotify.com/authorize?client_id=dad8def7087741a486c1873745f680fd&response_type=code&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&scope=user-read-email%20user-library-read`;
//   };

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=dad8def7087741a486c1873745f680fd&response_type=code&redirect_uri=https://luis-alvarez-full-stack.vercel.app/login&scope=user-read-email%20user-library-read`;
  };

  useEffect(() => {
    if (code) {
      fetch(`/api/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("spotify_token", data.access_token);
            window.location.replace("/search");
          }
        });
    }
  }, [code]);

  return (
    <div className={styles.container}>
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
