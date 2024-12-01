import React, { useState, useEffect } from 'react';
import "../../Layouts/Layouts.css";
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import C_Calendar_Cl from '../../Components/CS_Clients/C_Calendar_Cl';
import C_StatisticalBox from '../../Components/CS_General/C_StatisticalBox/C_StatisticalBox';
import { getTotalActiveQuotesByClientId, getTodayActiveQuotesByClientId } from '../../Services/quotesService';

function L_Agenda_Cl() {
    const [totalActiveQuotes, setTotalActiveQuotes] = useState(0);
    const [todayActiveQuotes, setTodayActiveQuotes] = useState(0);
    const clientId = localStorage.getItem('userId'); // Obtén el ID del cliente del almacenamiento local

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const totalQuotes = await getTotalActiveQuotesByClientId(clientId);
                const todayQuotes = await getTodayActiveQuotesByClientId(clientId);

                setTotalActiveQuotes(totalQuotes);
                setTodayActiveQuotes(todayQuotes);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
            }
        };

        fetchStatistics();
    }, [clientId]);

    return (
        <section className="Layout">
            <div className="Content_Layout">
                <C_Title nameTitle="Agenda" />
                <div className="contenido-agenda">
                    <div className="content-contenido-agenda">
                        <C_StatisticalBox TitleStatistical="Citas de Hoy" NumberStatistical={todayActiveQuotes} />
                        <C_StatisticalBox TitleStatistical="Total de Citas" NumberStatistical={totalActiveQuotes} />
                    </div>
                    <div className="full-calendar">
                        <C_Calendar_Cl clientId={clientId} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default L_Agenda_Cl;
