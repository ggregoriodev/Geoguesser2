import React, { useState, useEffect } from "react"; // Hooks para estado e efeitos

function RandomImage() {
  const [image, setImage] = useState(null); // Estado para armazenar dados da imagem
  const [loading, setLoading] = useState(false); // Estado para controlar loading
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [guess, setGuess] = useState(''); // Estado para armazenar o palpite do usuário

  const fetchRandomImage = async () => { // Função para buscar imagem aleatória da API
    setLoading(true); // Ativa o estado de loading
    setError(null); // Limpa erros anteriores
    
    try {
      const response = await fetch('http://localhost:3001/api/random-image'); // Faz requisição para o backend
      const data = await response.json(); // Converte resposta para JSON
      
      if (data.success) { // Verifica se a requisição foi bem-sucedida
        setImage(data.image); // Armazena dados da imagem no estado
      } else {
        setError(data.message); // Armazena mensagem de erro
      }
    } catch (err) {
      setError('Erro ao buscar imagem'); // Trata erros de rede/conexão
    } finally {
      setLoading(false); // Desativa o estado de loading
    }
  };

  useEffect(() => {
    fetchRandomImage(); // Executa busca de imagem quando componente é montado
  }, []); // Array vazio = executa apenas uma vez

  // Função para verificar o palpite do usuário
  const Guess = () => {
    if (!image) return; // Se não tem imagem, não faz nada
    
    const userGuess = guess.toLowerCase().trim(); // Pega o palpite do usuário e normaliza
    const correctCity = image.cityName.toLowerCase(); // Nome da cidade correta
    
    if (userGuess === correctCity) {
      alert('🎉 Parabéns! Você acertou!');
    } else {
      alert(`❌ Erro! A cidade correta é: ${image.cityName}`);
    }
    
    setGuess(''); // Limpa o input após o palpite
  };





  return (
    <div>
      <h2>Imagem Aleatória</h2>
      
      {loading && <p>🔄 Carregando...</p>} {/* Mostra loading quando buscando */}
      
      {error && <p>❌ Erro: {error}</p>} {/* Mostra erro se houver */}
      
      {image && ( // Renderiza imagem apenas se existir
        <div>
          <img 
            src={image.url} 
            alt="Imagem de rua aleatória"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
          

          <button onClick={fetchRandomImage} style={{ padding: '10px 20px', margin: '10px' }}>
            Nova Imagem
          </button> {/* Botão para buscar nova imagem */}

                 <input 
           type="text" 
           placeholder="Digite o nome da cidade" 
           value={guess}
           onChange={(e) => setGuess(e.target.value)}
         />
         <button onClick={Guess}>Adivinhar</button>

        </div>
      )}
    </div>
  );
}

export default RandomImage; // Exporta o componente para ser usado em App.js