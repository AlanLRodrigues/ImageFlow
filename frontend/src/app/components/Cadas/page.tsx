'use client';
import Link from 'next/link';
import styles from '@/app/components/styles/cadas.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Footer from '@/app/components/Footer/page';

const Cadas = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos!',
        confirmButtonText: 'Entendi',
        confirmButtonColor: 'white',
        background: 'white',
        color: 'black',
        customClass: {
          popup: 'swal2-dark',
          confirmButton: 'swal2-confirm-button',
        },
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) throw data;

      await Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado!',
        text: 'Você será redirecionado para login.',
        background: 'white',
        color: 'black',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'swal2-dark',
        },
      });

      router.push('/');

    } catch (error: any) {
      const errorMsg = error.message || 
                      error.errors?.[0]?.msg || 
                      "Erro ao cadastrar. Tente novamente.";

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
        confirmButtonText: 'Fechar',
        confirmButtonColor: 'white',
        background: 'white',
        color: 'black',
        customClass: {
          popup: 'swal2-dark',
          confirmButton: 'swal2-confirm-button',
        },
      });
    }
  };

 return (
  <div>
    <div className={styles.containercad}>
      <div className={styles.efect}>
        <div className={styles.overlay}>
          <h1 className={styles.welcome}>Seu fluxo começa aqui. <br></br> Cadastre-se!</h1>
          <hr />
          <Image
            src="/logo.jpg"
            alt="logo"
            width={250}
            height={100}
          />
          <hr />
          <h1>
            Onde cada clique constrói uma história!
          </h1>
        </div>
      </div>

      <div className={styles.log}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.tit}>Cadastro</h1>

          <div className={styles.formGroup}>
            <label htmlFor="nome"></label>
            <input
              className={styles.input}
              type="text"
              id="nome"
              value={name}
              placeholder="Nome"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email"></label>
            <input
              className={styles.input}
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password"></label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button className={styles.button02} type="submit">Cadastre-se</button>
          </div>

          <Link href="/">
            <button className={styles.linkcads}>Já tem conta? Faça seu Login aqui</button>
          </Link>
        </form>
      </div>
    </div>
    <Footer />
  </div>
);
};
export default Cadas;