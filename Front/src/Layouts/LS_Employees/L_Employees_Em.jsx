import React from 'react'
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_TableEmpleados from '../../Components/CS_Employees/C_TableEmpleados'


function L_Employees_Em() {
  
  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Gestión de Empleados"}/>
            <C_TableEmpleados />
        </div>
    </section>
  )
}

export default L_Employees_Em