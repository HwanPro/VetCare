import React, { useEffect, useState } from 'react';
import Box_Text_Bloq from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Bloq.jsx";
import Btn_Delete from '../../../Components/CS_General/Buttons/Btn_Delete';
import PaymentButton from "../../../Components/CS_General/Buttons/PaymentButton.jsx"
import { getQuoteById, cancelQuote } from '../../../Services/quotesService';

function ModalViewQuoteCalendarCl({ idQuote, onClose }) {
    const [quoteDetails, setQuoteDetails] = useState(null);

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const data = await getQuoteById(idQuote);
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
            onClose();
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
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
                    </div>
                    <div className="modal-footer">
                        {quoteDetails.statusPag === '1' && quoteDetails.metPag?.idMetPag === 4 ? (
                            <PaymentButton 
                                Title={`${quoteDetails.service.name} (${quoteDetails.idQuote})`}
                                Unit_price={quoteDetails.service.price}
                            />
                        ) : null}
                        <Btn_Delete nameId={idQuote} onDelete={handleCancel} showContent="text+icon" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalViewQuoteCalendarCl;
