"use client";
import "../globals.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function Header() {
  // Hooks
  const router = useRouter();
  const pathname = usePathname();

  // Estado local
  const [isMobile, setIsMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // FUNCIONES

  // Cerrar sesión global de Spotify y local
  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem("spotify_token");
    setTimeout(() => {
      window.open("https://accounts.spotify.com/logout", "_blank");
      router.replace("/login");
      setLoggingOut(false);
    }, 1200);
  };

  // EFECTOS

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {loggingOut && (
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
      <header className="header">
        <div className="logo">{isMobile ? "V-M" : "V-Music"}</div>
        <nav className="nav">
          <a
            href="#"
            className={
              pathname === "/search" || pathname.startsWith("/artist")
                ? "navLink navLinkActive"
                : "navLink"
            }
            onClick={() => router.push("/search")}
          >
            Buscar
          </a>
          <a
            href="#"
            className={
              pathname === "/myAlbums" ? "navLink navLinkActive" : "navLink"
            }
            onClick={() => router.push("/myAlbums")}
          >
            Mis álbumes
          </a>
          <span className="separator">|</span>
          <a href="#" className="navLink" onClick={handleLogout}>
            {isMobile ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
            ) : (
              <span>Cerrar sesión</span>
            )}
          </a>
        </nav>
      </header>
    </>
  );
}
