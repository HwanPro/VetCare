import React from "react";
import "./DateTimePicker.css";

function DateTimePicker({
  label,
  type,
  name,
  value,
  onChange,
  timeStep = "00:15:00", // Formato HH:mm:ss
  dateRestriction = "all", // Opciones: "all", "past", "future"
}) {
  // Obtener la fecha actual en formato peruano (YYYY-MM-DD)
  const getPeruDate = () => {
    const peruDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [month, day, year] = peruDate.split("/");
    return `${year}-${month}-${day}`;
  };

  const peruDate = getPeruDate();

  // Convertir el formato HH:mm:ss a minutos totales
  const parseTimeStep = (step) => {
    const [hours, minutes, seconds] = step.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  };

  const stepInMinutes = parseTimeStep(timeStep);

  // Generar opciones de tiempo
  const generateTimeOptions = () => {
    const options = [];
    let [hours, minutes] = [9, 0]; // Empieza a las 9:00 AM
    const maxTime = "20:00"; // Límite de tiempo 8:00 PM

    while (`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}` <= maxTime) {
      options.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
      minutes += stepInMinutes;

      if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="datetime-picker">
      <label className="datetime-label">{label}:</label>
      {type === "date" ? (
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          className="datetime-input"
          min={dateRestriction === "future" ? peruDate : undefined}
          max={dateRestriction === "past" ? peruDate : undefined}
        />
      ) : type === "time" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="datetime-input"
        >
          <option value="" disabled>
            Seleccione un horario
          </option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

export default DateTimePicker;
