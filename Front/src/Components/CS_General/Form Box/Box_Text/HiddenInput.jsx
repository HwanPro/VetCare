import React from 'react';

function HiddenInput({ name, value }) {
    return (
        <input
            type="hidden"
            name={name}
            value={value}
        />
    );
}

export default HiddenInput;
