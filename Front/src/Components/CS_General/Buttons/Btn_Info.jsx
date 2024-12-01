import React from 'react'
import "./Buttons.css"

function Btn_Info({nameId, showContent = 'icon', onClick}) {
    return (
    <button id={nameId} 
    type="button" 
    className={`btn btn-secondary ${showContent}`}
    onClick={onClick}
    >
        {showContent === 'icon' && (
            <span className="material-symbols-outlined">Visibility</span>
        )}
        {showContent === 'text+icon' && (
        <>
            <span>Informacion</span>
            <span className="material-symbols-outlined">Visibility</span>
        </>
        )}
        {showContent === 'icon+text' && (
        <>
            <span className="material-symbols-outlined">Visibility</span>
            <span>Ver más</span>
        </>
        )}
    </button>
    )
}

export default Btn_Info