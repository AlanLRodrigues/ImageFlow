'use client';
import Link from 'next/link';
import styles from "@/app/components/styles/Headerimg.module.css";

const Headerimg = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </div>
      <nav>
        <ul className={styles.navList}>
          <li><Link href="/Home" className={styles.navLink}>HOME</Link></li>
          <li><Link href="/CadasGaleria" className={styles.navLink}>ENVIAR IMAGENS </Link></li>
          <li><Link href="/VerGaleria" className={styles.navLink}>MOSTRAR IMAGENS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Headerimg;
