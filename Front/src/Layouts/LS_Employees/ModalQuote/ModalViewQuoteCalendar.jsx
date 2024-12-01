import React, { useEffect, useState } from 'react';
import Box_Text_Bloq from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Bloq.jsx"
import Btn_ConfirmPag from '../../../Components/CS_General/Buttons/Btn_ConfirmPag.jsx';
import Btn_Delete from '../../../Components/CS_General/Buttons/Btn_Delete';
import Btn_Confirm from '../../../Components/CS_General/Buttons/Btn_Confirm';
import { getQuoteById, cancelQuote, confirmQuote, confirmPayment } from '../../../Services/quotesService.js';


function ModalViewQuoteCalendar({ idQuote, onClose }) {
    const [quoteDetails, setQuoteDetails] = useState(null);

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const data = await getQuoteById(idQuote); // Llamada a la API para obtener los detalles de la cita
                setQuoteDetails(data);
            } catch (error) {
                console.error('Error al obtener los detalles de la cita:', error);
            }
        };
        if (idQuote) {
            fetchQuoteDetails();
        }
    }, [idQuote]);

    const handleCancel = async () => {
        try {
            await cancelQuote(idQuote);
            alert('Cita cancelada con éxito');
            onClose(); // Cerrar el modal después de cancelar
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
        }
    };

    const handleConfirmQuote = async () => {
        try {
            await confirmQuote(idQuote);
            alert('Cita confirmada con éxito');
            onClose(); // Cerrar el modal después de confirmar
        } catch (error) {
            console.error('Error al confirmar la cita:', error);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            await confirmPayment(idQuote);
            alert('Pago confirmado con éxito');
            onClose(); // Cerrar el modal después de confirmar el pago
        } catch (error) {
            console.error('Error al confirmar el pago:', error);
        }
    };

    if (!quoteDetails) {
        return <p>Cargando detalles de la cita...</p>;
    }


    const interpretStatus = (status) => {
      switch (status) {
          case '1':
              return 'En espera';
          case '0':
              return 'Cancelado';
          case '2':
              return 'Vencido';
          case '3':
              return 'Confirmado';
          default:
              return 'Desconocido';
      }
  };

  const interpretPaymentStatus = (statusPag) => {
    switch (statusPag) {
        case '1':
            return 'Pendiente';
        case '2':
            return 'Pagado';
        default:
            return 'Desconocido';
    }
};
    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalles de la Cita</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <Box_Text_Bloq Label="ID Cita" V_Text={quoteDetails.idQuote} />
                        <Box_Text_Bloq Label="Fecha" V_Text={quoteDetails.date} />
                        <Box_Text_Bloq Label="Hora" V_Text={quoteDetails.hour} />
                        <Box_Text_Bloq Label="Estado" V_Text={interpretStatus(quoteDetails.status)} />
                        <Box_Text_Bloq Label="Estado de Pago" V_Text={interpretPaymentStatus(quoteDetails.statusPag)} />
                        <Box_Text_Bloq Label="Servicio" V_Text={quoteDetails.service.name} />
                        <Box_Text_Bloq Label="Mascota" V_Text={quoteDetails.pet.name} />
                        <Box_Text_Bloq Label="Cliente" V_Text={`${quoteDetails.pet.client.firstName} ${quoteDetails.pet.client.firstLastName}`} />
                    </div>
                    <div className="modal-footer">
                        {quoteDetails.statusPag === '1' && (
                            <Btn_ConfirmPag
                                nameId={quoteDetails.idQuote}
                                showContent="text+icon"
                                onClick={() => onConfirmPayment(quoteDetails.idQuote)}
                            />
                        )}
                        <Btn_Delete nameId={idQuote} onDelete={handleCancel} showContent="text+icon" />
                        <Btn_Confirm nameId={idQuote} onClick={handleConfirmQuote} showContent="text+icon" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalViewQuoteCalendar;
