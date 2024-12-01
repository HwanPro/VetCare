import React from 'react';
import './Buttons.css';

function Btn_ConfirmPag({ nameId, showContent = 'icon', onClick }) {
    return (
        <button
            id={nameId}
            type="button"
            className={`btn btn-warning ${showContent}`}
            onClick={onClick} // Ejecutar la función pasada como prop
        >
            {showContent === 'icon' && (
                <span className="material-symbols-outlined">Attach_Money</span>
            )}
            {showContent === 'text+icon' && (
                <>
                    <span>Confirmar Pago</span>
                    <span className="material-symbols-outlined">Attach_Money</span>
                </>
            )}
        </button>
    );
}

export default Btn_ConfirmPag;
