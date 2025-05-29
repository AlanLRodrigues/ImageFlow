'use client';
import { useState, useCallback, useRef } from 'react'; // Importando hooks do React
import { getToken } from '@/lib/auth'; // Função para obter o token de autenticação
import axios from 'axios'; // Biblioteca para fazer requisições HTTP
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas bonitos
import Footer from '../components/Footer/page';

import Headerimg from "../components/HeaderImg/page"; // Importando o componente Headerimg
import styles from "@/app/components/styles/GaleriaCads.module.css"; // Importando os estilos

// Função principal do componente
export default function Cad() {
  // Estados para controlar os arquivos, pré-visualizações e o estado de arrasto
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false); // Para saber se está arrastando algo
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para acessar o input de arquivo

  // Função de upload dos arquivos
  const handleUpload = async () => {
    if (files.length === 0) return; // Se não houver arquivos, não faz nada

    try {
      // Fazendo upload de cada arquivo individualmente
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file); // Adicionando o arquivo à FormData

        // Enviando o arquivo para o servidor
        await axios.post('http://localhost:5001/upload', formData, {
          withCredentials: true, // Permite o envio de cookies
          headers: { Authorization: `Bearer ${getToken()}` }, // Autorização com o token
        });
      }

      // Exibe um alerta de sucesso quando o upload é feito com sucesso
      Swal.fire({
        icon: 'success',
        title: 'Arquivo cadastrado com sucesso!',
        confirmButtonColor: '#3085d6',
      });

      // Limpa os arquivos e as pré-visualizações após o upload
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      // Exibe um alerta de erro caso algo dê errado
      Swal.fire({
        icon: 'error',
        title: 'Erro ao fazer upload',
        text: `${err}`,
      });
    }
  };

  // Função para adicionar arquivos ao estado, com validação para imagens e vídeos
  const addFiles = (newFiles: FileList) => {
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(newFiles).forEach(file => {
      // Verifica se o arquivo é uma imagem ou um vídeo
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        validFiles.push(file); // Adiciona o arquivo válido
        newPreviews.push(URL.createObjectURL(file)); // Cria uma URL para a pré-visualização
      }
    });

    // Atualiza os estados de arquivos e pré-visualizações
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Função chamada quando o arquivo é selecionado através do input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files); // Adiciona os arquivos ao estado
  };

  // Função para gerenciar o arrasto de arquivos
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging); // Atualiza o estado de arrasto
  }, []);

  // Função chamada quando o arquivo é solto na área de arraste
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Finaliza o estado de arrasto
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files); // Adiciona os arquivos arrastados
  }, []);

  // Função para remover um arquivo do estado
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1); // Remove o arquivo
    newPreviews.splice(index, 1); // Remove a pré-visualização correspondente
    setFiles(newFiles); // Atualiza o estado de arquivos
    setPreviews(newPreviews); // Atualiza o estado de pré-visualizações
  };

  return (
    <div className={styles.container}>
      <Headerimg /> {/* Componente do cabeçalho */}
      <div className={styles.mainContainer}>
        <div className={styles.boxWrapper}>
          <div className={styles.contentContainer}>
            <h1 className={styles.title}>Enviar arquivo</h1>

            {/* Área de arrasto de arquivos */}
            <div
              className={`${styles.dropArea} ${isDragging ? styles.dropAreaDragging : ''}`} // Aplica o estilo de "arrastando"
              onClick={() => fileInputRef.current?.click()} // Clica no input de arquivo ao clicar na área
              onDragEnter={(e) => handleDrag(e, true)} // Ativa o estado de arrasto quando entra
              onDragLeave={(e) => handleDrag(e, false)} // Desativa o estado de arrasto quando sai
              onDragOver={(e) => e.preventDefault()} // Impede o comportamento padrão de arrasto
              onDrop={handleDrop} // Chama a função handleDrop quando o arquivo é solto
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange} // Chama a função de mudança de arquivo
                accept="image/*,video/*" // Aceita imagens e vídeos
                multiple
                className={styles.fileInput}
              />

              {/* Exibe as instruções ou as pré-visualizações */}
              {previews.length === 0 ? (
                <>
                  <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className={styles.instructions}>
                    <span className={styles.highlight}>Clique para enviar</span> ou arraste e solte suas imagens ou vídeos aqui
                  </p>
                </>
              ) : (
                <div className={styles.previewContainer}>
                  {/* Exibe as pré-visualizações dos arquivos */}
                  {previews.map((src, index) => (
                    <div key={index} className={styles.mediaBox}>
                      {/* Verifica se o arquivo é uma imagem ou um vídeo */}
                      {files[index].type.startsWith('image/') ? (
                        <img src={src} className={styles.previewImage} alt="preview" />
                      ) : (
                        <video className={styles.previewVideo} controls>
                          <source src={src} type={files[index].type} />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      )}
                      {/* Botão para remover o arquivo */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que o click no botão seja propagado
                          removeFile(index); // Remove o arquivo selecionado
                        }}
                        className={styles.removeButton}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {/* Exibe a quantidade de arquivos selecionados */}
              {files.length > 0 && (
                <div className={styles.fileInfo}>
                  {files.length} arquivo(s) selecionado(s)
                </div>
              )}
              {/* Botão de upload */}
              <button
                onClick={handleUpload}
                disabled={files.length === 0} // Desabilita o botão se não houver arquivos
                className={files.length > 0 ? styles.uploadButton : styles.uploadButtonDisabled}
              >
                Fazer Upload
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
