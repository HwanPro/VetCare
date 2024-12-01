import React, { useEffect, useState } from "react";
import { getEmployeeById } from "../../../Services/employeeService";
import "./C_CardData.css";

function C_CardData() {
    const DirImgs = "/Img/";
    const [dataProfile, setDataProfile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            const userId = localStorage.getItem("userId");
            const userType = localStorage.getItem("userType");

            if (!userId || userType !== "empleado") {
                setErrorMessage("Credenciales no válidas o tipo de usuario incorrecto.");
                return;
            }

            try {
                const data = await getEmployeeById(userId);
                setDataProfile(data);
            } catch {
                setErrorMessage("Error al obtener los datos del perfil.");
            }
        };

        fetchProfileData();
    }, []);

    if (errorMessage) return <p className="text-danger">{errorMessage}</p>;
    if (!dataProfile) return <p>Cargando datos del perfil...</p>;

    return (
        <div className="container">
            <div className="preview">
                <div className="imagenProfile">
                    <img
                        className="imagenP"
                        src={DirImgs + dataProfile.dirImage}
                        alt="Foto Usuario"
                    />
                </div>
                <div className="info">
                    <h4>
                        {dataProfile.firstName + " " + dataProfile.firstLastName}
                    </h4>
                    <label>DNI: {dataProfile.dni}</label>
                    <label className="caracterT">CMVP: {dataProfile.cmvp}</label>
                </div>
            </div>
        </div>
    );
}

export default C_CardData;
