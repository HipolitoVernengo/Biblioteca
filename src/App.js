// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// --- 1. DATOS DE EJEMPLO (Simulación de una base de datos) ---

// Lista de 10 libros, TODOS inicialmente disponibles
const initialBooks = [
  // **NUEVA ESTRUCTURA:** Ahora incluimos 'fechaInicioPrestamo' para el admin.
  { isbn: '978-0321765723', titulo: 'La Comunidad del Anillo', autor: 'J.R.R. Tolkien', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-0743273565', titulo: 'Dune', autor: 'Frank Herbert', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-0451524935', titulo: '1984', autor: 'George Orwell', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-8437604947', titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-9871138249', titulo: 'Rayuela', autor: 'Julio Cortázar', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-0385504201', titulo: 'El Código Da Vinci', autor: 'Dan Brown', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-8423351984', titulo: 'La Sombra del Viento', autor: 'Carlos Ruiz Zafón', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-0061120084', titulo: 'Matar a un Ruiseñor', autor: 'Harper Lee', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-8408061327', titulo: 'Los Pilares de la Tierra', autor: 'Ken Follett', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
  { isbn: '978-8499086438', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', estado: 'disponible', prestadoA_socioID: null, fechaDevolucionEstimada: null, fechaInicioPrestamo: null },
];

// src/App.js (SOLO MODIFICAR ESTE BLOQUE)

// ...
// src/App.js (Asegúrate de que tus usuarios se vean así)

// ...
// src/App.js (SOLO MODIFICAR ESTE BLOQUE)

// ...
const initialUsers = [
  // Añadido: password
  { id: 1, nombre: 'Hipolito Vernengo (Socio)', email: 'user@user.com', dni: '11111111', role: 'user', multa: 0, password: 'user123' }, 
  { id: 2, nombre: 'Admin Bibliotecario', email: 'admin@admin.com', dni: '99999999', role: 'admin', multa: 0, password: 'admin123' }, 
];
// ...
// ...

// ...

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <nav>
            <Link to="/">Inicio</Link> | 
            {currentUser && currentUser.role === 'admin' && <Link to="/admin"> Panel Admin</Link>}
            {currentUser && currentUser.role === 'user' && <Link to="/dashboard"> Mi Cuenta</Link>}
            {!currentUser && <Link to="/login"> Login</Link>}
            {!currentUser && <Link to="/register"> Registro</Link>}
            {currentUser && <button onClick={() => setCurrentUser(null)} style={{ marginLeft: '10px' }}>Cerrar Sesión</button>}
          </nav>
          {currentUser && <p>Hola, {currentUser.nombre} !</p>}
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login users={users} setCurrentUser={setCurrentUser} />} />
            <Route path="/register" element={<Register users={users} setUsers={setUsers} setCurrentUser={setCurrentUser} />} />

            {/* RUTAS PROTEGIDAS: ADMIN */}
            <Route path="/admin" element={
              currentUser && currentUser.role === 'admin' ? 
                <AdminPanel 
                    books={books} 
                    setBooks={setBooks} 
                    users={users} 
                    setUsers={setUsers} // <--- PASAMOS setUsers
                /> : 
                <p>⚠️ Acceso denegado. Inicia sesión como administrador.</p>
            } />
            
            {/* RUTAS PROTEGIDAS: SOCIO */}
            <Route path="/dashboard" element={
              currentUser && currentUser.role === 'user' ? 
                <UserDashboard 
                  currentUser={currentUser} 
                  books={books} 
                  setBooks={setBooks} 
                /> : 
                <p>⚠️ Acceso denegado. Inicia sesión como socio.</p>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;