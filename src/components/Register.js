// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ users, setUsers, setCurrentUser }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState(''); // <-- Estado para Contraseña
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. VERIFICAR DNI DUPLICADO
    const dniExists = users.some(user => user.dni === dni);
    if (dniExists) {
      alert('❌ Error de Registro: Ya existe un socio registrado con este DNI.');
      return;
    }
    
    // 2. GENERAR ID DE SOCIO ÚNICO
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const newId = maxId + 1;

    // 3. CREAR NUEVO SOCIO (Incluyendo la contraseña)
    const newUser = {
      id: newId,
      nombre: nombre + ' (Socio)',
      email,
      dni,
      password, // <-- Guardar Contraseña
      role: 'user',
      multa: 0,
    };

    // 4. ACTUALIZAR ESTADO
    setUsers([...users, newUser]);
    setCurrentUser(newUser); 
    
    alert(`✅ ¡Registro Exitoso! Bienvenido, ${nombre}. Tu ID de socio es ${newId}.`);

    // 5. REDIRECCIÓN
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Registro de Nuevo Socio</h2>
      <form onSubmit={handleRegister}>
        <label>
          Nombre Completo:
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </label>
        <br />
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
          DNI:
          <input 
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            required 
            pattern="\d*" 
            title="Solo se permiten dígitos para el DNI"
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
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
};

export default Register;