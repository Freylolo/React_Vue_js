import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login/index.jsx';
import Home from './Home/index.jsx';
import Clientes from './Clientes/index.jsx';
import Ordenes from './Ordenes/index.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
       <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ordenes" element={<Ordenes />} />
    </Routes>
  );
}

export default App

