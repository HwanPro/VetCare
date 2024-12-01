import React from 'react'
import "./C_Title.css"

function C_Title({nameTitle}) {
    return (
    <section className='Title'>
        <h2 className="name_Title">
            {nameTitle}
        </h2>
        <hr />
        <div class="linea-horizontal"></div>
    </section>
    )
  }

export default C_Title