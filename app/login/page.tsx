import styles from "./page.module.css";

export default function Home() {
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
            <h2 className={styles.heading}>
              <span className={styles.headingWhite}>Disfruta de la</span>
              <br />
              <span className={styles.headingGreen}>mejor música</span>
            </h2>
            <p className={styles.description}>
              Accede a tu cuenta para guardar tus álbumes favoritos.
            </p>
            <button className={styles.loginButton}>
              <span className={styles.loginText}>Log in con Spotify</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
