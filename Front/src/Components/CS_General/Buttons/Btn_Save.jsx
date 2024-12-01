import React from 'react'
import "./Buttons.css"

function Btn_Save({nameId, showContent = 'icon'}) {
    return (
        
    <div className='Btn' style={{display:'flex', justifyContent:'center'}}>
    <button id={nameId} name={nameId} type="button" className={`btn btn-success ${showContent}`}>
        {showContent === 'icon' && (
            <span className="material-symbols-outlined">Save</span>
        )}
        {showContent === 'text+icon' && (
        <>
            <span>Guardar</span>
            <span className="material-symbols-outlined">Save</span>
        </>
        )}
        {showContent === 'icon+text' && (
        <>
            <span className="material-symbols-outlined">Save</span>
            <span>Guardar</span>
        </>
        )}
    </button>
    </div>
    )
}

export default Btn_Save