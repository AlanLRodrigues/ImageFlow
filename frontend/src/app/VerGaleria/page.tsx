'use client'; // Indica que este componente será executado no cliente (navegador)

import { useState, useEffect } from 'react'; // Hooks do React para estado e efeito
import axios from 'axios'; // Biblioteca para requisições HTTP
import { useRouter } from 'next/navigation'; // Hook do Next.js para redirecionamento de rotas
import Headerimg from '../components/HeaderImg/page'; // Componente de cabeçalho
import Swal from 'sweetalert2'; // Biblioteca para mostrar alertas bonitos
import styles from '@/app/components/styles/verGaleria.module.css'; // Estilos CSS do componente
import Footer from '../components/Footer/page';

export default function VerGaleria() {
  // Estado para armazenar a lista de arquivos (imagens e vídeos)
  const [files, setFiles] = useState<any[]>([]);
  // Estado para indicar se está carregando os arquivos
  const [isLoading, setIsLoading] = useState(true);
  // Estado que controla se o modal está aberto
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado que armazena a mídia selecionada para exibir no modal
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const router = useRouter(); // Para navegar entre páginas

  // Função que busca os arquivos da API
  const fetchFiles = async () => {
    try {
      // Faz a requisição para o backend
      const res = await axios.get('http://localhost:5001/images', {
        withCredentials: true, // Envia os cookies de autenticação
      });
      setFiles(res.data); // Salva os arquivos recebidos no estado
    } catch {
      // Se der erro, redireciona o usuário para o login
      alert('Faça login para ver os arquivos');
      router.push('/Log');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  // Executa a função de busca de arquivos quando o componente for montado
  useEffect(() => {
    fetchFiles();
  }, []);

  // Função para deletar um arquivo (imagem ou vídeo)
  const handleDelete = async (id_img: number) => {
    // Pergunta se o usuário tem certeza que deseja deletar
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Este arquivo será deletado permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    });

    // Se o usuário confirmou
    if (result.isConfirmed) {
      try {
        // Faz a requisição para deletar o arquivo
        await axios.delete(`http://localhost:5001/images/${id_img}`, {
          withCredentials: true,
        });
        fetchFiles(); // Atualiza a lista após deletar
        Swal.fire('Deletado!', 'O arquivo foi deletado.', 'success');
      } catch (err) {
        console.error('Erro ao deletar:', err);
        Swal.fire('Erro!', 'Algo deu errado. Tente novamente.', 'error');
      }
    }
  };

  // Abre o modal e define a mídia selecionada
  const handleMediaClick = (mediaSrc: string) => {
    setSelectedMedia(mediaSrc);
    setIsModalOpen(true);
  };

  // Fecha o modal e limpa a mídia selecionada
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  // Verifica se o arquivo é uma imagem
  const isImageFile = (filename: string) =>
    /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(filename);

  // Verifica se o arquivo é um vídeo
  const isVideoFile = (filename: string) =>
    /\.(mp4|webm|ogg|mov)$/i.test(filename);

  return (
    <div className={styles.container}>
      {/* Cabeçalho da página */}
      <Headerimg />

      <div>
        <div className={styles.galleryContainer}>
          {isLoading ? (
            // Se estiver carregando, mostra o spinner de carregamento
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
            </div>
          ) : files.length === 0 ? (
            // Se não houver arquivos, mostra mensagem de vazio
            <div className={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.emptyIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className={styles.emptyText}>Nenhum arquivo encontrado.</p>
            </div>
          ) : (
            // Se houver arquivos, mostra a galeria
            <div className={styles.galleryGrid}>
              {files.map((file) => {
                const fileUrl = `http://localhost:5001/upload/${file.name_img}`;
                return (
                  <div key={file.id_img} className={styles.imageCard}>
                    <div className={styles.imageContainer}>
                      {isImageFile(file.name_img) ? (
                        // Exibe imagem
                        <img
                          src={fileUrl}
                          alt={file.name_img}
                          className={styles.image}
                          loading="lazy"
                          onClick={() => handleMediaClick(fileUrl)}
                        />
                      ) : isVideoFile(file.name_img) ? (
                        // Exibe vídeo
                        <video
                          className={styles.video}
                          controls
                          onClick={() => handleMediaClick(fileUrl)}
                        >
                          <source src={fileUrl} type="video/mp4" />
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      ) : (
                        // Arquivo não suportado
                        <p>Arquivo não suportado</p>
                      )}
                    </div>

                    {/* Rodapé do card com botão de deletar */}
                    <div className={styles.cardFooter}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          onClick={() => handleDelete(file.id_img)}
                          className={styles.deleteButton}
                          title="Deletar arquivo"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.deleteIcon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer/>
      {/* Modal que exibe a mídia em tamanho maior */}
      {isModalOpen && selectedMedia && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {isVideoFile(selectedMedia) ? (
              // Se for vídeo, mostra vídeo
              <video className={styles.modalVideo} controls autoPlay>
                <source src={selectedMedia} />
                Seu navegador não suporta vídeo.
              </video>
            ) : (
              // Se for imagem, mostra imagem
              <img src={selectedMedia} alt="preview" className={styles.modalImage} />
            )}
          </div>
        </div>
  
        
      )}
    </div>
  );
}
