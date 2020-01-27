import React, { useState, useEffect } from 'react';

import api from './services/api'; 

import './global.css';
import './App.css';
import './Main.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';
// Componente - Bloco isolado de html, css e js, o qual não interfere no resto da aplicação
// Propiedade - informações que um componente pai passa para um componente filho
// Estado - informações mantidadas pelo componente (lembrar: imutabilidade)

// useEffect - dispara sempre que um valor for alterado, ou quantas vezes for preciso

function App() { 
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();

  }, []);

  async function handleSubmit(data) {

    const response = await api.post('/devs', data);
       
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleSubmit}/>
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}         
        </ul>

      </main>
    </div>    
  );
}

export default App;
