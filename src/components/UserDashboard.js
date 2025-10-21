// src/components/UserDashboard.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ currentUser, books, setBooks }) => {
  const [selectedIsbn, setSelectedIsbn] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Libros prestados por el socio actual (incluye estado 'prestado' y 'pendiente_revision')
  const userBorrowedBooks = books.filter(b => b.prestadoA_socioID === currentUser.id);

  // Calcula el libro seleccionado y su estado.
  const selectedBook = useMemo(() => {
    return books.find(b => b.isbn === selectedIsbn);
  }, [books, selectedIsbn]);
  
  const handleBookSelect = (e) => {
    setSelectedIsbn(e.target.value);
    setFechaFin('');
  };

  // ------------------------------------------------------------------
  // 1. INICIAR DEVOLUCIÓN (Poner en estado 'pendiente_revision')
  // ------------------------------------------------------------------
  const handleReturnInitiation = (isbn) => {
    const bookToReturn = books.find(b => b.isbn === isbn);
    
    const pendingBook = {
        ...bookToReturn,
        estado: 'pendiente_revision', 
    };
    
    const updatedBooksList = books.map(book => 
      book.isbn === isbn ? pendingBook : book
    );

    setBooks(updatedBooksList);
    alert(`⏳ Has iniciado la devolución de "${bookToReturn.titulo}". El bibliotecario lo revisará.`);
  };

  // ------------------------------------------------------------------
  // 2. PROCESAR SOLICITUD DE PRÉSTAMO
  // ------------------------------------------------------------------
  const handleBorrow = (e) => {
    e.preventDefault();

    if (!selectedIsbn || !fechaFin) {
        alert('Por favor, selecciona un libro y una fecha de devolución.');
        return;
    }

    if (!selectedBook || selectedBook.estado !== 'disponible') {
        alert('❌ ¡ERROR! Este libro no está disponible para préstamo.');
        return;
    }
    
    if (userBorrowedBooks.length >= 3) {
        alert('❌ Has alcanzado el límite de 3 libros prestados.');
        return;
    }

    const updatedBook = {
      ...selectedBook,
      estado: 'prestado',
      prestadoA_socioID: currentUser.id,
      fechaDevolucionEstimada: fechaFin,
      fechaInicioPrestamo: new Date().toLocaleDateString('es-ES'), // <-- ¡Fecha de inicio guardada!
    };

    const updatedBooksList = books.map(book => 
      book.isbn === selectedIsbn ? updatedBook : book
    );

    setBooks(updatedBooksList);
    alert(`✅ Solicitado: "${selectedBook.titulo}". Devolución: ${fechaFin}`);
    setSelectedIsbn('');
    setFechaFin('');
  };

  return (
    <div>
      <h2>Mi Cuenta (Socio) 👤</h2>
      
      <hr/>

      {/* -------------------- 1. MIS PRÉSTAMOS -------------------- */}
      <h3>Mis Préstamos ({userBorrowedBooks.length})</h3>
      {userBorrowedBooks.length > 0 ? (
        <ul>
          {userBorrowedBooks.map(book => (
            <li key={book.isbn}>
              **{book.titulo}** (Autor: {book.autor}) - Devolver antes de: **{book.fechaDevolucionEstimada}**
              
              {book.estado === 'prestado' ? (
                <button 
                    onClick={() => handleReturnInitiation(book.isbn)} 
                    style={{ marginLeft: '10px' }}
                >
                    Devolver
                </button>
              ) : (
                 <span style={{ color: 'blue', marginLeft: '10px' }}> (Esperando Revisión del Admin)</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes libros prestados. ¡Pide uno!</p>
      )}

      <hr/>

      {/* -------------------- 2. SOLICITAR PRÉSTAMO -------------------- */}
      <h3>Solicitar Préstamo</h3>
      <form onSubmit={handleBorrow}>
        <label>
          Libro:
          <select value={selectedIsbn} onChange={handleBookSelect} required>
            <option value="">-- Selecciona un Libro --</option>
            {books.map(book => (
              <option key={book.isbn} value={book.isbn}>
                {book.titulo} - {book.autor}
              </option>
            ))}
          </select>
        </label>
        <br />
        
        {selectedBook && (
            <div style={{ padding: '10px', marginTop: '10px', border: '1px solid #ccc' }}>
                <p>
                    **Estado:** <span style={{ fontWeight: 'bold', color: selectedBook.estado === 'disponible' ? 'green' : 'red' }}>
                        {selectedBook.estado.toUpperCase()}
                    </span>
                </p>
                {selectedBook.estado !== 'disponible' && (
                    <p style={{ color: 'red' }}>
                        *Disponible a partir de: **{selectedBook.fechaDevolucionEstimada}***
                    </p>
                )}
            </div>
        )}

        <br />
        <label>
          Fecha Devolución:
          <input 
              type="date" 
              value={fechaFin} 
              onChange={(e) => setFechaFin(e.target.value)} 
              required
              disabled={!selectedBook || selectedBook.estado !== 'disponible'} 
          />
        </label>
        <br />
        <button 
            type="submit"
            disabled={!selectedBook || selectedBook.estado !== 'disponible'}
        >
            Pedir Prestado
        </button>
        {!selectedBook || selectedBook.estado !== 'disponible' && (
            <p style={{color:'red'}}>*Solo puedes pedir prestado si el libro está DISPONIBLE.</p>
        )}
      </form>
      
    </div>
  );
};

export default UserDashboard;