'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/components/styles/LogForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '@/lib/api';
import Footer from './components/Footer/page';

const LogForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Inicializa o router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha todos os campos',
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
      // Faz a requisição para o backend para autenticar o usuário
      const response = await api.post("http://localhost:5001/login", 
        { email, password }, 
        { withCredentials: true }  // isso é o mais importante para cookies funcionarem
      ); 

      await Swal.fire({
        icon: 'success',
        title: 'Login realizado com sucesso!',
        text: 'Você será redirecionado para a página inicial.',
        background: 'white',
        color: 'black',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
            popup: 'swal2-dark',
            
          },
      });

      // Redireciona para a página desejada após o login
      router.push('/Home'); // Altere para a página que você deseja redirecionar

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao fazer login',
        text: 'Verifique suas credenciais e tente novamente.',
        confirmButtonText: 'Fechar',
        confirmButtonColor: 'white',
        background: 'white',
        color: '#black',
        customClass: {
          popup: 'swal2-dark',
          confirmButton: 'swal2-confirm-button',
        },
      });
    }
  };

  return (
    <div>
    <div className={styles.containerlog}>
      <div className={styles.efect}>
        <div className={styles.overlay}>

          <h1 className={styles.welcome}>Entre novamente no <br></br>fluxo que inspira.</h1>
          <hr className={styles.linha}></hr>
          <Image
            src="/logo.jpg"
            alt='logo'
            width={250}
            height={100}
        />
          <hr className={styles.linha}/>
          <h1>
          Seus momentos, suas histórias, 
          <br></br>seu poder de criação.
          </h1>
        </div>
      </div>
  
      <div className={styles.log}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.tit}>Login</h2>
  
        
          <div className={styles.formgroup}>
            <label className={styles.lab} htmlFor="email"></label>
            <input
              className={styles.input}
              type="email"
              id="email"
              value={email}
              placeholder="Digite seu Email"
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>
  
          <div className={styles.formgroup}>
            <label className={styles.lab} htmlFor="password"></label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              placeholder="Digite sua Senha"
              onChange={(e) => setPassword(e.target.value)}

            />
            
          </div>
        
          <div>
            <button className={styles.button01} type="submit">Entrar</button>
          </div>
  
          <Link href="/cads">
            <button className={styles.linklog}>Não tem conta? Cadastre-se Aqui</button>
          </Link>
        </form>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default LogForm;