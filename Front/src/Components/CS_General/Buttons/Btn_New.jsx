import React from 'react'
import "./Buttons.css"

function Btn_New({nameId, showContent = 'icon', onNew}) {
    return (
    <div className='Btn' style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={onNew} id={nameId} name={nameId} type="button" className={`btn btn-success ${showContent}`}>
            {showContent === 'icon' && (
                <span className="material-symbols-outlined">add</span>
            )}
            {showContent === 'text+icon' && (
                <>
                    <span>Nuevo</span>
                    <span className="material-symbols-outlined">add</span>
                </>
            )}
        </button>
    </div>
    )
}

export default Btn_New