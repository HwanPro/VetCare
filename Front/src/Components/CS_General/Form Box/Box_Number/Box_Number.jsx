import React from 'react';
import "../Box_Text/Box_Text.css";

function Box_Number({ Label, V_Number, onChange, name, min, max, readOnly = false }) {
    return (
        <div className="form-group">
            <label>{Label}:</label>
            <input
                type="number"
                value={V_Number}
                onChange={onChange}
                name={name}
                min={min}
                max={max}
                readOnly={readOnly}
                className="input-box"
            />
        </div>
    );
}

export default Box_Number;
