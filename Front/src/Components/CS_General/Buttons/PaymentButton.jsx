import React, { useState, useEffect } from 'react';
import { Wallet } from '@mercadopago/sdk-react';
import { createPreference } from '../../../Services/mercadoPagoService';

const PaymentButton = ({Title, Unit_price}) => {
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        const fetchPreference = async () => {
            const userBuyer = {
                title: Title,
                quantity: 1,
                unit_price:Unit_price,
            };

            try {
                const id = await createPreference(userBuyer); // Llama a tu backend para obtener el ID de la preferencia
                setPreferenceId(id);
            } catch (error) {
                console.error('Error al crear la preferencia:', error);
            }
        };

        fetchPreference();
    }, []);

    return (
        <div>
            {preferenceId ? (
                <Wallet
                    initialization={{
                        preferenceId: preferenceId, // ID de la preferencia desde el backend
                    }}
                    customization={{
                        texts: { valueProp: 'smart_option' }, // Personalización del texto
                    }}
                />
            ) : (
                <p>Generando preferencia de pago...</p>
            )}
        </div>
    );
};

export default PaymentButton;
