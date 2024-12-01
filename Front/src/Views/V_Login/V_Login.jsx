import React, { useState } from 'react'; 
import { Navigate } from 'react-router-dom';
import { login } from '../../Services/AuthService';
import "./V_Login.css";

function V_Login() {
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');  
    const [redirect, setRedirect] = useState(null);  
    const [error, setError] = useState(''); 

    const setTemporaryStorage = (key, value, expirationInMs) => {
        const expirationTime = new Date().getTime() + expirationInMs; 
        const item = { value, expirationTime };
        localStorage.setItem(key, JSON.stringify(item)); // Guardar el objeto en localStorage
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const data = await login(email, password);

            // ** Almacenar el token en localStorage **
            localStorage.setItem('authToken', data.token);

            // Guardar la información del usuario en localStorage
            if (data.user.type === 'empleado') {
                localStorage.setItem('userType', 'empleado');
                localStorage.setItem('userId', data.user.id);
                setRedirect('/empleado');
            } else if (data.user.type === 'cliente') {
                localStorage.setItem('userType', 'cliente');
                localStorage.setItem('userId', data.user.id);
                setRedirect('/cliente');
            } else {
                setError('Tipo de usuario desconocido');
            }
        } catch (err) {
            console.error('Error en la autenticación:', err);
            setError('Correo o contraseña incorrectos.');  
        }
    };

    // Redirigir al usuario si la autenticación fue exitosa
    if (redirect) {
        return <Navigate to={redirect} replace />;
    }

    return (
        <div className='V_login'>
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">Iniciar Sesión</h1>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label htmlFor="email">Correo</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="login-input"
                                placeholder="Ingrese su correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="login-input"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="login-error">{error}</p>}
                        <button type="submit" className="login-submit-btn">
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default V_Login;
