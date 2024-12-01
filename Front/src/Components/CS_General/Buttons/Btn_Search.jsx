import React from 'react'
import "./Buttons.css"

function Btn_Search({ nameId, showContent = 'icon', onClick }) {
    return (
        <button
            id={nameId}
            type="button" // Cambiado a button
            className={`btn btn-primary ${showContent}`}
            onClick={onClick} // Ejecutar la función pasada como prop
        >
            {showContent === 'icon' && (
                <span className="material-symbols-outlined">search</span>
            )}
            {showContent === 'text+icon' && (
                <>
                    <span>Buscar</span>
                    <span className="material-symbols-outlined">search</span>
                </>
            )}
        </button>
    );
}
export default Btn_Search;
