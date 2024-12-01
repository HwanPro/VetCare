import React from 'react';
import "./Box_Text.css";

function Box_Text_Empty({ id, Label, name, value, onChange }) {
    return (
        <div className="form-group">
            <label>{Label}:</label>
            <input
                id={id}
                name={name || id} 
                type="text"
                value={value || ""} 
                onChange={onChange}
                className="input-box"
            />
        </div>
    );
}

export default Box_Text_Empty;
