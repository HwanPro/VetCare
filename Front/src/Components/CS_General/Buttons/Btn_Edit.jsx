import React from 'react'
import "./Buttons.css"

function Btn_Edit({ nameId, showContent = 'icon', onEdit }) {
    return (
        <div className='Btn' style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={onEdit} id={nameId} name={nameId} type="button" className={`btn btn-warning ${showContent}`}>
                {showContent === 'icon' && (
                    <span className="material-symbols-outlined">Edit</span>
                )}
                {showContent === 'text+icon' && (
                    <>
                        <span>Editar</span>
                        <span className="material-symbols-outlined">Edit</span>
                    </>
                )}
            </button>
        </div>
    );
}


export default Btn_Edit