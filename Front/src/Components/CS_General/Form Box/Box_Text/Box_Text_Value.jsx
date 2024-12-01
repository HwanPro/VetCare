import React from 'react';
import "./Box_Text.css";

function Box_Text_Value({ Label, V_Text, onChange, name, type = "text", readOnly = false }) {
    return (
        <div className='form-group'>
            <label>{Label}:</label>
            <input
                type={type}
                value={V_Text}
                onChange={onChange}
                name={name}
                readOnly={readOnly}
                className="input-box"
            />
        </div>
    );
}

export default Box_Text_Value;
