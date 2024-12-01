import React from 'react';
import './SelectImput.css';

function SelectImput({ label, name, value, options, onChange }) {
    return (
        <div className="form-group">
            <label>{label}:</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="input-box"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectImput;
