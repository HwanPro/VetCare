import React from 'react'
import "./Buttons.css"

function Btn_Report({nameId, showContent = 'icon',onClick}) {

    return (
        <div className="Btn" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
                id={nameId}
                name={nameId}
                type="button"
                className={`btn btn-success ${showContent}`}
                onClick={onClick}
            >
                {showContent === 'icon' && (
                    <span
                        className="material-symbols-outlined"
                        style={{ color: 'white' }}
                    >
                        Print
                    </span>
                )}
                {showContent === 'text+icon' && (
                    <>
                        <span style={{ color: 'white' }}>Generar Reporte</span>
                        <span
                            className="material-symbols-outlined"
                            style={{ color: 'white' }}
                        >
                            Print
                        </span>
                    </>
                )}
                {showContent === 'icon+text' && (
                    <>
                        <span
                            className="material-symbols-outlined"
                            style={{ color: 'white' }}
                        >
                            Print
                        </span>
                        <span style={{ color: 'white' }}>Generar Reporte</span>
                    </>
                )}
            </button>
        </div>
    );
 }
export default Btn_Report