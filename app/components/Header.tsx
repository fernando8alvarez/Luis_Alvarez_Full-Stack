"use client";
import "../globals.css";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {

  // Hooks
  const router = useRouter();
  const pathname = usePathname();

  // Estado local
  const [isMobile, setIsMobile] = useState(false);

  // EFECTOS

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className="header">
      <div className="logo">{isMobile ? "V-M" : "V-Music"}</div>
      <nav className="nav">
        <a
          href="#"
          className={
            pathname === "/search" ? "navLink navLinkActive" : "navLink"
          }
          onClick={() => router.push("/search")}
        >
          Buscar
        </a>
        <a href="#" className="navLink">
          Mis álbumes
        </a>
        <span className="separator">|</span>
        <a href="#" className="navLink" onClick={onLogout}>
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
  );
}
