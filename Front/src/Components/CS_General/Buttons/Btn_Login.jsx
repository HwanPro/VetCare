import React from 'react'
import "./Buttons.css"

function Btn_Login({nameId, showContent = 'icon'}) {
    return (
    <button id={nameId} type="submint" className={`btn btn-dark ${showContent}`}>
        {showContent === 'icon' && (
            <span className="material-symbols-outlined">Login</span>
        )}
        {showContent === 'text+icon' && (
        <>
            <span>Entrar</span>
            <span className="material-symbols-outlined">Login</span>
        </>
        )}
    </button>
    )
}

export default Btn_Login