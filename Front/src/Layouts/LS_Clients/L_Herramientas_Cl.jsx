import React, { useState } from 'react';
import './LS_Client.css';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import { hitOpenaiApi } from '../../Services/openaiService'; // Asegúrate de que la ruta al servicio sea correcta

function L_Herramientas_Cl() {
  const [prompt, setPrompt] = useState(''); // Estado para el input del usuario
  const [response, setResponse] = useState(''); // Estado para almacenar la respuesta del backend
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    setLoading(true); // Activar indicador de carga

    try {
      const result = await hitOpenaiApi(prompt); // Llamada al servicio
      setResponse(result); // Actualizar la respuesta con el contenido recibido
    } catch (err) {
      setError(err); // Manejar errores
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  };

  return (
    <section className='Layout'>
      <div className='Content_Layout'>
        <C_Title nameTitle={'Herramientas'} />
        
        <form onSubmit={handleSubmit} className='form-container'>
          <textarea
            className='input-prompt'
            placeholder='Escribe tu solicitud aquí...'
            value={prompt}
            onChange={handlePromptChange}
            rows={4}
          ></textarea>
          <button type='submit' className='submit-button' disabled={loading}>
            {loading ? 'Cargando...' : 'Enviar'}
          </button>
        </form>

        {error && <p className='error-message'>Error: {error}</p>}

        {response && (
          <div className='response-container'>
            <h3>Respuesta:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default L_Herramientas_Cl;
