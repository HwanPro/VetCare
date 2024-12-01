import React from 'react'
import "./Buttons.css"

function Btn_Subscribe({nameId, showContent = 'icon'}) {
    return (
    <button id={nameId} type="button" className={`btn btn-dark ${showContent}`}>
        {showContent === 'icon' && (
            <span className="material-symbols-outlined">Logout</span>
        )}
        {showContent === 'text+icon' && (
        <>
            <span>Registrase</span>
            <span className="material-symbols-outlined">Logout</span>
        </>
        )}
    </button>
    )
}

export default Btn_Subscribe