import React from 'react'
import axios from 'axios'; 
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_TablaReportes from '../../Components/CS_Employees/C_TablaReportes'

function L_Reports_Em() {

  
  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Reportes"}/>
            <C_TablaReportes />
        </div>
    </section>
  )
}

export default L_Reports_Em