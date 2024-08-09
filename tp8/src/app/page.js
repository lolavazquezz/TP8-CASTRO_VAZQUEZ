"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../app/page.module.css';

export default function Home() {
  const [paises, setPaises] = useState([]);
  const [paisRandom, setPaisRandom] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(15); // Estado para el temporizador
  const [temporizadorActivo, setTemporizadorActivo] = useState(false); // Para manejar si el temporizador está activo

  useEffect(() => {
    axios.get("https://countriesnow.space/api/v0.1/countries/flag/images")
      .then(response => {
        setPaises(response.data.data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    if (paises.length > 0) {
      random(paises);
    }
  }, [paises]);

  useEffect(() => {
    if (temporizadorActivo) {
      const timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTemporizadorActivo(false);
            if (puntos>0) {
            setPuntos(puntos - 1);
            } // Restar puntos si el tiempo se acaba
            random(paises);
            return 15; // Reiniciar el tiempo para la próxima bandera
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
    }
  }, [temporizadorActivo, paises, puntos]);

  const random = (e) => {
    if (e && e.length > 0) {
      const randomIndex = Math.floor(Math.random() * e.length);
      setPaisRandom(e[randomIndex]);
      setTemporizadorActivo(true); // Inicia el temporizador cuando se cambia la bandera
      setTiempoRestante(15); // Reinicia el temporizador a 15 segundos
    }
  };

  const verRespuesta = () => {
    if (paisRandom && respuesta.toLowerCase() === paisRandom.name.toLowerCase()) {
      setPuntos(puntos + 10);
    } else {
      if (puntos > 0) {
        setPuntos(puntos - 1);
      }
    }
    random(paises);
    setRespuesta('');
  };

  if (cargando) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Adiviná el país</h1>
      {paisRandom ? (
        <>
          <img
            src={paisRandom.flag}
            alt={`Flag of ${paisRandom.name}`}
            className={styles.flagimg}
          />
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ingrese el nombre del país"
              className={styles.inputfield}
            />
            <button
              onClick={verRespuesta}
              className={styles.submitbutton}
            >
              Enviar
            </button>
          </div>
          <div className={styles.timer}>
            <p>Tiempo restante: {tiempoRestante} s</p>
          </div>
        </>
      ) : (
        <p>No hay datos para mostrar</p>
      )}
      <div className={styles.score}>
        <p>Puntos: {puntos}</p>
      </div>
    </div>
  );
}
