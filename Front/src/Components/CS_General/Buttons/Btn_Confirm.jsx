import React from 'react';
import './Buttons.css';

function Btn_Confirm({ nameId, showContent = 'icon', onClick }) {
    return (
        <button
            id={nameId}
            type="button"
            className={`btn btn-success ${showContent}`}
            onClick={onClick} // Ejecutar la función pasada como prop
        >
            {showContent === 'icon' && (
                <span className="material-symbols-outlined">check_circle</span>
            )}
            {showContent === 'text+icon' && (
                <>
                    <span>Confirmar</span>
                    <span className="material-symbols-outlined">check_circle</span>
                </>
            )}
        </button>
    );
}

export default Btn_Confirm;
