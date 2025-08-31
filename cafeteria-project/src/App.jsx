import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login/index.jsx';
import Home from './Home/index.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App
