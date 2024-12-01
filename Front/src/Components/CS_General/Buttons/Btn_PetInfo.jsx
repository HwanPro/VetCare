import React from 'react';
import "./Buttons.css";

function Btn_PetInfo({ nameId, showContent = 'icon', onClick }) {
  return (
    <div className='Btn' style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        id={nameId}
        name={nameId}
        type="button"
        className={`btn btn-info ${showContent}`}
        onClick={onClick} // Manejar el clic desde aquí
      >
        {showContent === 'icon' && (
          <span className="material-symbols-outlined">description</span>
        )}
        {showContent === 'text+icon' && (
          <>
            <span>Información</span>
            <span className="material-symbols-outlined">description</span>
          </>
        )}
        {showContent === 'icon+text' && (
          <>
            <span className="material-symbols-outlined">description</span>
            <span>Información</span>
          </>
        )}
      </button>
    </div>
  );
}

export default Btn_PetInfo;
