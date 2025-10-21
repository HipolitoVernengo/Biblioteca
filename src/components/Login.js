// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ users, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email); // Busca el usuario por email

    if (user) {
      setCurrentUser(user); // Guarda el usuario en el estado global
      // Redirige
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      alert('Email no encontrado. Prueba con: ana@socio.com o admin@biblioteca.com');
    }
  };

  return (
    <div>
      <h3>Iniciar Sesión</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;