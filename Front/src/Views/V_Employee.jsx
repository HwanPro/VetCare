import React, { useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import C_Aside_Em from '../Components/CS_Employees/C_Aside_Em/C_Aside_Em';
import L_Agenda_Em from '../Layouts/LS_Employees/L_Agenda_Em';
import L_Profile_Em from '../Layouts/LS_Employees/L_Profile_Em';
import L_Pets_Em from '../Layouts/LS_Employees/L_Pets_Em';
import L_Services_Em from '../Layouts/LS_Employees/L_Services_Em';
import L_Citas_Em from '../Layouts/LS_Employees/L_Citas_Em';
import L_Reports_Em from '../Layouts/LS_Employees/L_Reports_Em';
import L_Clients_Em from '../Layouts/LS_Employees/L_Clients_Em';
import L_Employees_Em from '../Layouts/LS_Employees/L_Employees_Em';
import { getEmployeeById } from '../Services/employeeService'; // Importa el método desde el servicio
import './Vistas.css';
import L_Especie_Em from '../Layouts/LS_Employees/L_Especie_Em';
import L_Race_Em from '../Layouts/LS_Employees/L_Race_Em';
import L_Categoria_Em from '../Layouts/LS_Employees/L_Categoria_Em';

function V_Employee() {
  const [employeeData, setEmployeeData] = useState(null);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    // Validar credenciales en localStorage
    if (!userId || !userType) {
      alert('Sin credenciales. Redirigiendo al inicio de sesión.');
      setRedirect('/login');
      return;
    }

    if (userType !== 'empleado') {
      alert('No eres un empleado. Redirigiendo...');
      setRedirect('/cliente');
      return;
    }

    // Llamada al backend para obtener datos del empleado
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeById(userId); // Llama al método de Axios
        setEmployeeData(data); // Guarda los datos del empleado
      } catch (error) {
        console.error('Error al obtener los datos del empleado:', error);
        alert('Error al obtener los datos del empleado. Redirigiendo al inicio de sesión.');
        setRedirect('/login'); // Redirigir al login si ocurre un error
      }
    };

    fetchEmployeeData();
  }, []);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <div className='layout-container'>
      <div className='layout-aside'>
        {/* Mostrar el componente C_Aside_Em solo si los datos del empleado están disponibles */}
        {employeeData && <C_Aside_Em nameEmpleado={employeeData.firstLastName} rol={employeeData.rol.name} />}
      </div>

      <div className='layout-content'>
        <Routes>
          <Route>
            <Route path="agenda/*" element={<L_Agenda_Em />} />
            <Route path="perfil/*" element={<L_Profile_Em />} />
            <Route path="mascotas/*" element={<L_Pets_Em />} />
            <Route path="servicios/*" element={<L_Services_Em />} />
            <Route path="citas/*" element={<L_Citas_Em />} />
            <Route path="empleados/*" element={<L_Employees_Em />} />
            <Route path="clientes/*" element={<L_Clients_Em />} />
            <Route path="reportes/*" element={<L_Reports_Em />} />
            <Route path="especies/*" element={<L_Especie_Em />} />      
            <Route path="razas/*" element={<L_Race_Em />} />        
            <Route path="categorias/*" element={<L_Categoria_Em />} />
            <Route path="/" element={<Navigate to="agenda" />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default V_Employee;
