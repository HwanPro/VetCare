import React from 'react';
import "./Buttons.css";

function Btn_Delete({ nameId, showContent = 'icon', onDelete }) {
  return (
    <button 
      id={nameId} 
      type="button" 
      className={`btn btn-danger ${showContent}`} 
      onClick={() => onDelete(nameId)} 
    >
      {showContent === 'icon' && (
        <span className="material-symbols-outlined">delete</span>
      )}
      {showContent === 'text' && 'Eliminar'}
      {showContent === 'text+icon' && (
        <>
          <span>Eliminar</span>
          <span className="material-symbols-outlined">delete</span>
        </>
      )}
      {showContent === 'icon+text' && (
        <>
          <span className="material-symbols-outlined">delete</span>
          <span>Eliminar</span>
        </>
      )}
    </button>
  );
}

export default Btn_Delete;
