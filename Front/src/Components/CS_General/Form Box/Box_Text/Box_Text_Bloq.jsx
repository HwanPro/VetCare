import React from 'react'
import "./Box_Text.css"

function Box_Text_Bloq({Label, V_Text}) {
    return (
    <div className='form-group'>
        <label>{Label}:</label>
        <input
            type="text"
            value={V_Text}
            readOnly
        />
    </div>
    );
  }

export default Box_Text_Bloq