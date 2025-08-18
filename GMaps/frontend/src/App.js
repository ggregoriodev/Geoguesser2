import React from 'react';
import RandomImage from './Components/RandomImage'; 
function App() {
  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🌍 Geoguesser</h1>
      <RandomImage /> {/* Renderiza o componente principal do jogo */}
    </div>
  );
}

export default App; // Exporta o componente principal da aplicação
