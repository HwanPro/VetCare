import React from 'react'
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_TableCitas from '../../Components/CS_Employees/C_TablaCitas'
function L_Citas_Em() {
  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Gestion de Citas"}/>
            <C_TableCitas />
            <h1></h1>
        </div>
    </section>
  )
}

export default L_Citas_Em