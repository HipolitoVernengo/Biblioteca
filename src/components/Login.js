// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ users, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // <-- Estado para Contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    const user = users.find(u => u.email === email);

    if (user) {
        // 1. Verificar la contraseña
        if (user.password === password) {
            setCurrentUser(user); 
            // Redirigir según el rol
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            setError('❌ Contraseña incorrecta.');
        }
    } else {
      setError('❌ Email no encontrado.');
    }
  };

  return (
    <div>
      <h3>Iniciar Sesión</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </label>
        <br />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;