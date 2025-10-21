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
  // FUNCIÓN: AGREGAR LIBRO (Mantenida)
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
  // FUNCIÓN: ELIMINAR LIBRO (Mantenida)
  // -------------------------------------------------------------
  const handleDeleteBook = (isbn) => {
    const bookToDelete = books.find(b => b.isbn === isbn);

    if (!window.confirm(`¿Estás seguro de que quieres eliminar el libro "${bookToDelete.titulo}" con ISBN: ${isbn}?`)) {
        return;
    }
    
    if (bookToDelete.estado !== 'disponible') {
        alert('❌ Error: No se puede eliminar un libro que está PRESTADO o PENDIENTE DE REVISIÓN. Debe estar DISPONIBLE.');
        return;
    }

    const updatedBooksList = books.filter(book => book.isbn !== isbn);
    setBooks(updatedBooksList);
    alert(`✅ Libro con ISBN ${isbn} ha sido eliminado del inventario.`);
  };


  // -------------------------------------------------------------
  // FUNCIÓN: PROCESAR DEVOLUCIÓN FINAL (AJUSTADA)
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
              alert(`🚨 Libro dañado. Se aplicó multa de $${MULTA_MONTO} a ${loaner.nombre}. Multa total pendiente: $${newMulta}.`);
              
              // **AJUSTE:** Solo actualizamos el monto de la multa
              updatedUser = { ...loaner, multa: newMulta }; 
          }
      } else {
          alert(`✅ Devolución de ${bookToReturn.titulo} aprobada. Sin multa.`);
      }
      
      // 2. Proceso de Devolución del Libro
      const returnedBook = {
          ...bookToReturn,
          estado: 'disponible', 
          prestadoA_socioID: null,
          fechaDevolucionEstimada: null,
          fechaInicioPrestamo: null, 
      };
      
      // Actualizar la lista de Libros
      const updatedBooksList = books.map(book => 
          book.isbn === bookIsbn ? returnedBook : book
      );
      setBooks(updatedBooksList);

      // 3. Actualizar la lista de Usuarios
      if (updatedUser) {
          const updatedUsersList = users.map(user => 
              user.id === updatedUser.id ? updatedUser : user
          );
          setUsers(updatedUsersList);
      }
  };


  // -------------------------------------------------------------
  // FUNCIÓN: CONFIRMAR PAGO DE MULTA (AJUSTADA)
  // -------------------------------------------------------------
  const handleConfirmPayment = (userId) => {
      const userToUpdate = getUser(userId);
      if (!userToUpdate) return;
      
      if (!window.confirm(`¿Confirmar el pago de $${userToUpdate.multa} por parte de ${userToUpdate.nombre}?`)) {
          return;
      }
      
      // **AJUSTE:** Al confirmar pago, solo ponemos la multa en 0
      const updatedUser = { 
          ...userToUpdate, 
          multa: 0, 
      };
      
      const updatedUsersList = users.map(user => 
          user.id === userId ? updatedUser : user
      );
      setUsers(updatedUsersList);
      alert(`✅ Pago de multa de $${userToUpdate.multa} confirmado para ${userToUpdate.nombre}.`);
  };


  return (
    <div>
      <h2>Panel de Administración 🛠️</h2>
      
      {/* ------------------- GESTIÓN DE DEVOLUCIONES PENDIENTES ------------------- */}
      <h3>Libros Pendientes de Revisión ({booksPendingReview.length})</h3>
      {booksPendingReview.length > 0 ? (
          <table className="admin-table">
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
                        style={{ backgroundColor: '#a5d6a7', marginRight: '5px' }}
                    >
                        Aprobar (Buen Estado)
                    </button>
                    <button 
                        onClick={() => handleFinalDevolution(book.isbn, book.prestadoA_socioID, true)}
                        style={{ backgroundColor: '#ef9a9a' }}
                    >
                        Libro dañado (Aplicar Multa $5000)
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
      <table className="admin-table">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Socio</th>
            <th>F. Préstamo</th> {/* <-- COLUMNA AGREGADA */}
            <th>F. Devolución Est.</th> {/* <-- COLUMNA AGREGADA */}
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.isbn}>
              <td>{book.isbn}</td>
              <td>**{book.titulo}**</td>
              <td>{book.autor}</td>
              <td 
                className={
                    book.estado === 'disponible' ? 'text-green' : 
                    (book.estado === 'pendiente_revision' ? 'text-blue' : 'text-red')
                }
              >
                **{book.estado.toUpperCase()}**
              </td>
              <td>{book.prestadoA_socioID ? getUserName(book.prestadoA_socioID) : '---'}</td>
              
              {/* <-- MOSTRAR FECHAS AQUÍ --> */}
              <td>{book.fechaInicioPrestamo || '---'}</td> 
              <td>{book.fechaDevolucionEstimada || '---'}</td> 
              
              <td>
                <button 
                    onClick={() => handleDeleteBook(book.isbn)}
                    disabled={book.estado !== 'disponible'}
                    style={{ backgroundColor: book.estado !== 'disponible' ? '#ccc' : '#f44336', color: 'white' }} 
                >
                    Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {/* ------------------- ESTADO DE SOCIOS Y MULTAS ------------------- */}
      <hr />
      <h4>Estado de Socios y Gestión de Multas</h4>
       <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>DNI</th> 
            <th>Multa Pendiente</th>
            <th>Estado Pago</th>
            <th>Gestión de Pago</th> 
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.role === 'user').map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.dni || 'N/A'}</td>
              <td className={user.multa > 0 ? 'text-red' : 'text-green'}> 
                **${user.multa}**
              </td>
              <td>
                {/* Lógica de Visualización Ajustada */}
                <span className={user.multa > 0 ? 'text-red' : 'text-green'}>
                    {user.multa > 0 ? 'DEUDA' : 'AL DÍA'}
                </span>
              </td>
              <td>
                {/* Botón para confirmar el pago */}
                <button 
                    onClick={() => handleConfirmPayment(user.id)}
                    disabled={user.multa === 0} // Deshabilitar si la multa es 0
                    style={{ 
                        backgroundColor: user.multa === 0 ? '#ccc' : '#4CAF50',
                        color: 'white' 
                    }}
                >
                    Confirmar Pago
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;