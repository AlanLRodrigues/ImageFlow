'use client';

import { useEffect, useState } from "react";
import Headerimg from "../components/HeaderImg/page";
import styles from "@/app/components/styles/Home.module.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Footer from "../components/Footer/page";

export default function BomDia() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pegarNome = () => {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find(c => c.startsWith("token="));
      if (!tokenCookie) return;

      const token = tokenCookie.split("=")[1];
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setNomeUsuario(decoded.name);
      } catch (err) {
        console.error("Erro ao decodificar token", err);
      }
    };

    pegarNome();
  }, []);

  const horaAtual = new Date().getHours();
  let saudacao = "Bom dia";
  if (horaAtual >= 12 && horaAtual < 18) {
    saudacao = "Boa tarde";
  } else if (horaAtual >= 18 || horaAtual < 5) {
    saudacao = "Boa noite";
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sair da conta?',
      text: 'Você tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.get('http://localhost:5001/logout', { withCredentials: true });
        Swal.fire('Deslogado!', 'Você saiu com sucesso.', 'success');
        router.push('/');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        Swal.fire('Erro!', 'Falha ao tentar sair.', 'error');
      }
    }
  };

  return (
    <>
      <Headerimg />
      <main className={styles.main}>
        <div className={styles.quadradoMeio}>
          <h1 className={styles.saudacao}>
            {saudacao}{nomeUsuario ? `, ${nomeUsuario}` : ","}
          </h1>
          <p className={styles.subtexto}>
            Bem-vindo(a) à sua galeria de imagens!
          </p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
