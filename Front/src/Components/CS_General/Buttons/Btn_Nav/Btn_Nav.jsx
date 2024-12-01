import React from 'react';
import './Btn_Nav.css';

function Btn_Nav({ nameOption, nameIcon }) {
  return (
    <button className="nav-button">
      <span className="material-symbols-outlined">{nameIcon}</span>
      {nameOption}
    </button>
  );
}

export default Btn_Nav;
