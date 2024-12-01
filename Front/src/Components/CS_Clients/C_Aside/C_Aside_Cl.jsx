import React from 'react';
import './C_Aside_Cl.css';
import Btn_Nav_Active from '../../CS_General/Buttons/Btn_Nav_Active/Btn_Nav_Active';
import Btn_Nav from '../../CS_General/Buttons/Btn_Nav/Btn_Nav';
import Btn_Logout from '../../CS_General/Buttons/Btn_Logout/Btn_Logout';
import { Link } from 'react-router-dom';

function C_Aside_Cl({ nameCliente }) {
  return (
    <aside className="sidebar">
      <ul className="nav">
        <Link to="agenda" className="no-underline">
          <li className="option-nav active">
            <Btn_Nav_Active />
          </li>
        </Link>

        <Link to="perfil" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption={nameCliente} nameIcon="Account_Circle" />
          </li>
        </Link>

        <Link to="mascotas" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption="Mascotas" nameIcon="Pets" />
          </li>
        </Link>

        <Link to="servicios" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption="Servicios" nameIcon="Medical_Services" />
          </li>
        </Link>

        <Link to="citas" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption="Citas" nameIcon="Calendar_Month" />
          </li>
        </Link>

        <Link to="notificaciones" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption="Recordatorios | Notificaciones" nameIcon="Notifications" />
          </li>
        </Link>

        <Link to="herramientas" className="no-underline">
          <li className="option-nav">
            <Btn_Nav nameOption="Herramientas" nameIcon="Settings" />
          </li>
        </Link>
      </ul>
      <Btn_Logout />
    </aside>
  );
}

export default C_Aside_Cl;
