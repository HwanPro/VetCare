import React from 'react'
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_TableClientes from '../../Components/CS_Employees/C_TableClientes'

function L_Clients_Em() {
  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Gestión de Clientes"}/>
            <C_TableClientes />
        </div>
    </section>
  )
}

export default L_Clients_Em