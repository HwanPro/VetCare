import React from 'react'
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_TableServicios from '../../Components/CS_Employees/C_TablaServicios'

function L_Services_Em() {
  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Gestión de Servicios"}/>
            <C_TableServicios />
        </div>
    </section>
  )
}

export default L_Services_Em