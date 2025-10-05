"use client";

import styles from "../styles/Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>SHARKS🦈</div>

      <div className={styles.hamburger} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`${styles.navLinks} ${open ? styles.active : ""}`}>
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
      </ul>

    </nav>
  );
}
