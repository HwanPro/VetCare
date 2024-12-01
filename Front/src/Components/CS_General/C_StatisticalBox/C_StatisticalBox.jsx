import React from 'react'
import "./C_StatisticalBox.css"

function C_StatisticalBox({TitleStatistical,NumberStatistical}) {
  return (
    <div className='Estadistica'>
        <h5 className='TitleStatistical'>{TitleStatistical}</h5>
        <span className='NumberStatistical'>{NumberStatistical}</span>
    </div>
  )
}

export default C_StatisticalBox