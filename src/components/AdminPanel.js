// src/components/AdminPanel.js
import React, { useState } from 'react';

const MULTA_MONTO = 5000; // 5 mil pesos

const AdminPanel = ({ books, setBooks, users, setUsers }) => {
  const [isbn, setIsbn] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  // Libros que están PENDIENTES DE REVISIÓN
  const booksPendingReview = books.filter(b => b.estado === 'pendiente_revision');

  // Funciones Auxiliares
  const getUser = (id) => users.find(u => u.id === id);
  const getUserName = (id) => {
      const user = getUser(id);
      return user ? user.nombre : 'Socio Desconocido'; // Nombre completo
  };


  // -------------------------------------------------------------
  // FUNCIÓN: AGREGAR LIBRO
  // -------------------------------------------------------------
  const handleAddBook = (e) => {
    e.preventDefault();
    if (books.some(b => b.isbn === isbn)) {
      alert('⚠️ Ya existe un libro con este ISBN.');
      return;
    }

    const newBook = {
      isbn,
      titulo,
      autor,
      estado: 'disponible', 
      prestadoA_socioID: null,
      fechaDevolucionEstimada: null,
      fechaInicioPrestamo: null,
    };

    setBooks([...books, newBook]); 
    setIsbn(''); setTitulo(''); setAutor('');
  };
  

  // -------------------------------------------------------------
  // FUNCIÓN: PROCESAR DEVOLUCIÓN FINAL (con o sin multa)
  // -------------------------------------------------------------
  const handleFinalDevolution = (bookIsbn, bookLoanerId, isDamaged) => {
      const bookToReturn = books.find(b => b.isbn === bookIsbn);
      if (!bookToReturn) return;

      // 1. Proceso de Multa
      let updatedUser = null;
      const loaner = getUser(bookLoanerId);
      
      if (isDamaged) {
          if (loaner) {
              const newMulta = loaner.multa + MULTA_MONTO;
              alert(`🚨 Libro dañado. Se aplicó multa de $${MULTA_MONTO} a ${loaner.nombre}. Multa total: $${newMulta}.`);
              updatedUser = { ...loaner, multa: newMulta };
          }
      } else {
          alert(`✅ Devolución de ${bookToReturn.titulo} aprobada. Sin multa.`);
      }
      
      // 2. Proceso de Devolución del Libro (estado disponible y limpiar datos)
      const returnedBook = {
          ...bookToReturn,
          estado: 'disponible', 
          prestadoA_socioID: null,
          fechaDevolucionEstimada: null,
          fechaInicioPrestamo: null, // Limpiamos la fecha de inicio
      };
      
      // Actualizar la lista de Libros
      const updatedBooksList = books.map(book => 
          book.isbn === bookIsbn ? returnedBook : book
      );
      setBooks(updatedBooksList);

      // 3. Actualizar la lista de Usuarios (si hubo multa)
      if (updatedUser) {
          const updatedUsersList = users.map(user => 
              user.id === updatedUser.id ? updatedUser : user
          );
          setUsers(updatedUsersList);
      }
  };


  return (
    <div>
      <h2>Panel de Administración 🛠️</h2>
      
      {/* ------------------- GESTIÓN DE DEVOLUCIONES PENDIENTES ------------------- */}
      <h3>Libros Pendientes de Revisión ({booksPendingReview.length})</h3>
      {booksPendingReview.length > 0 ? (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Socio (Devuelve)</th>
                <th>Fecha de Préstamo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {booksPendingReview.map(book => (
                <tr key={book.isbn}>
                  <td>**{book.titulo}**</td>
                  <td>{getUserName(book.prestadoA_socioID)}</td>
                  <td>{book.fechaInicioPrestamo || 'N/A'}</td>
                  <td>
                    <button 
                        onClick={() => handleFinalDevolution(book.isbn, book.prestadoA_socioID, false)}
                        style={{ background: 'lightgreen', marginRight: '5px' }}
                    >
                        Aprobar (Buen Estado)
                    </button>
                    <button 
                        onClick={() => handleFinalDevolution(book.isbn, book.prestadoA_socioID, true)}
                        style={{ background: 'salmon' }}
                    >
                        Aprobar (Aplicar Multa $5000)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : (
          <p>🎉 No hay libros pendientes de revisión en este momento.</p>
      )}

      {/* ------------------- AGREGAR NUEVO LIBRO ------------------- */}
      <hr />
      <h4>Agregar Nuevo Libro</h4>
      <form onSubmit={handleAddBook} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} required />
        <button type="submit">Añadir Libro</button>
      </form>

      {/* ------------------- INVENTARIO DE LIBROS ------------------- */}
      <hr />
      <h4>Inventario de Libros ({books.length})</h4>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Socio</th>
            <th>Devolución Estimada</th>
            <th>Fecha Préstamo</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.isbn}>
              <td>{book.isbn}</td>
              <td>**{book.titulo}**</td>
              <td>{book.autor}</td>
              <td style={{ color: book.estado === 'disponible' ? 'green' : (book.estado === 'pendiente_revision' ? 'blue' : 'red') }}>
                **{book.estado.toUpperCase()}**
              </td>
              <td>{book.prestadoA_socioID ? getUserName(book.prestadoA_socioID) : '---'}</td>
              <td>{book.fechaDevolucionEstimada || '---'}</td>
              <td>{book.fechaInicioPrestamo || '---'}</td> 
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* ------------------- ESTADO DE SOCIOS Y MULTAS ------------------- */}
      <hr />
      <h4>Estado de Socios y Multas</h4>
       <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Multa Acumulada</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.role === 'user').map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td style={{ color: user.multa > 0 ? 'red' : 'inherit', fontWeight: user.multa > 0 ? 'bold' : 'normal' }}>
                ${user.multa}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;