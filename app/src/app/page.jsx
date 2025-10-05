"use client";

import Navbar from "./components/Navbar";
import styles from "./styles/LandingPage.module.css";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <section className={styles.hero} id="home">
        <div className={styles.heroBackground}></div>

        <div className={styles.particles} id="particles"></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>SHARKS</h1>
          <h2 className={styles.heroSubtitle}>FROM SPACE</h2>
          <p className={styles.heroDescription}>
            Utilisant les données satellites de la NASA pour prédire les zones
            de chasse des requins. Une révolution dans la conservation marine
            combinant l'intelligence spatiale et la protection des océans.
          </p>
          <button
            className={styles.btnExplore}
            onClick={() =>
              document
                .getElementById("deep-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Dashboard
          </button>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll</span>
          <div className={styles.arrow}></div>
        </div>
      </section>

      <section className={styles.deepOcean} id="deep-section">
        <div className={styles.oceanOverlay}></div>
        <div id="bubbles"></div>

        <div className={styles.deepContent}>
          <h2 className={styles.deepTitle}>DEEP OCEAN INSIGHTS</h2>
          <p className={styles.deepDescription}>
            Plongez dans les profondeurs de l'océan où la technologie spatiale
            rencontre la biologie marine. Découvrez comment nous utilisons les
            données satellites pour protéger et comprendre les requins dans
            leur habitat naturel.
          </p>
        </div>
      </section>
    </div>
  );
}
