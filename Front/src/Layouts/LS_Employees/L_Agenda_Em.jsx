import React, { useState, useEffect } from 'react';
import { getTotalActiveQuotes, getTodayActiveQuotes } from '../../Services/quotesService.js';
import { getTotalActivePets } from '../../Services/PetService.js';
import "../../Layouts/Layouts.css"
import C_Title from '../../Components/CS_General/C_Title/C_Title'
import C_Calendar from '../../Components/CS_Employees/C_Calendar'
import C_StatisticalBox from '../../Components/CS_General/C_StatisticalBox/C_StatisticalBox'

function L_Agenda_Em() {
  const [totalActiveQuotes, setTotalActiveQuotes] = useState(0);
  const [todayActiveQuotes, setTodayActiveQuotes] = useState(0);
  const [totalActivePets, setTotalActivePets] = useState(0);

  useEffect(() => {
    // Obtener estadísticas
    const fetchData = async () => {
      try {
        const totalQuotes = await getTotalActiveQuotes();
        const todayQuotes = await getTodayActiveQuotes();
        const activePets = await getTotalActivePets();

        setTotalActiveQuotes(totalQuotes);
        setTodayActiveQuotes(todayQuotes);
        setTotalActivePets(activePets);
      } catch (error) {
        console.error('Error al obtener las estadísticas de agenda:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className='Layout'>
        <div className='Content_Layout'>
            <C_Title nameTitle={"Agenda"}/>
            <div className='contenido-agenda'>
              <div className=''>
                <C_StatisticalBox TitleStatistical={"Citas de Hoy"} NumberStatistical={todayActiveQuotes}></C_StatisticalBox>
                <C_StatisticalBox TitleStatistical={"Pacientes Activos"} NumberStatistical={totalActivePets}></C_StatisticalBox>
                <C_StatisticalBox TitleStatistical={"Total de Citas en espera:"} NumberStatistical={totalActiveQuotes}></C_StatisticalBox>
              </div>
              <div className='full-calendar'>
                <C_Calendar />
              </div>
            </div>
        </div>
    </section>
  );
}

export default L_Agenda_Em;
